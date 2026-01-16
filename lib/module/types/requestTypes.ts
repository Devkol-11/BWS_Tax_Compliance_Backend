export interface analyzeTaxScopeRequest {
        taxpayer: {
                legalForm: 'individual' | 'company' | 'foreign_company';

                incorporationCountry?: string; // required if company
        };

        residencyAndPresence: {
                // Individuals
                livesInNigeria?: boolean;

                // Companies
                placeOfManagementInNigeria?: boolean;

                // Physical presence
                hasFixedBaseInNigeria?: boolean;
                employeesInNigeria?: boolean;

                // Economic / digital presence
                earnsFromNigeria?: boolean;
                providesDigitalServices?: boolean;
                targetsNigeriaMarket?: boolean;
        };

        incomeProfile: {
                incomeTypes: Array<
                        'employment' | 'trade_or_business' | 'digital_services' | 'passive_income'
                >;
        };

        sizeProfile: {
                annualTurnoverRange: '<25m' | '25m-100m' | '100m-500m' | '>500m';
        };
}

export interface calculateTaxRequest {
        taxpayer: {
                legalForm: 'individual' | 'company' | 'foreign_company';
                incorporationCountry?: string;
        };

        residencyAndPresence: {
                livesInNigeria?: boolean;
                placeOfManagementInNigeria?: boolean;

                earnsFromNigeria?: boolean;
                providesDigitalServices?: boolean;
                targetsNigeriaMarket?: boolean;
        };

        incomeFigures: {
                employmentIncome?: number;
                businessIncome?: number;
                digitalServicesIncome?: number;
                passiveIncome?: number;
        };

        deductions?: {
                pension?: number;
                nhf?: number;
                nhis?: number;
                capitalAllowances?: number;
        };

        accountingYear: number;
}

export interface optimizeSavingsReuest {
        taxpayer: {
                legalForm: 'individual' | 'company' | 'foreign_company';
                incorporationCountry?: string;
        };

        residencyAndPresence: {
                livesInNigeria?: boolean;
                placeOfManagementInNigeria?: boolean;

                earnsFromNigeria?: boolean;
                providesDigitalServices?: boolean;
        };

        incomeProfile: {
                incomeTypes: Array<
                        'employment' | 'trade_or_business' | 'digital_services' | 'passive_income'
                >;
        };

        expenseProfile?: {
                paysPension?: boolean;
                hasEmployees?: boolean;
                incursRAndD?: boolean;
                capitalAssetsPurchased?: boolean;
        };

        businessProfile?: {
                sector?: string;
                exportOriented?: boolean;
                locatedInFreeTradeZone?: boolean;
                startupAgeYears?: number;
        };
}

export interface complianceCalendarRequest {
        applicableTaxes: string[];
        accountingYear: number;
}

export interface validateInvoiceRequest {
        supplier: {
                name: string;
                tin?: string;
                address?: string;
                vatRegistered?: boolean;
        };

        customer: {
                name: string;
                address?: string;
        };

        invoice: {
                invoiceNumber: string;
                issueDate: string; // ISO date
                currency: 'NGN';
                items: Array<{
                        description: string;
                        quantity: number;
                        unitPrice: number;
                        vatRate?: number;
                }>;

                subtotal: number;
                vatAmount?: number;
                totalAmount: number;
        };
}

export interface aiIncentiveFinderRequest {
        taxpayer: {
                legalForm: 'individual' | 'company' | 'foreign_company';
                incorporationCountry?: string;
        };

        businessProfile: {
                sector: string; // free-text, e.g. "technology", "agriculture"
                activitiesDescription: string;

                startupAgeYears?: number;
                exportOriented?: boolean;
                locatedInFreeTradeZone?: boolean;
                usesLocalRawMaterials?: boolean;
        };

        residencyAndPresence: {
                placeOfManagementInNigeria?: boolean;
                operatesInNigeria?: boolean;
        };
}

export interface nonResident_SEP_Request {
        taxpayer: {
                legalForm: 'foreign_company';
                incorporationCountry: string;
        };

        nigeriaActivities: {
                earnsFromNigeria: boolean;
                providesDigitalServices: boolean;
                targetsNigeriaMarket: boolean;

                hasLocalAgents?: boolean;
                hasPhysicalOffice?: boolean;
        };

        revenueProfile?: {
                annualNigeriaRevenue?: number;
        };
}

export interface auditDocumentRequest {
        document: {
                type: 'receipt' | 'invoice' | 'contract' | 'bank_statement' | 'payroll_record' | 'other';

                description: string;
                amount?: number;
                currency?: 'NGN';

                date?: string; // ISO date
                vendorName?: string;
                vendorTin?: string;
        };

        expenseContext?: {
                relatesToBusiness?: boolean;
                capitalOrRevenue?: 'capital' | 'revenue';
                employeeRelated?: boolean;
        };
}

export interface chatExpertRequest {
        question: string;

        context?: {
                taxpayerType?: string;
                applicableTaxes?: string[];
        };
}

export interface tinRegistrationRequest {
        taxpayerType?: 'individual' | 'company' | 'foreign_company';
}
