# Fee Module Backend — Node.js + PostgreSQL

## Project Structure

```
fee-module/
├── config/
│   ├── db.js          ← PostgreSQL pool connection
│   └── schema.sql     ← Run this once to create all tables
├── services/
│   ├── invalidFeeData.service.js     ← DB logic for invalid fee data
│   ├── invalidFeeTotals.service.js   ← DB logic for totals
│   ├── feeNotGenerated.service.js    ← DB logic for fee not generated
│   └── transactionLogs.service.js    ← JSON logs + Excel export
├── controllers/       ← HTTP request/response handlers
├── routes/
│   └── index.js       ← All routes defined here
├── middlewares/
│   └── errorHandler.js
├── server.js          ← Entry point
├── .env.example
└── package.json
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Fill in your PostgreSQL credentials in .env
   ```

3. **Create tables in PostgreSQL**
   ```bash
   psql -U your_user -d your_database -f config/schema.sql
   ```

4. **Start server**
   ```bash
   npm start         # production
   npm run dev       # development (nodemon)
   ```

---

## API Reference

### Sub-module 1 — Invalid Fee Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/invalid-fee-data` | List all invalid fee records |
| GET    | `/api/invalid-fee-data/:id` | Get single record |
| POST   | `/api/invalid-fee-data` | Create new invalid fee record |
| PATCH  | `/api/invalid-fee-data/:id/status` | Update status |

**GET Query Filters:** `student_id`, `status`, `from_date`, `to_date`, `page`, `limit`

**POST Body:**
```json
{
  "student_id": "STU001",
  "student_name": "Rahul Sharma",
  "current_class": "10th",
  "section": "A",
  "roll_number": "23",
  "amount": 5000,
  "payment_mode": "ONLINE",
  "transaction_ref": "TXN123456",
  "error_reason": "Payment gateway timeout",
  "payment_date": "2026-06-29T10:00:00Z",
  "status": "INVALID"
}
```

---

### Sub-module 2 — Invalid Fee Totals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invalid-fee-totals` | All students with total invalid amounts |
| GET | `/api/invalid-fee-totals/student/:student_id` | Totals for one student |

> Totals are **auto-updated** whenever a new invalid fee record is created.

---

### Sub-module 3 — Fee Not Generated

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/fee-not-generated` | List all fee-not-generated records |
| GET    | `/api/fee-not-generated/:id` | Get single record |
| POST   | `/api/fee-not-generated` | Create new record |
| PATCH  | `/api/fee-not-generated/:id/status` | Update status |

**POST Body:**
```json
{
  "student_id": "STU002",
  "student_name": "Priya Mehta",
  "current_class": "9th",
  "section": "B",
  "roll_number": "11",
  "amount_paid": 4500,
  "transaction_ref": "TXN789012",
  "payment_date": "2026-06-28T09:30:00Z",
  "error_reason": "Slip generation service unavailable"
}
```

---

### Sub-module 4 — Transaction Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transaction-logs` | All logs in JSON format |
| GET | `/api/transaction-logs/export` | **Download Excel file (4 sheets)** |

**GET Query Filters:** `log_type` (INVALID_FEE / FEE_NOT_GENERATED), `student_id`, `from_date`, `to_date`, `page`, `limit`

**Excel Export — 4 Sheets:**
- Sheet 1: Invalid Fee Data records
- Sheet 2: Invalid Fee Totals summary (with Grand Total row)
- Sheet 3: Fee Not Generated records
- Sheet 4: All Transaction Logs (with raw JSON payload)

---

## Status Values

| Status | Used In |
|--------|---------|
| `INVALID` | Invalid Fee Data |
| `PENDING` | Fee Not Generated |
| `RESOLVED` | Both (after manual fix) |
