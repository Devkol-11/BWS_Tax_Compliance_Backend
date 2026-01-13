export interface analyzeTaxScopeRequest {
  taxpayer: {
    legalForm: "individual" | "company" | "foreign_company";
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
      "employment" | "trade_or_business" | "digital_services" | "passive_income"
    >;
  };

  sizeProfile: {
    annualTurnoverRange: "<25m" | "25m-100m" | "100m-500m" | ">500m";
  };
}

export interface calculateTaxRequest {}

export interface optimizeSavingsReuest {}

export interface validateInvoiceRequest {}

export interface aiIncentiveFinderRequest {}

export interface nonResident_SEP_Request {}

export interface auditDocumentRequest {}
