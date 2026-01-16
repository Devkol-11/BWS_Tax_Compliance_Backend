export interface analyzeTaxScopeResponse {
        classification: {
                taxpayerType:
                        | 'resident_individual'
                        | 'non_resident_individual'
                        | 'resident_company'
                        | 'non_resident_company'
                        | 'non_resident_company_with_sep';

                taxReach: 'worldwide_income' | 'nigerian_source_income';

                sizeCategory: 'micro' | 'small' | 'medium' | 'large';
        };

        applicableLaws: string[];

        applicableTaxes: Array<{
                tax: string;
                basis: string;
        }>;

        ai_analysis: {
                legalExplanation: string;
                plainEnglishSummary: string;
                keyAssumptions: string[];
        };

        confidenceLevel: 'high' | 'medium' | 'low';
}

export interface CalculateTaxResponse {
        classification: {
                taxpayerType:
                        | 'resident_individual'
                        | 'non_resident_individual'
                        | 'resident_company'
                        | 'non_resident_company'
                        | 'non_resident_company_with_sep';
        };

        taxBreakdown: Array<{
                tax: string;
                amount: number;
                basis: string;
        }>;

        totalTaxPayable: number;

        ai_analysis: {
                legalExplanation: string;
                plainEnglishSummary: string;
                keyAssumptions: string[];
        };

        confidenceLevel: 'high' | 'medium' | 'low';
}

export interface optimizeSavingsResponse {
        potentialReliefs: Array<{
                relief: string;
                description: string;
                conditions: string[];
        }>;

        ai_analysis: {
                legalExplanation: string;
                plainEnglishSummary: string;
                keyAssumptions: string[];
        };

        confidenceLevel: 'high' | 'medium' | 'low';
}

export interface complianceCalendarResponse {
        deadlines: Array<{
                tax: string;
                filingDeadline: string;
                paymentDeadline: string;
                authority: string;
        }>;
}

export interface validateInvoiceResponse {
        isCompliant: boolean;

        checks: Array<{
                rule: string;
                passed: boolean;
                message: string;
        }>;

        ai_analysis: {
                legalExplanation: string;
                plainEnglishSummary: string;
                keyAssumptions: string[];
        };

        confidenceLevel: 'high' | 'medium' | 'low';
}

export interface aiIncentiveFinderResponse {
        matchedIncentives: Array<{
                incentive: string;
                reasonMatched: string;
        }>;

        ai_analysis: {
                legalExplanation: string;
                plainEnglishSummary: string;
                keyAssumptions: string[];
        };

        confidenceLevel: 'high' | 'medium' | 'low';
}

export interface nonResident_SEP_Response {
        hasSEP: boolean;

        indicators: Array<{
                indicator: string;
                present: boolean;
                explanation: string;
        }>;

        ai_analysis: {
                legalExplanation: string;
                plainEnglishSummary: string;
                keyAssumptions: string[];
        };

        confidenceLevel: 'high' | 'medium' | 'low';
}

export interface auditDocumentResponse {
        classification: {
                documentType: string;
                typicalTreatment: 'allowable' | 'disallowable' | 'conditional';
        };

        checks: Array<{
                check: string;
                passed: boolean;
                message: string;
        }>;

        ai_analysis: {
                legalExplanation: string;
                plainEnglishSummary: string;
                keyAssumptions: string[];
        };

        confidenceLevel: 'high' | 'medium' | 'low';
}

export interface tinRegistrationGuideResponse {
        steps: string[];
        requiredDocuments: string[];
        notes: string[];
}

export interface chatExpertResponse {
        answer: string;

        warnings?: string[];
}

export interface tinRegistrationResponse {
        taxpayerType: 'individual' | 'company' | 'foreign_company';

        steps: Array<{
                step: number;
                title: string;
                description: string;
        }>;

        requiredDocuments: string[];

        channels: string[];

        ai_analysis?: {
                plainEnglishSummary: string;
        };

        confidenceLevel: 'high';
}
