import { Router } from 'express';
import { validateRequest, validateQuery } from '../validation/validateSchema';
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
import * as schema from '../validation/requestSchemas';
import { httpStatusCode } from '@lib/utils/httpStatusCodes';
import { HttpHelpers } from '../../utils/httpHelpers';

export function initilalizeTaxRoutes() {
        const taxRouter = Router();

        taxRouter.post(
                '/taxScope-analyze',
                validateRequest(schema.analyzeTaxScopeSchema),
                async (req, res) => {
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
                }
        );

        taxRouter.post(
                '/calc/tax-liability',
                validateRequest(schema.calculateTaxSchema),
                async (req, res) => {
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
                }
        );

        taxRouter.post(
                '/ai/optimize-savings',
                validateRequest(schema.optimizeSavingsSchema),
                async (req, res) => {
                        try {
                                const body = req.body as clientRequest.optimizeSavingsReuest;
                                const response: clientResponse.optimizeSavingsResponse =
                                        await OptimizeSavingsService.execute(body);
                                HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                        } catch (error) {
                                HttpHelpers.sendError(
                                        res,
                                        httpStatusCode.INTERNAL_SERVER_ERROR,
                                        'internal server error'
                                );
                        }
                }
        );

        taxRouter.post(
                '/vat/invoice-check',
                validateRequest(schema.validateInvoiceSchema),
                async (req, res) => {
                        try {
                                const body = req.body as clientRequest.validateInvoiceRequest;
                                const response: clientResponse.validateInvoiceResponse =
                                        await ValidateInvoiceService.execute(body);
                                HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                        } catch (error) {
                                HttpHelpers.sendError(
                                        res,
                                        httpStatusCode.INTERNAL_SERVER_ERROR,
                                        'internal server error'
                                );
                        }
                }
        );

        taxRouter.post(
                '/ai/incentive-finder',
                validateRequest(schema.aiIncentiveFinderSchema),
                async (req, res) => {
                        try {
                                const body = req.body as clientRequest.aiIncentiveFinderRequest;

                                const response: clientResponse.aiIncentiveFinderResponse =
                                        await AiIncentiveFinderService.execute(body);

                                HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                        } catch (error) {
                                HttpHelpers.sendError(
                                        res,
                                        httpStatusCode.INTERNAL_SERVER_ERROR,
                                        'internal server error'
                                );
                        }
                }
        );

        taxRouter.post('/non-resident/sep-check', async (req, res) => {
                try {
                        const body = req.body as clientRequest.nonResident_SEP_Request;

                        const response: clientResponse.nonResident_SEP_Response =
                                await NonResidentSepCheckService.execute(body);

                        HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                } catch (error) {
                        HttpHelpers.sendError(
                                res,
                                httpStatusCode.INTERNAL_SERVER_ERROR,
                                'internal server error'
                        );
                }
        });

        taxRouter.post(
                '/audit/doc-reviewer',
                validateRequest(schema.auditDocumentSchema),
                async (req, res) => {
                        try {
                                const body = req.body as clientRequest.auditDocumentRequest;

                                const response: clientResponse.auditDocumentResponse =
                                        await AuditDocumentReviewerService.execute(body);

                                HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                        } catch (error) {
                                HttpHelpers.sendError(
                                        res,
                                        httpStatusCode.INTERNAL_SERVER_ERROR,
                                        'internal server error'
                                );
                        }
                }
        );

        taxRouter.get(
                '/guide/tin-registration',
                validateQuery(schema.tinRegistrationSchema),
                async (req, res) => {
                        try {
                                const body = req.query as clientRequest.tinRegistrationRequest;

                                const response: clientResponse.tinRegistrationResponse =
                                        await TinRegistrationGuideService.execute(body);

                                HttpHelpers.sendResponse(res, httpStatusCode.SUCCESS, response);
                        } catch (error) {
                                HttpHelpers.sendError(
                                        res,
                                        httpStatusCode.INTERNAL_SERVER_ERROR,
                                        'internal server error'
                                );
                        }
                }
        );

        return taxRouter;
}
