import { Router } from 'express';
import { validateRequest, validateQuery } from '../validation/validateSchema.js';
import { AnalyzeTaxScopeService } from '../services/analyzeTaxScopeService.js';
import { CalculateTaxLiabilityService } from '../services/calculateTaxLiabilityService.js';
import { OptimizeSavingsService } from '../services/optimizeSavingsService.js';
import { ValidateInvoiceService } from '../services/validateInvoiceService.js';
import { AiIncentiveFinderService } from '../services/aiIncentiveFinderService.js';
import { NonResidentSepCheckService } from '../services/nonResidentSepCheckService.js';
import { AuditDocumentReviewerService } from '../services/auditDocumentReviewerService.js';
import { TinRegistrationGuideService } from '../services/tinRegistrationGuideService.js';
import * as clientRequest from '../types/requestTypes.js';
import * as clientResponse from '../types/responseTypes.js';
import * as schema from '../validation/requestSchemas.js';
import { httpStatusCode } from '@lib/utils/httpStatusCodes.js';
import { HttpHelpers } from '../../utils/httpHelpers.js';

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
