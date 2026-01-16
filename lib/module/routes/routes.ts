import { Router } from 'express';
import { AnalyzeTaxScopeService } from '../services/analyzeTaxScopeService';
import { CalculateTaxLiabilityService } from '../services/calculateTaxLiabilityService';
import { OptimizeSavingsService } from '../services/optimizeSavingsService';
import { ValidateInvoiceService } from '../services/validateInvoiceService';
import { AiIncentiveFinderService } from '../services/aiIncentiveFinderService';
import { NonResidentSepCheckService } from '../services/nonResidentSepCheckService';
import { AuditDocumentReviewerService } from '../services/auditDocumentReviewerService';
import { TinRegistrationGuideService } from '../services/tinRegistrationGuideService';
import * as clientRequest from '../types/requestTypes';
import * as clientResponse from '../types/responseTypes';
import { httpStatusCode } from '@lib/utils/httpStatusCodes';
import { HttpHelpers } from '../../utils/httpHelpers';

export function initilalizeTaxRoutes() {
        const taxRouter = Router();

        taxRouter.post('/profile-analyze', async (req, res) => {
                try {
                        const body = req.body as clientRequest.analyzeTaxScopeRequest;
                        const response: clientResponse.analyzeTaxScopeResponse =
                                await AnalyzeTaxScopeService.execute(body);
                        HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                } catch (error) {
                        HttpHelpers.sendError(
                                res,
                                httpStatusCode.INTERNAL_SERVER_ERROR,
                                'internal server error'
                        );
                }
        });

        taxRouter.post('/calc/tax-liability', async (req, res) => {
                try {
                        const body = req.body as clientRequest.calculateTaxRequest;
                        const response: clientResponse.CalculateTaxResponse =
                                await CalculateTaxLiabilityService.execute(body);
                        HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                } catch (error) {
                        HttpHelpers.sendError(
                                res,
                                httpStatusCode.INTERNAL_SERVER_ERROR,
                                'internal server error'
                        );
                }
        });

        taxRouter.post('/ai/optimize-savings', (req, res) => {
                try {
                        const body = req.body as clientRequest.optimizeSavingsReuest;
                        const response: clientResponse.optimizeSavingsResponse =
                                OptimizeSavingsService.execute(body);
                        HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                } catch (error) {
                        HttpHelpers.sendError(
                                res,
                                httpStatusCode.INTERNAL_SERVER_ERROR,
                                'internal server error'
                        );
                }
        });

        taxRouter.post('/vat/invoice-check', (req, res) => {
                try {
                        const body = req.body as clientRequest.validateInvoiceRequest;
                        const response: clientResponse.validateInvoiceResponse =
                                ValidateInvoiceService.execute(body);
                        HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                } catch (error) {
                        HttpHelpers.sendError(
                                res,
                                httpStatusCode.INTERNAL_SERVER_ERROR,
                                'internal server error'
                        );
                }
        });

        taxRouter.post('/ai/incentive-finder', (req, res) => {
                try {
                        const body = req.body as clientRequest.aiIncentiveFinderRequest;
                        const response: clientResponse.aiIncentiveFinderResponse =
                                AiIncentiveFinderService.execute(body);
                        HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                } catch (error) {
                        HttpHelpers.sendError(
                                res,
                                httpStatusCode.INTERNAL_SERVER_ERROR,
                                'internal server error'
                        );
                }
        });

        taxRouter.post('/non-resident/sep-check', (req, res) => {
                try {
                        const body = req.body as clientRequest.nonResident_SEP_Request;
                        const response: clientResponse.nonResident_SEP_Response =
                                NonResidentSepCheckService.execute(body);
                        HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                } catch (error) {
                        HttpHelpers.sendError(
                                res,
                                httpStatusCode.INTERNAL_SERVER_ERROR,
                                'internal server error'
                        );
                }
        });

        taxRouter.post('/audit/doc-reviewer', (req, res) => {
                try {
                        const body = req.body as clientRequest.auditDocumentRequest;
                        const response: clientResponse.auditDocumentResponse =
                                AuditDocumentReviewerService.execute(body);
                        HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                } catch (error) {
                        HttpHelpers.sendError(
                                res,
                                httpStatusCode.INTERNAL_SERVER_ERROR,
                                'internal server error'
                        );
                }
        });

        taxRouter.get('/guide/tin-registration', (req, res) => {
                try {
                        const body = req.params as clientRequest.tinRegistrationRequest;
                        const response: clientResponse.tinRegistrationResponse =
                                TinRegistrationGuideService.execute(body);
                        HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                } catch (error) {
                        HttpHelpers.sendError(
                                res,
                                httpStatusCode.INTERNAL_SERVER_ERROR,
                                'internal server error'
                        );
                }
        });

        return taxRouter;
}
