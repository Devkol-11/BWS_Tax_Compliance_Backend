import * as T from '../../types/requestTypes.js';

export class TaxHelpers {
        static classifyTaxPayerType(
                input: T.analyzeTaxScopeRequest
        ):
                | 'resident_individual'
                | 'non_resident_individual'
                | 'resident_company'
                | 'non_resident_company'
                | 'non_resident_company_with_sep'
                | 'undetermined' {
                const { legalForm } = input.taxpayer;
                const presence = input.residencyAndPresence;

                // Individuals
                if (legalForm === 'individual') {
                        if (presence.livesInNigeria === true) {
                                return 'resident_individual';
                        }
                        return 'non_resident_individual';
                }

                // Nigerian companies
                if (legalForm === 'company' && input.taxpayer.incorporationCountry === 'Nigeria') {
                        return 'resident_company';
                }

                // Foreign companies
                if (legalForm === 'foreign_company') {
                        const hasSEP = this.hasSignificantEconomicPresence(input);
                        if (hasSEP) {
                                return 'non_resident_company_with_sep';
                        }
                        return 'non_resident_company';
                }

                return 'undetermined';
        }

        static determineTaxReach(
                taxpayerType:
                        | 'resident_individual'
                        | 'non_resident_individual'
                        | 'resident_company'
                        | 'non_resident_company'
                        | 'non_resident_company_with_sep'
        ): 'worldwide_income' | 'nigerian_source_income' {
                if (taxpayerType === 'resident_individual' || taxpayerType === 'resident_company') {
                        return 'worldwide_income';
                }

                return 'nigerian_source_income';
        }

        static hasSignificantEconomicPresence(input: T.analyzeTaxScopeRequest): boolean {
                const p = input.residencyAndPresence;

                return Boolean(p.earnsFromNigeria && p.providesDigitalServices && p.targetsNigeriaMarket);
        }

        static determineSizeCategory(
                turnover: T.analyzeTaxScopeRequest['sizeProfile']['annualTurnoverRange']
        ): 'micro' | 'small' | 'medium' | 'large' {
                switch (turnover) {
                        case '<25m':
                                return 'micro';
                        case '25m-100m':
                                return 'small';
                        case '100m-500m':
                                return 'medium';
                        case '>500m':
                                return 'large';
                        default:
                                return 'large';
                }
        }

        static determineApplicableTaxes(
                taxpayerType:
                        | 'resident_individual'
                        | 'non_resident_individual'
                        | 'resident_company'
                        | 'non_resident_company'
                        | 'non_resident_company_with_sep',
                input: T.analyzeTaxScopeRequest
        ): Array<{ tax: string; basis: string }> {
                const taxes: Array<{ tax: string; basis: string }> = [];

                // Personal Income Tax
                if (taxpayerType === 'resident_individual' || taxpayerType === 'non_resident_individual') {
                        taxes.push({
                                tax: 'Personal Income Tax (PIT)',
                                basis: 'Income earned by an individual under Nigerian tax law'
                        });
                }

                // Companies Income Tax
                if (taxpayerType === 'resident_company' || taxpayerType === 'non_resident_company_with_sep') {
                        taxes.push({
                                tax: 'Companies Income Tax (CIT)',
                                basis:
                                        taxpayerType === 'resident_company'
                                                ? 'Company resident in Nigeria'
                                                : 'Significant Economic Presence in Nigeria'
                        });
                }

                // VAT
                if (
                        input.residencyAndPresence.earnsFromNigeria &&
                        input.incomeProfile.incomeTypes.length > 0
                ) {
                        taxes.push({
                                tax: 'Value Added Tax (VAT)',
                                basis: 'Supply of taxable goods or services to Nigeria'
                        });
                }

                // Development Levy (generic)
                taxes.push({
                        tax: 'Development Levy',
                        basis: 'Statutory levy under Nigerian tax reforms'
                });

                return taxes;
        }

        static determineApplicableLaws(
                taxpayerType:
                        | 'resident_individual'
                        | 'non_resident_individual'
                        | 'resident_company'
                        | 'non_resident_company'
                        | 'non_resident_company_with_sep'
        ): string[] {
                const laws: string[] = [];

                if (taxpayerType === 'resident_individual' || taxpayerType === 'non_resident_individual') {
                        laws.push('Personal Income Tax Act');
                }

                if (
                        taxpayerType === 'resident_company' ||
                        taxpayerType === 'non_resident_company' ||
                        taxpayerType === 'non_resident_company_with_sep'
                ) {
                        laws.push('Companies Income Tax Act');
                }

                if (taxpayerType === 'non_resident_company_with_sep') {
                        laws.push('Significant Economic Presence Rules');
                }

                laws.push('Value Added Tax Act');

                return laws;
        }

        // ---------------------------------Income normalization---------------------------------------

        static calculateTotalIncome(income: {
                employmentIncome?: number;
                businessIncome?: number;
                digitalServicesIncome?: number;
                passiveIncome?: number;
        }): number {
                return (
                        (income.employmentIncome ?? 0) +
                        (income.businessIncome ?? 0) +
                        (income.digitalServicesIncome ?? 0) +
                        (income.passiveIncome ?? 0)
                );
        }

        // PIT (simplified bands)

        static calculatePersonalIncomeTax(taxableIncome: number): number {
                let tax = 0;

                const bands = [
                        { limit: 300000, rate: 0.07 },
                        { limit: 300000, rate: 0.11 },
                        { limit: 500000, rate: 0.15 },
                        { limit: 500000, rate: 0.19 },
                        { limit: 1600000, rate: 0.21 },
                        { limit: Infinity, rate: 0.24 }
                ];

                let remaining = taxableIncome;

                for (const band of bands) {
                        if (remaining <= 0) break;
                        const taxableAtBand = Math.min(remaining, band.limit);
                        tax += taxableAtBand * band.rate;
                        remaining -= taxableAtBand;
                }

                return tax;
        }
        // CIT (flat rate v1)

        static calculateCompaniesIncomeTax(profit: number): number {
                const CIT_RATE = 0.3;
                return profit * CIT_RATE;
        }

        // SEP deemed profit

        static calculateSEP_CIT(nigerianRevenue: number): number {
                const DEEMED_PROFIT_RATE = 0.2;
                const CIT_RATE = 0.3;

                const deemedProfit = nigerianRevenue * DEEMED_PROFIT_RATE;
                return deemedProfit * CIT_RATE;
        }

        // Deduction aggregation

        static calculateTotalDeductions(deductions?: {
                pension?: number;
                nhf?: number;
                nhis?: number;
                capitalAllowances?: number;
        }): number {
                if (!deductions) return 0;

                return (
                        (deductions.pension ?? 0) +
                        (deductions.nhf ?? 0) +
                        (deductions.nhis ?? 0) +
                        (deductions.capitalAllowances ?? 0)
                );
        }

        // ------------------------------Relief detectors----------------------------

        static detectIndividualReliefs(input: {
                expenseProfile?: {
                        paysPension?: boolean;
                };
        }): string[] {
                const reliefs: string[] = [];

                if (input.expenseProfile?.paysPension) {
                        reliefs.push('Pension Contribution Relief');
                }

                return reliefs;
        }

        static detectCompanyReliefs(input: {
                expenseProfile?: {
                        hasEmployees?: boolean;
                        incursRAndD?: boolean;
                        capitalAssetsPurchased?: boolean;
                };
                businessProfile?: {
                        exportOriented?: boolean;
                        locatedInFreeTradeZone?: boolean;
                };
        }): string[] {
                const reliefs: string[] = [];

                if (input.expenseProfile?.hasEmployees) {
                        reliefs.push('Wage Deduction Allowance');
                }

                if (input.expenseProfile?.incursRAndD) {
                        reliefs.push('Research and Development Allowance');
                }

                if (input.expenseProfile?.capitalAssetsPurchased) {
                        reliefs.push('Capital Allowances');
                }

                if (input.businessProfile?.exportOriented) {
                        reliefs.push('Export Expansion Incentives');
                }

                if (input.businessProfile?.locatedInFreeTradeZone) {
                        reliefs.push('Free Trade Zone Tax Relief');
                }

                return reliefs;
        }

        //---------------------------- Incentive matching -----------------------------------------

        static detectIncentiveCategories(input: {
                businessProfile: {
                        sector: string;
                        startupAgeYears?: number;
                        exportOriented?: boolean;
                        locatedInFreeTradeZone?: boolean;
                        usesLocalRawMaterials?: boolean;
                };
        }): Array<{ incentive: string; reasonMatched: string }> {
                const incentives: Array<{ incentive: string; reasonMatched: string }> = [];
                const sector = input.businessProfile.sector.toLowerCase();

                if (
                        sector.includes('technology') ||
                        sector.includes('software') ||
                        sector.includes('fintech')
                ) {
                        incentives.push({
                                incentive: 'Pioneer Status Incentive',
                                reasonMatched: 'Business operates in a priority or emerging sector'
                        });
                }

                if (
                        input.businessProfile.startupAgeYears !== undefined &&
                        input.businessProfile.startupAgeYears <= 5
                ) {
                        incentives.push({
                                incentive: 'Startup Tax Relief Programs',
                                reasonMatched: 'Business appears to be an early-stage company'
                        });
                }

                if (input.businessProfile.exportOriented) {
                        incentives.push({
                                incentive: 'Export Expansion Grant',
                                reasonMatched: 'Business earns income from exports'
                        });
                }

                if (input.businessProfile.locatedInFreeTradeZone) {
                        incentives.push({
                                incentive: 'Free Trade Zone Incentives',
                                reasonMatched: 'Operations located within a designated free trade zone'
                        });
                }

                if (input.businessProfile.usesLocalRawMaterials) {
                        incentives.push({
                                incentive: 'Local Raw Material Utilization Incentives',
                                reasonMatched: 'Business uses locally sourced raw materials'
                        });
                }

                return incentives;
        }

        // ------------------------VAT invoice checks-----------------------------

        static checkSupplierDetails(input: {
                supplier: {
                        name: string;
                        tin?: string;
                };
        }) {
                return {
                        rule: 'Supplier identification',
                        passed: Boolean(input.supplier.name),
                        message: input.supplier.name ? 'Supplier name present' : 'Supplier name is missing'
                };
        }

        static checkInvoiceMetadata(input: {
                invoice: {
                        invoiceNumber: string;
                        issueDate: string;
                };
        }) {
                return {
                        rule: 'Invoice metadata',
                        passed: Boolean(input.invoice.invoiceNumber && input.invoice.issueDate),
                        message: 'Invoice number and issue date must be present'
                };
        }

        static checkLineItems(input: {
                invoice: {
                        items: Array<{
                                description: string;
                                quantity: number;
                                unitPrice: number;
                        }>;
                };
        }) {
                const valid =
                        input.invoice.items.length > 0 &&
                        input.invoice.items.every((i) => i.description && i.quantity > 0 && i.unitPrice >= 0);

                return {
                        rule: 'Line items',
                        passed: valid,
                        message: valid
                                ? 'Invoice has valid line items'
                                : 'Invoice items are missing or invalid'
                };
        }

        static checkVATDisclosure(input: {
                supplier: {
                        vatRegistered?: boolean;
                };
                invoice: {
                        vatAmount?: number;
                };
        }) {
                if (!input.supplier.vatRegistered) {
                        return {
                                rule: 'VAT disclosure',
                                passed: true,
                                message: 'Supplier not VAT registered'
                        };
                }

                const passed = typeof input.invoice.vatAmount === 'number';

                return {
                        rule: 'VAT disclosure',
                        passed,
                        message: passed
                                ? 'VAT amount disclosed'
                                : 'VAT registered supplier must disclose VAT amount'
                };
        }

        //------------------------------- SEP indicators---------------------------

        static evaluateSEPIndicators(input: {
                nigeriaActivities: {
                        earnsFromNigeria: boolean;
                        providesDigitalServices: boolean;
                        targetsNigeriaMarket: boolean;
                        hasLocalAgents?: boolean;
                        hasPhysicalOffice?: boolean;
                };
        }) {
                const indicators = [
                        {
                                indicator: 'Earns income from Nigeria',
                                present: input.nigeriaActivities.earnsFromNigeria,
                                explanation: 'Revenue derived from Nigerian customers'
                        },
                        {
                                indicator: 'Provides digital services',
                                present: input.nigeriaActivities.providesDigitalServices,
                                explanation: 'Digital or remote service delivery'
                        },
                        {
                                indicator: 'Targets Nigerian market',
                                present: input.nigeriaActivities.targetsNigeriaMarket,
                                explanation: 'Marketing or pricing directed at Nigeria'
                        },
                        {
                                indicator: 'Uses local agents',
                                present: Boolean(input.nigeriaActivities.hasLocalAgents),
                                explanation: 'Dependent agents operating in Nigeria'
                        },
                        {
                                indicator: 'Physical presence',
                                present: Boolean(input.nigeriaActivities.hasPhysicalOffice),
                                explanation: 'Office or fixed base in Nigeria'
                        }
                ];

                return indicators;
        }

        static determineSEP(indicators: Array<{ present: boolean }>): boolean {
                const coreIndicators = indicators.slice(0, 3);
                return coreIndicators.every((i) => i.present);
        }

        // ----------------------------Audit document helpers--------------------------------

        static classifyDocumentType(type: string): {
                documentType: string;
                typicalTreatment: 'allowable' | 'disallowable' | 'conditional';
        } {
                switch (type) {
                        case 'receipt':
                        case 'invoice':
                        case 'payroll_record':
                                return {
                                        documentType: type,
                                        typicalTreatment: 'allowable'
                                };

                        case 'contract':
                        case 'bank_statement':
                                return {
                                        documentType: type,
                                        typicalTreatment: 'conditional'
                                };

                        default:
                                return {
                                        documentType: 'other',
                                        typicalTreatment: 'conditional'
                                };
                }
        }

        static checkBasicDocumentFields(input: {
                document: {
                        description: string;
                        date?: string;
                        vendorName?: string;
                };
        }) {
                const passed = Boolean(
                        input.document.description && input.document.date && input.document.vendorName
                );

                return {
                        check: 'Basic document details',
                        passed,
                        message: passed
                                ? 'Description, date, and vendor present'
                                : 'Missing description, date, or vendor name'
                };
        }

        static checkBusinessRelevance(input: {
                expenseContext?: {
                        relatesToBusiness?: boolean;
                };
        }) {
                const passed = input.expenseContext?.relatesToBusiness === true;

                return {
                        check: 'Business relevance',
                        passed,
                        message: passed
                                ? 'Expense appears business-related'
                                : 'Expense may be personal or unrelated'
                };
        }

        static checkCapitalVsRevenue(input: {
                expenseContext?: {
                        capitalOrRevenue?: 'capital' | 'revenue';
                };
        }) {
                if (!input.expenseContext?.capitalOrRevenue) {
                        return {
                                check: 'Capital vs revenue',
                                passed: false,
                                message: 'Unable to determine capital or revenue nature'
                        };
                }

                return {
                        check: 'Capital vs revenue',
                        passed: true,
                        message: `Expense classified as ${input.expenseContext.capitalOrRevenue}`
                };
        }

        // --------------------------TIN registration---------------------------

        static getTinSteps(taxpayerType: 'individual' | 'company' | 'foreign_company') {
                switch (taxpayerType) {
                        case 'company':
                                return [
                                        {
                                                step: 1,
                                                title: 'Incorporate with CAC',
                                                description:
                                                        'Register the company with the Corporate Affairs Commission (CAC).'
                                        },
                                        {
                                                step: 2,
                                                title: 'Apply for TIN',
                                                description:
                                                        'TIN is automatically generated after CAC registration or can be obtained via FIRS.'
                                        },
                                        {
                                                step: 3,
                                                title: 'Register with FIRS',
                                                description:
                                                        'Complete FIRS registration for tax administration purposes.'
                                        }
                                ];

                        case 'foreign_company':
                                return [
                                        {
                                                step: 1,
                                                title: 'Register with FIRS',
                                                description:
                                                        'Apply directly to FIRS for a TIN as a non-resident entity.'
                                        },
                                        {
                                                step: 2,
                                                title: 'Appoint local representative',
                                                description:
                                                        'Provide details of Nigerian tax representative, if required.'
                                        }
                                ];

                        default:
                                return [
                                        {
                                                step: 1,
                                                title: 'Visit Joint Tax Board portal',
                                                description:
                                                        'Apply for TIN via the Joint Tax Board (JTB) or FIRS.'
                                        },
                                        {
                                                step: 2,
                                                title: 'Submit identification',
                                                description: 'Provide valid ID and personal information.'
                                        }
                                ];
                }
        }

        static getTinRequiredDocuments(taxpayerType: 'individual' | 'company' | 'foreign_company'): string[] {
                if (taxpayerType === 'company') {
                        return [
                                'CAC Certificate',
                                'Memorandum & Articles of Association',
                                'Director identification'
                        ];
                }

                if (taxpayerType === 'foreign_company') {
                        return [
                                'Certificate of incorporation (foreign)',
                                'Details of Nigerian operations',
                                'Local tax representative details'
                        ];
                }

                return ['Valid government ID', 'Proof of address'];
        }

        static getTinChannels(): string[] {
                return [
                        'Federal Inland Revenue Service (FIRS)',
                        'Joint Tax Board (JTB)',
                        'Corporate Affairs Commission (CAC) for companies'
                ];
        }
}
