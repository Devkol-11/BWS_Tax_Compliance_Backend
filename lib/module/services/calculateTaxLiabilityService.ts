import * as input from '../types/requestTypes.js';
import * as output from '../types/responseTypes.js';
import * as Errors from '../../utils/appError.js';
import { TaxHelpers } from '../helpers/logic/taxHelpers.js';
import { Ai } from '../../config/Ai.js';
import { buildTaxCalculationPrompt } from '../helpers/promptBuilders/buildTaxCalculationPrompt.js';

export class CalculateTaxLiabilityService {
        static async execute(data: input.calculateTaxRequest): Promise<output.CalculateTaxResponse> {
                // 1. Classify taxpayer
                const taxpayerType = TaxHelpers.classifyTaxPayerType({
                        taxpayer: data.taxpayer,
                        residencyAndPresence: data.residencyAndPresence,
                        incomeProfile: { incomeTypes: [] },
                        sizeProfile: { annualTurnoverRange: '<25m' }
                } as any);

                if (taxpayerType === 'undetermined') {
                        throw new Errors.InvalidRequestError(
                                'Unable to determine taxpayer type for tax calculation'
                        );
                }

                // 2. Normalize income
                const totalIncome = TaxHelpers.calculateTotalIncome(data.incomeFigures);
                const totalDeductions = TaxHelpers.calculateTotalDeductions(data.deductions);
                const taxableIncome = Math.max(0, totalIncome - totalDeductions);

                const taxBreakdown: output.CalculateTaxResponse['taxBreakdown'] = [];
                let totalTaxPayable = 0;

                // 3. Apply correct tax formula
                if (taxpayerType === 'resident_individual' || taxpayerType === 'non_resident_individual') {
                        const pit = TaxHelpers.calculatePersonalIncomeTax(taxableIncome);

                        taxBreakdown.push({
                                tax: 'Personal Income Tax (PIT)',
                                amount: pit,
                                basis: 'Progressive PIT rates applied to taxable income'
                        });

                        totalTaxPayable += pit;
                }

                if (taxpayerType === 'resident_company') {
                        const cit = TaxHelpers.calculateCompaniesIncomeTax(taxableIncome);

                        taxBreakdown.push({
                                tax: 'Companies Income Tax (CIT)',
                                amount: cit,
                                basis: '30% of taxable company profit'
                        });

                        totalTaxPayable += cit;
                }

                if (taxpayerType === 'non_resident_company_with_sep') {
                        const sepCit = TaxHelpers.calculateSEP_CIT(
                                data.incomeFigures.digitalServicesIncome ?? 0
                        );

                        taxBreakdown.push({
                                tax: 'Companies Income Tax (SEP)',
                                amount: sepCit,
                                basis: 'Deemed profit on Nigerian digital revenue'
                        });

                        totalTaxPayable += sepCit;
                }

                // 4. AI explanation (non-authoritative)
                const prompt = buildTaxCalculationPrompt({
                        taxpayerType,
                        taxBreakdown,
                        totalTaxPayable
                });

                const aiText = await Ai.generateText(prompt);
                const ai_analysis = this.parseAiResponse(aiText);

                return {
                        classification: { taxpayerType },
                        taxBreakdown,
                        totalTaxPayable,
                        ai_analysis,
                        confidenceLevel: 'medium'
                };
        }

        private static parseAiResponse(text: string): output.CalculateTaxResponse['ai_analysis'] {
                return {
                        legalExplanation: text,
                        plainEnglishSummary: text,
                        keyAssumptions: []
                };
        }
}
