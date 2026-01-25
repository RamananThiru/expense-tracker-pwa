# Offline-First SMS → Finance Intelligence Pipeline
## Feature Requirements & Architecture Documentation

---

## 🎯 Product Goal

Provide a way to convert bank & UPI SMS messages into structured financial data inside a PWA-based personal finance app, without:

- building a native Android app
- using bank APIs
- running real-time background services
- creating two-way sync complexity

### Core Requirements

The system must be:

- **Offline-first**: Works without internet connectivity
- **Deterministic**: Same input always produces same output
- **Replayable**: Can reconstruct state from SMS history
- **Privacy-respecting**: Data stays on device by default
- **Low maintenance**: Minimal infrastructure overhead

---

## 🧱 System Components

| Component | Role | Details |
|-----------|------|---------|
| **MacroDroid (Android)** | SMS Listener | Captures bank SMS and writes to local file |
| **bank_sms.json** | SMS Ledger | Append-only local file storing raw SMS data |
| **PWA (Next.js)** | User Interface | Handles UI, IndexedDB operations, imports, and charts |
| **Supabase Edge Function** | Parser | Stateless SMS-to-transaction transformation |
| **IndexedDB** | Primary Storage | Client-side ledger and source of truth |
| **Supabase DB** | Secondary Storage | Backup, analytics, and multi-device sync |

---

## 🗂 Data Ownership Model

```
IndexedDB = Single Source of Truth
Supabase = Backup + Analytics
```

**Critical Principle**: There is no two-way sync. Supabase never overwrites IndexedDB.

This architecture ensures:
- User retains full control of their financial data
- PWA works completely offline
- Cloud backup is optional, not required
- No sync conflicts possible

---

## 🔄 Data Flow Pipeline

### Step-by-Step Process

```
[1] Bank SMS arrives on Android device
      ↓
[2] MacroDroid automation triggers
      → filters by bank sender IDs
      → appends SMS to local file
      → updates bank_sms.json
      ↓
[3] User opens PWA and initiates import
      → clicks "Import Bank SMS"
      → uploads bank_sms.json file
      ↓
[4] Supabase Edge Function processes upload
      → parses SMS content
      → applies regex patterns
      → generates normalized transactions
      → returns JSON array
      ↓
[5] PWA receives parsed transactions
      → inserts into IndexedDB using hash as primary key
      → automatically rejects duplicates
      → updates charts and UI instantly
      ↓
[6] Optional sync to cloud
      → user triggers manual sync
      → IndexedDB → Supabase DB
```

### Key Characteristics

- **User-initiated**: No automatic background processes
- **Stateless parsing**: Edge function has no memory between calls
- **Idempotent**: Can safely re-import same file multiple times
- **Transparent**: User sees every step of the process

---

## 📦 bank_sms.json Format

### File Structure

The `bank_sms.json` file is an array of SMS objects with this schema:

```json
{
  "timestamp": "2026-01-14T18:23:00",
  "sender": "HDFCBK",
  "body": "INR 1,254.00 debited from a/c XX4321 at AMAZON..."
}
```

### Field Definitions

- **timestamp**: ISO 8601 format datetime when SMS was received
- **sender**: SMS sender ID (typically bank identifier)
- **body**: Complete SMS message text

### File Characteristics

This file:
- Lives only on the Android device
- Grows over time as new SMS arrive
- Is uploaded only when user chooses to import
- Requires no special permissions beyond SMS access
- Can be backed up like any other file

---

## 🔧 Edge Function Output

### Parsed Transaction Format

The Edge Function transforms raw SMS into structured transactions:

```json
[
  {
    "timestamp": "2026-01-14 18:23",
    "amount": 1254,
    "currency": "INR",
    "type": "debit",
    "vendor": "AMAZON",
    "bank": "HDFC",
    "account": "XX4321",
    "hash": "hdfc|xx4321|20260114|1254|amazon"
  }
]
```

### Field Specifications

- **timestamp**: Normalized datetime (YYYY-MM-DD HH:mm)
- **amount**: Numeric value without currency symbols
- **currency**: ISO 4217 currency code
- **type**: Transaction type (`debit` or `credit`)
- **vendor**: Merchant or transaction party
- **bank**: Financial institution identifier
- **account**: Masked account number
- **hash**: Deterministic unique identifier

### Hash Generation

The `hash` field is critical for deduplication. It's constructed as:

```
{bank}|{account}|{date}|{amount}|{vendor}
```

**Properties**:
- Deterministic: same SMS always generates same hash
- Unique: different transactions generate different hashes
- Collision-resistant: extremely unlikely to have duplicates

---

## 🗄 IndexedDB Schema

### Primary Store: transactions

```javascript
{
  keyPath: "hash",  // Primary key
  indexes: [
    { name: "timestamp", unique: false },
    { name: "vendor", unique: false },
    { name: "bank", unique: false },
    { name: "type", unique: false }
  ]
}
```

### Core Fields

- **hash** (primary key): Unique transaction identifier
- **timestamp**: Transaction datetime for sorting/filtering
- **amount**: Numeric transaction value
- **vendor**: Merchant name for categorization
- **bank**: Source bank for multi-account tracking
- **type**: Debit/credit for balance calculations

### Duplicate Handling

Duplicates are automatically rejected at insert time because:
- `hash` is the primary key
- IndexedDB prevents duplicate keys
- No error handling needed, silent rejection is correct behavior
- User sees accurate count of new transactions imported

---

## 🔐 Privacy & Security Considerations

### Data Privacy

- SMS data never leaves device until user explicitly uploads
- Edge function is stateless and retains no data
- Supabase backup is optional
- No third-party tracking or analytics

### Security Features

- Client-side processing prevents data exposure
- Hash-based deduplication prevents data manipulation
- Append-only SMS log creates audit trail
- User controls all data export/import

---

## 🚀 Implementation Benefits

### For Users

- Complete control over financial data
- Works offline without internet
- No app installation required
- Privacy-first design
- Free from bank API dependencies

### For Developers

- No complex sync logic to maintain
- Stateless architecture simplifies debugging
- PWA deployment is simple
- Edge functions auto-scale
- Low operational overhead

---

## 📊 Future Enhancements

Potential expansions while maintaining core architecture:

- Category auto-tagging using ML
- Budget tracking and alerts
- Export to accounting software
- Multi-currency support
- Shared household accounts
- Receipt photo attachment

All additions would maintain the offline-first, privacy-respecting principles.