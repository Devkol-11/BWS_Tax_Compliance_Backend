import * as T from "../types/requestTypes";

export class TaxHelpers {
  static determineResidency(input: T.analyzeTaxScopeRequest) {
    if (
      input.taxpayer.legalForm == "individual" &&
      input.nigeriaConnections.livesInNigeria
    ) {
      return "resident";
    }
    if (
      input.entityType == "company" &&
      input.nigeriaConnections.managementInNigeria
    ) {
      return "resident";
    }
    if (input.entityType == "non_resident_company") {
      return "non_resident";
    }
    return "undetermined";
  }
}
