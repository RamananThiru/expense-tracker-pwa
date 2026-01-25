# Design Decisions & Tradeoffs in the Data Flow
## Architecture Rationale & Implementation Choices

---

## 1️⃣ Why No Real-Time SMS Listener

### What We Deliberately Avoided

We made a conscious decision to **not** implement:

- Android native app development
- Broadcast receivers for SMS interception
- Background services running constantly
- Real-time processing infrastructure

### The Tradeoff

**What We Lose:**
- "Instant entry" - transactions don't appear immediately after SMS arrives
- Real-time notifications and insights
- Automatic categorization the moment spending happens

**What We Gain:**
- **Stability**: No background processes that can crash or drain battery
- **Privacy**: SMS data stays on device until user chooses to upload
- **Zero maintenance**: No app updates, no Play Store reviews, no crash monitoring

### Our Choice

```
Batch import instead of live interception
```

**Why This Works:**

This approach delivers approximately **95% of the value** with only **5% of the complexity**. Most users check their finances periodically (daily or weekly), not in real-time. The batch import model aligns perfectly with this natural usage pattern.

---

## 2️⃣ Why IndexedDB is the Source of Truth

### The Problem with Two-Way Sync

Bidirectional synchronization inevitably causes:

- **Conflicts**: Client and server disagree on data state
- **Clock skew**: Timestamp mismatches between devices
- **Duplicates**: Same record created on multiple devices
- **Corruption**: Partial syncs leaving inconsistent state

### Our Choice

```
Client → Supabase  (one-way only)
```

**Not:**

```
Client ↔ Supabase  (two-way sync)
```

### Guarantees This Provides

- **Offline safety**: PWA works completely without network
- **Deterministic state**: IndexedDB always knows its own state
- **Simple recovery**: Just re-import SMS file to rebuild state
- **No conflict resolution**: Server never overwrites client
- **Clear ownership**: User's device owns the data

### Implementation Details

The data flow is strictly:

1. SMS → IndexedDB (primary write)
2. IndexedDB → Supabase (optional backup)
3. Supabase never writes back to IndexedDB

This architectural constraint eliminates an entire class of synchronization bugs.

---

## 3️⃣ Why Edge Function Returns JSON Instead of Writing to DB

### What We Intentionally Avoided

We did **not** let Supabase ingest SMS directly or make autonomous decisions about data storage.

### Edge Function Responsibilities

The Edge Function has a single, focused job:

```
SMS text → regex parsing → structured JSON
```

That's it. Nothing more.

### PWA Responsibilities

The PWA (client) decides:

- **What gets stored**: User can review before saving
- **What gets rejected**: Client applies business rules
- **What gets synced**: User controls backup timing

### Why This Separation Matters

This keeps Supabase as:

```
Storage, not authority
```

**Benefits:**

- **Client control**: User's device makes all decisions
- **Transparency**: User sees what will be saved
- **Flexibility**: Easy to change storage rules without redeploying Edge Function
- **Testability**: Parser is pure function with no side effects
- **Privacy**: Server never sees raw SMS, only what user chooses to backup

---

## 4️⃣ Why We Use Hash-Based Deduplication

### The Problem

SMS messages can be:

- Re-imported from same file multiple times
- Re-parsed after fixing regex patterns
- Re-uploaded accidentally
- Restored from backup

Without deduplication, each import would create duplicate transactions.

### Our Solution

Every transaction generates a deterministic hash:

```
hash = bank + account + date + amount + vendor
```

**Example:**
```
hdfc|xx4321|20260114|1254|amazon
```

### What This Gives Us

- **Infinite safe replays**: Import same file 100 times, get same result
- **No duplicate rows**: IndexedDB primary key prevents duplicates automatically
- **No cleanup logic needed**: Duplicates are silently rejected at insert
- **Idempotent operations**: Same input always produces same output
- **Data integrity**: Hash changes if any transaction detail changes

### Edge Cases Handled

- Different merchants charging same amount on same day → different vendor in hash
- Same merchant, different accounts → different account in hash
- Same transaction reversed and re-charged → different dates in hash

---

## 5️⃣ Why MacroDroid Instead of Building an App

### What MacroDroid Provides

- **SMS triggers**: Automatically detects incoming bank SMS
- **File writing**: Appends to JSON file without code
- **Offline operation**: Works completely offline
- **No code required**: Visual automation builder
- **No maintenance**: No updates needed

### What Building a Native App Would Require

Building a custom Android app would mean:

- **Increased fragility**: More code = more bugs
- **Play Store requirement**: Review process, policies, rejections
- **Ongoing updates**: Android version compatibility
- **Permission risks**: Users reluctant to grant SMS access to unknown apps
- **Development overhead**: Java/Kotlin expertise needed
- **Testing complexity**: Multiple device types and Android versions
- **Maintenance burden**: Security patches, dependency updates

### Our Choice

```
Use OS-level automation instead of shipping an app
```

### Why This is Better

MacroDroid is:
- Already trusted by millions of users
- Battle-tested across thousands of Android devices
- Regularly maintained by its developers
- Transparent in what it does
- Easy for users to inspect and modify

We leverage existing, proven infrastructure instead of reinventing it.

---

## 6️⃣ Privacy Tradeoff

### What Never Leaves the Device

Raw SMS messages:
- **Never auto-uploaded** to any server
- **Never synced** automatically
- **Never sent to third parties**
- **Never stored** in Supabase

The complete SMS text stays on the user's Android device.

### What Gets Stored in Supabase (Optional)

Only normalized, sanitized data:

```json
{
  "timestamp": "2026-01-14 18:23",
  "amount": 1254,
  "vendor": "AMAZON"
}
```

**What's Missing:**
- Full SMS text
- Account numbers (only masked versions)
- Bank-specific details
- Personal information
- SMS sender details

### Privacy Comparison

**Our approach:**
- User controls all data movement
- Raw SMS never uploaded
- Minimal data in cloud
- User can disable sync entirely

**Competitors (Axio, CRED, others):**
- Require full SMS access
- Auto-upload all SMS
- Process on their servers
- Sell insights to third parties
- No offline mode

### The Privacy Promise

```
Your SMS messages are yours.
We only see what you choose to share.
And even that is minimal.
```

---

## 🎯 Final Result

### What You End Up With

✅ **Full bank history**: Every transaction from SMS preserved

✅ **Vendor intelligence**: Normalized merchant names for insights

✅ **Offline-first ledger**: Works without internet, always

✅ **Zero Android dev**: No native app to build or maintain

✅ **Zero infra cost**: Static PWA + serverless functions only

✅ **No sync bugs**: One-way flow eliminates conflicts

### What You Avoid

❌ Native app complexity

❌ Play Store review process

❌ Background service battery drain

❌ Two-way sync conflicts

❌ Server-side authority issues

❌ Privacy concerns from auto-upload

---

## 🏗️ Architecture Philosophy

The entire system is built on three principles:

### 1. **Simplicity Over Features**
We chose batch import over real-time because it's 95% as good with 5% of the complexity.

### 2. **Clien