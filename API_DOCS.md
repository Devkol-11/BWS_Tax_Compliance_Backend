# Tax Compliance Backend API Documentation

**Base URL:** `http://localhost:<PORT>/api/v1/tax`

All endpoints accept `application/json` and return JSON responses.

---

## Quick Reference

| Method | Endpoint                      | Description                                |
|--------|-------------------------------|--------------------------------------------|
| POST   | `/taxScope-analyze`           | Analyze taxpayer classification & scope    |
| POST   | `/calc/tax-liability`         | Calculate tax liability amounts            |
| POST   | `/ai/optimize-savings`        | Get AI-powered tax savings recommendations |
| POST   | `/vat/invoice-check`          | Validate VAT invoice compliance            |
| POST   | `/ai/incentive-finder`        | Find applicable tax incentives             |
| POST   | `/non-resident/sep-check`     | Check Significant Economic Presence (SEP)  |
| POST   | `/audit/doc-reviewer`         | Review document for audit compliance       |
| GET    | `/guide/tin-registration`     | Get TIN registration guide                 |

---

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... }
}
```

Errors return:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Common Enums

**legalForm:**
- `"individual"` | `"company"` | `"foreign_company"`

**incomeTypes:**
- `"employment"` | `"trade_or_business"` | `"digital_services"` | `"passive_income"`

**annualTurnoverRange:**
- `"<25m"` | `"25m-100m"` | `"100m-500m"` | `">500m"`

---

## Endpoints

### 1. POST `/taxScope-analyze`

Analyzes taxpayer classification and applicable taxes.

**Request Body:**
```json
{
  "taxpayer": {
    "legalForm": "individual",
    "incorporationCountry": "Nigeria"
  },
  "residencyAndPresence": {
    "livesInNigeria": true,
    "placeOfManagementInNigeria": true,
    "hasFixedBaseInNigeria": false,
    "employeesInNigeria": true,
    "earnsFromNigeria": true,
    "providesDigitalServices": false,
    "targetsNigeriaMarket": false
  },
  "incomeProfile": {
    "incomeTypes": ["employment", "trade_or_business"]
  },
  "sizeProfile": {
    "annualTurnoverRange": "<25m"
  }
}
```

**Response:**
```json
{
  "classification": {
    "taxpayerType": "resident_individual",
    "taxReach": "worldwide_income",
    "sizeCategory": "micro"
  },
  "applicableLaws": ["Personal Income Tax Act"],
  "applicableTaxes": [
    { "tax": "Personal Income Tax", "basis": "..." }
  ],
  "ai_analysis": {
    "legalExplanation": "...",
    "plainEnglishSummary": "...",
    "keyAssumptions": ["..."]
  },
  "confidenceLevel": "high"
}
```

---

### 2. POST `/calc/tax-liability`

Calculates estimated tax liability.

**Request Body:**
```json
{
  "taxpayer": {
    "legalForm": "individual",
    "incorporationCountry": "Nigeria"
  },
  "residencyAndPresence": {
    "livesInNigeria": true,
    "placeOfManagementInNigeria": true,
    "earnsFromNigeria": true,
    "providesDigitalServices": false,
    "targetsNigeriaMarket": false
  },
  "incomeFigures": {
    "employmentIncome": 5000000,
    "businessIncome": 2000000,
    "digitalServicesIncome": 0,
    "passiveIncome": 100000
  },
  "deductions": {
    "pension": 400000,
    "nhf": 125000,
    "nhis": 50000,
    "capitalAllowances": 0
  },
  "accountingYear": 2025
}
```

**Response:**
```json
{
  "classification": {
    "taxpayerType": "resident_individual"
  },
  "taxBreakdown": [
    { "tax": "PAYE", "amount": 500000, "basis": "..." }
  ],
  "totalTaxPayable": 750000,
  "ai_analysis": {
    "legalExplanation": "...",
    "plainEnglishSummary": "...",
    "keyAssumptions": ["..."]
  },
  "confidenceLevel": "high"
}
```

---

### 3. POST `/ai/optimize-savings`

AI-powered tax relief and savings recommendations.

**Request Body:**
```json
{
  "taxpayer": {
    "legalForm": "company",
    "incorporationCountry": "Nigeria"
  },
  "residencyAndPresence": {
    "livesInNigeria": true,
    "placeOfManagementInNigeria": true,
    "earnsFromNigeria": true,
    "providesDigitalServices": true
  },
  "incomeProfile": {
    "incomeTypes": ["trade_or_business"]
  },
  "expenseProfile": {
    "paysPension": true,
    "hasEmployees": true,
    "incursRAndD": true,
    "capitalAssetsPurchased": false
  },
  "businessProfile": {
    "sector": "technology",
    "exportOriented": true,
    "locatedInFreeTradeZone": false,
    "startupAgeYears": 2
  }
}
```

**Response:**
```json
{
  "potentialReliefs": [
    {
      "relief": "Pioneer Status",
      "description": "Tax holiday for qualifying industries",
      "conditions": ["Must apply to NIPC", "..."]
    }
  ],
  "ai_analysis": {
    "legalExplanation": "...",
    "plainEnglishSummary": "...",
    "keyAssumptions": ["..."]
  },
  "confidenceLevel": "medium"
}
```

---

### 4. POST `/vat/invoice-check`

Validates VAT invoice compliance.

**Request Body:**
```json
{
  "supplier": {
    "name": "ABC Supplies Ltd",
    "tin": "12345678-0001",
    "address": "Lagos, Nigeria",
    "vatRegistered": true
  },
  "customer": {
    "name": "XYZ Corp",
    "address": "Abuja, Nigeria"
  },
  "invoice": {
    "invoiceNumber": "INV-2025-001",
    "issueDate": "2025-01-15",
    "currency": "NGN",
    "items": [
      {
        "description": "Office supplies",
        "quantity": 10,
        "unitPrice": 5000,
        "vatRate": 7.5
      }
    ],
    "subtotal": 50000,
    "vatAmount": 3750,
    "totalAmount": 53750
  }
}
```

**Response:**
```json
{
  "isCompliant": true,
  "checks": [
    { "rule": "TIN present", "passed": true, "message": "..." }
  ],
  "ai_analysis": {
    "legalExplanation": "...",
    "plainEnglishSummary": "...",
    "keyAssumptions": ["..."]
  },
  "confidenceLevel": "high"
}
```

---

### 5. POST `/ai/incentive-finder`

Finds applicable tax incentives based on business profile.

**Request Body:**
```json
{
  "taxpayer": {
    "legalForm": "company",
    "incorporationCountry": "Nigeria"
  },
  "businessProfile": {
    "sector": "agriculture",
    "activitiesDescription": "Cassava farming and processing",
    "startupAgeYears": 1,
    "exportOriented": true,
    "locatedInFreeTradeZone": false,
    "usesLocalRawMaterials": true
  },
  "residencyAndPresence": {
    "placeOfManagementInNigeria": true,
    "operatesInNigeria": true
  }
}
```

**Response:**
```json
{
  "matchedIncentives": [
    {
      "incentive": "Agricultural Tax Exemption",
      "reasonMatched": "Engaged in primary agricultural activities"
    }
  ],
  "ai_analysis": {
    "legalExplanation": "...",
    "plainEnglishSummary": "...",
    "keyAssumptions": ["..."]
  },
  "confidenceLevel": "high"
}
```

---

### 6. POST `/non-resident/sep-check`

Checks if a foreign company has Significant Economic Presence in Nigeria.

**Request Body:**
```json
{
  "taxpayer": {
    "legalForm": "foreign_company",
    "incorporationCountry": "USA"
  },
  "nigeriaActivities": {
    "earnsFromNigeria": true,
    "providesDigitalServices": true,
    "targetsNigeriaMarket": true,
    "hasLocalAgents": false,
    "hasPhysicalOffice": false
  },
  "revenueProfile": {
    "annualNigeriaRevenue": 50000000
  }
}
```

**Response:**
```json
{
  "hasSEP": true,
  "indicators": [
    {
      "indicator": "Digital services to Nigeria",
      "present": true,
      "explanation": "..."
    }
  ],
  "ai_analysis": {
    "legalExplanation": "...",
    "plainEnglishSummary": "...",
    "keyAssumptions": ["..."]
  },
  "confidenceLevel": "high"
}
```

---

### 7. POST `/audit/doc-reviewer`

Reviews a document for tax audit compliance.

**Request Body:**
```json
{
  "document": {
    "type": "receipt",
    "description": "Office equipment purchase",
    "amount": 250000,
    "currency": "NGN",
    "date": "2025-01-10",
    "vendorName": "Tech Solutions Ltd",
    "vendorTin": "98765432-0001"
  },
  "expenseContext": {
    "relatesToBusiness": true,
    "capitalOrRevenue": "capital",
    "employeeRelated": false
  }
}
```

**Document Types:** `"receipt"` | `"invoice"` | `"contract"` | `"bank_statement"` | `"payroll_record"` | `"other"`

**Response:**
```json
{
  "classification": {
    "documentType": "receipt",
    "typicalTreatment": "allowable"
  },
  "checks": [
    { "check": "TIN present", "passed": true, "message": "..." }
  ],
  "ai_analysis": {
    "legalExplanation": "...",
    "plainEnglishSummary": "...",
    "keyAssumptions": ["..."]
  },
  "confidenceLevel": "high"
}
```

---

### 8. GET `/guide/tin-registration`

Returns step-by-step TIN registration guide.

**Query Parameters:**
| Param        | Type   | Required | Values                                      |
|--------------|--------|----------|---------------------------------------------|
| taxpayerType | string | No       | `individual`, `company`, `foreign_company`  |

**Example:**
```
GET /api/v1/tax/guide/tin-registration?taxpayerType=individual
```

**Response:**
```json
{
  "taxpayerType": "individual",
  "steps": [
    {
      "step": 1,
      "title": "Gather Documents",
      "description": "..."
    }
  ],
  "requiredDocuments": ["Valid ID", "Proof of Address"],
  "channels": ["Online Portal", "Tax Office"],
  "ai_analysis": {
    "plainEnglishSummary": "..."
  },
  "confidenceLevel": "high"
}
```

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per window

## Error Codes

| Code | Description           |
|------|-----------------------|
| 400  | Validation error      |
| 500  | Internal server error |
