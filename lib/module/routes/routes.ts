import { Router } from "express";
import { TaxService } from "../services/taxService";
import * as T from "../types/requestTypes";
import { HttpHelpers } from "../../utils/httpHelpers";
import { httpStatusCode } from "@lib/utils/httpStatusCodes";

export function initilalizeRoutes() {
  const taxRouter = Router();

  taxRouter.post("/profile-analyze", (req, res) => {
    try {
      const body = req.body as T.analyzeTaxScopeRequest;
      const response = TaxService.analyzeTaxScope(body);
      HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
    } catch (error) {
      HttpHelpers.sendError(res, httpStatusCode.INTERNAL_SERVER_ERROR, error);
    }
  });

  return taxRouter;
}
