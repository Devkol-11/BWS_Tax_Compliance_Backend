import { z } from 'zod';

/* ----------------------------------
   Shared enums
---------------------------------- */

const LegalFormEnum = z.enum(['individual', 'company', 'foreign_company']);

const IncomeTypeEnum = z.enum(['employment', 'trade_or_business', 'digital_services', 'passive_income']);

const TurnoverRangeEnum = z.enum(['<25m', '25m-100m', '100m-500m', '>500m']);

/* ----------------------------------
   1. analyzeTaxScopeRequest
---------------------------------- */

export const analyzeTaxScopeSchema = z.object({
        taxpayer: z.object({
                legalForm: LegalFormEnum,
                incorporationCountry: z.string().optional()
        }),

        residencyAndPresence: z.object({
                livesInNigeria: z.boolean().optional(),
                placeOfManagementInNigeria: z.boolean().optional(),
                hasFixedBaseInNigeria: z.boolean().optional(),
                employeesInNigeria: z.boolean().optional(),
                earnsFromNigeria: z.boolean().optional(),
                providesDigitalServices: z.boolean().optional(),
                targetsNigeriaMarket: z.boolean().optional()
        }),

        incomeProfile: z.object({
                incomeTypes: z.array(IncomeTypeEnum).min(1)
        }),

        sizeProfile: z.object({
                annualTurnoverRange: TurnoverRangeEnum
        })
});

/* ----------------------------------
   2. calculateTaxRequest
---------------------------------- */

export const calculateTaxSchema = z.object({
        taxpayer: z.object({
                legalForm: LegalFormEnum,
                incorporationCountry: z.string().optional()
        }),

        residencyAndPresence: z.object({
                livesInNigeria: z.boolean().optional(),
                placeOfManagementInNigeria: z.boolean().optional(),
                earnsFromNigeria: z.boolean().optional(),
                providesDigitalServices: z.boolean().optional(),
                targetsNigeriaMarket: z.boolean().optional()
        }),

        incomeFigures: z.object({
                employmentIncome: z.number().nonnegative().optional(),
                businessIncome: z.number().nonnegative().optional(),
                digitalServicesIncome: z.number().nonnegative().optional(),
                passiveIncome: z.number().nonnegative().optional()
        }),

        deductions: z
                .object({
                        pension: z.number().nonnegative().optional(),
                        nhf: z.number().nonnegative().optional(),
                        nhis: z.number().nonnegative().optional(),
                        capitalAllowances: z.number().nonnegative().optional()
                })
                .optional(),

        accountingYear: z.number().int().min(2000)
});

/* ----------------------------------
   3. optimizeSavingsReuest
---------------------------------- */

export const optimizeSavingsSchema = z.object({
        taxpayer: z.object({
                legalForm: LegalFormEnum,
                incorporationCountry: z.string().optional()
        }),

        residencyAndPresence: z.object({
                livesInNigeria: z.boolean().optional(),
                placeOfManagementInNigeria: z.boolean().optional(),
                earnsFromNigeria: z.boolean().optional(),
                providesDigitalServices: z.boolean().optional()
        }),

        incomeProfile: z.object({
                incomeTypes: z.array(IncomeTypeEnum).min(1)
        }),

        expenseProfile: z
                .object({
                        paysPension: z.boolean().optional(),
                        hasEmployees: z.boolean().optional(),
                        incursRAndD: z.boolean().optional(),
                        capitalAssetsPurchased: z.boolean().optional()
                })
                .optional(),

        businessProfile: z
                .object({
                        sector: z.string().optional(),
                        exportOriented: z.boolean().optional(),
                        locatedInFreeTradeZone: z.boolean().optional(),
                        startupAgeYears: z.number().int().nonnegative().optional()
                })
                .optional()
});

/* ----------------------------------
   4. complianceCalendarRequest
---------------------------------- */

export const complianceCalendarSchema = z.object({
        applicableTaxes: z.array(z.string()).min(1),
        accountingYear: z.number().int().min(2000)
});

/* ----------------------------------
   5. validateInvoiceRequest
---------------------------------- */

export const validateInvoiceSchema = z.object({
        supplier: z.object({
                name: z.string().min(1),
                tin: z.string().optional(),
                address: z.string().optional(),
                vatRegistered: z.boolean().optional()
        }),

        customer: z.object({
                name: z.string().min(1),
                address: z.string().optional()
        }),

        invoice: z.object({
                invoiceNumber: z.string().min(1),
                issueDate: z.string(), // ISO assumed, parsed later
                currency: z.literal('NGN'),

                items: z
                        .array(
                                z.object({
                                        description: z.string().min(1),
                                        quantity: z.number().positive(),
                                        unitPrice: z.number().nonnegative(),
                                        vatRate: z.number().nonnegative().optional()
                                })
                        )
                        .min(1),

                subtotal: z.number().nonnegative(),
                vatAmount: z.number().nonnegative().optional(),
                totalAmount: z.number().nonnegative()
        })
});

/* ----------------------------------
   6. aiIncentiveFinderRequest
---------------------------------- */

export const aiIncentiveFinderSchema = z.object({
        taxpayer: z.object({
                legalForm: LegalFormEnum,
                incorporationCountry: z.string().optional()
        }),

        businessProfile: z.object({
                sector: z.string().min(1),
                activitiesDescription: z.string().min(5),
                startupAgeYears: z.number().int().nonnegative().optional(),
                exportOriented: z.boolean().optional(),
                locatedInFreeTradeZone: z.boolean().optional(),
                usesLocalRawMaterials: z.boolean().optional()
        }),

        residencyAndPresence: z.object({
                placeOfManagementInNigeria: z.boolean().optional(),
                operatesInNigeria: z.boolean().optional()
        })
});

/* ----------------------------------
   7. nonResident_SEP_Request
---------------------------------- */

export const nonResidentSepSchema = z.object({
        taxpayer: z.object({
                legalForm: z.literal('foreign_company'),
                incorporationCountry: z.string().min(1)
        }),

        nigeriaActivities: z.object({
                earnsFromNigeria: z.boolean(),
                providesDigitalServices: z.boolean(),
                targetsNigeriaMarket: z.boolean(),
                hasLocalAgents: z.boolean().optional(),
                hasPhysicalOffice: z.boolean().optional()
        }),

        revenueProfile: z
                .object({
                        annualNigeriaRevenue: z.number().nonnegative().optional()
                })
                .optional()
});

/* ----------------------------------
   8. auditDocumentRequest
---------------------------------- */

export const auditDocumentSchema = z.object({
        document: z.object({
                type: z.enum(['receipt', 'invoice', 'contract', 'bank_statement', 'payroll_record', 'other']),
                description: z.string().min(1),
                amount: z.number().nonnegative().optional(),
                currency: z.literal('NGN').optional(),
                date: z.string().optional(),
                vendorName: z.string().optional(),
                vendorTin: z.string().optional()
        }),

        expenseContext: z
                .object({
                        relatesToBusiness: z.boolean().optional(),
                        capitalOrRevenue: z.enum(['capital', 'revenue']).optional(),
                        employeeRelated: z.boolean().optional()
                })
                .optional()
});

/* ----------------------------------
   9. chatExpertRequest
---------------------------------- */

export const chatExpertSchema = z.object({
        question: z.string().min(5),

        context: z
                .object({
                        taxpayerType: z.string().optional(),
                        applicableTaxes: z.array(z.string()).optional()
                })
                .optional()
});

/* ----------------------------------
   10. tinRegistrationRequest
---------------------------------- */

export const tinRegistrationSchema = z.object({
        taxpayerType: z.enum(['individual', 'company', 'foreign_company']).optional()
});
