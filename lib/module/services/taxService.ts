import * as T from "../types/requestTypes";
import { TaxHelpers } from "../helpers/taxHelpers";
import { Ai } from "../../config/Ai";

export class TaxService {
  static async analyzeTaxScope(data: T.analyzeTaxScopeRequest) {
    const entityType = TaxHelpers.determineResidency(data);
    const stringifiedData = JSON.stringify(data);
  }
}
