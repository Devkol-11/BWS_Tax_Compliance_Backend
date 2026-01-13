export interface analyzeTaxScopeResponse {
    taxScope: {
        residencyStatus: "resident" | "non_resident" | "undetermined";
        taxBase: "worldwide_income" | "nigerian_source_income" | "undetermined";
    };

    applicableTaxes: Array<{
        tax: "PIT" | "CIT" | "VAT" | "Development_Levy";
        reason: string;
    }>;

    assumptions: string[];

    confidenceLevel: "high" | "medium" | "low";
}

export interface CalculateTaxResponse {

}

export interface optimizeSavingsResponse {

}

export interface validateInvoiceResponse {

}

export interface aiIncentiveFinderResponse {

}

export interface nonResident_SEP_Response {

}