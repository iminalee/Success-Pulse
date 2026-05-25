# Success Pulse Technical Audit

Date: 2026-05-25
Scope: current repository implementation audit only (no behavior changes)

## 1) Act 1 onboarding flow (TCI, VAK, signup, BPS, contract)

## Flow summary
- `DiscoverJourney` runs a strict 0→8 step flow:
  0. Welcome
  1. TCI quick test
  2. VAK test
  3. SignupGate
  4. Need level
  5. Discovery Q&A
  6. BPS generation
  7. Quantum contract
  8. Result share.
- Step data is accumulated in local React state (`journeyData`) until completion callback into `App`.

## TCI
- TCI quick profile in Act 1 is a simplified 4-dimension model (`ns/ha/rd/p`) initialized to 50 and updated from `TciQuickTest`.
- In `App.handleOnboardingComplete`, this is mapped into the larger app TCI schema by writing only those 4 keys into `tciProfile.*.score`.

## VAK
- VAK is computed from 10 forced-choice items; output shape includes percentages and dominant channel (`V/A/K`) plus order string.
- Saved in Act 1 state, then passed to `SignupGate`, later copied into app-level `vakProfile` on onboarding complete.

## Signup (inside Act 1)
- Step 3 always shows `SignupGate` (no visible branch for “already have account”).
- It performs only `supabase.auth.signUp` (email/password), then **conditionally** upserts partial profile (`user_name`, `tci_profile`, `vak_profile`) if `data.user.id` exists.
- After that, it calls `onComplete(name)` regardless of explicit email verification state.

## BPS generation
- `BpsGenerator` directly calls OpenAI Chat Completions from the client using `REACT_APP_OPENAI_API_KEY`.
- It builds system/user prompts from VAK+TCI+answers, expects strict JSON response, parses it, then allows user edits and confirmation.

## Contract
- `QuantumContract` creates contract UX using derived labels (need-level name, dominant TCI archetype, dominant VAK label), captures typed signature, and auto-completes after celebration countdown.
- In `App.handleOnboardingComplete`, signature and signed date are copied into app state and then persisted by auto-save useEffect.

---

## 2) SignupGate behavior: new signup vs existing login

## What it does now
- Current `SignupGate` UI/logic supports **new account sign-up only**.
- Required inputs: name, email, password (>=6).
- No toggle/tab/link for existing users login, no magic link, no OTP, no branch to `signInWithPassword`.

## Practical consequence
- Existing users re-entering Act 1 cannot authenticate through this gate path; they must login elsewhere in app.
- If a user attempts to re-register existing email, error is surfaced but UX path does not transition to login mode.

---

## 3) How `App.js` loads and saves Supabase `pulse_data`

## Load paths (duplicated)
1. `initSession` effect:
   - calls `supabase.auth.getSession()`
   - if user exists, loads `pulse_data` by `.single()` and sets many states.
2. `onAuthStateChange` `SIGNED_IN` branch:
   - loads `pulse_data` again (different query style: `limit(1)` then first row)
   - sets many of same states.
3. `fetchUserData(userId)` helper also exists with default-merging logic, but appears unused in the shown paths.

## Save path
- Auto-save useEffect runs for many dependencies and upserts whole profile object into `pulse_data` after 1s debounce.
- Includes `apex_conversation_id`, `ledger`, `visions`, signature/date, etc.

## Observed inconsistencies/fragility
- Multiple overlapping load implementations with slightly different fallback/default behavior.
- `fetchUserData` has stronger default-merging but is not the primary path; risk of drift/partial null handling differences.
- `isOnboardingComplete` is largely localStorage-driven with signature-based hydration rules from DB.

---

## 4) Apex chat behavior (`conversation_id`, `/api/apex-chat`)

## Frontend chat behavior
- Chat calls `/api/apex-chat` with `{ message, conversation_id: apexConversationId }`.
- If response contains new `conversation_id`, frontend sets `apexConversationId` state.
- `apexConversationId` is auto-saved into `pulse_data` via main auto-save effect.
- Daily chat transcript cache is also stored in localStorage by user id and “ritual day” (6 AM rollover rule).

## Backend `/api/apex-chat`
- Accepts unauthenticated POST with `message` and optional `conversation_id`.
- Uses server-side `DIFY_API_KEY` to call Dify `/v1/chat-messages`.
- Passes static Dify user identifier (`user: "pulse-user"`).
- Returns `{ answer, conversation_id }`.

## Security/data-context gap vs target architecture
- Endpoint does **not** verify Supabase access token.
- Endpoint does **not** load latest `pulse_data`.
- Endpoint sends empty `inputs: {}` to Dify; no unified profile context injection.
- Static Dify `user` risks cross-user context mixing at provider layer depending on Dify app settings.

---

## 5) Where Mental Bank ledger entries are created

## Primary creation points in `App.js`
1. Manual/interactive deposit creation path
   - Constructs `newEntry` with fields like `date`, `amount`, `desc`, `level`, `duration` then appends to `ledger` state.
2. Tonight v2 “Seal” path
   - Converts `pulseDraft.events` into ledger entries and appends in batch.

## Persistence
- Ledger is persisted through the same auto-save `pulse_data` upsert effect.

## Note
- Because ledger is JSON-array-in-row and updated client-side, concurrent writes from multiple devices/sessions can overwrite each other (last write wins) unless server-side merge/versioning exists.

---

## 6) Risks, inconsistencies, duplication, fragility

## A. Auth/onboarding flow risks
- `SignupGate` has no existing-account login mode despite architecture goal (AccountGate-style split).
- Signup metadata uses `full_name`, while other places read/write `user_name`; naming mismatch risk.

## B. Data loading duplication risks
- Three patterns for profile hydration (`initSession`, `SIGNED_IN`, `fetchUserData`) with non-identical defaults and query styles.
- Duplicate state declaration exists for `trashVisions` in `App.js` (compile/runtime issue risk depending on actual file state around duplication).

## C. Client-side secret exposure risk
- `BpsGenerator` and other client AI calls rely on `REACT_APP_OPENAI_API_KEY` (frontend-exposed key by design).
- This conflicts with “do not expose keys to frontend” project rule.

## D. Apex backend context and identity risks
- `/api/apex-chat` lacks auth verification and per-user profile loading.
- Static `user: "pulse-user"` weakens user isolation semantics.
- No PROFILE_PATCH approval pipeline enforcement at endpoint level.

## E. Contract model fragmentation
- Act 1 contract data is represented as `signature/signed_date` in app profile, while target direction asks for unified `contract` model.
- Current approach spreads contract semantics across onboarding state + app root fields.

## F. Ledger source-of-truth concerns
- Ledger writes happen in multiple client-side pathways; no centralized append API with conflict control.
- Large profile-wide upsert for every state tweak increases chance of accidental unrelated field overwrites.

---

## Recommended next tickets (small, safe, sequential)

1. **Ticket 1 — SignupGate split-mode (signup/login) without styling overhaul**
   - Add “existing account login” path in current gate UI; preserve current visual style.

2. **Ticket 2 — Consolidate profile hydration into one function**
   - Make `initSession` and `SIGNED_IN` both call one canonical loader with consistent defaults.

3. **Ticket 3 — Move Act1 BPS generation behind server endpoint**
   - Replace frontend OpenAI key usage with server function.

4. **Ticket 4 — Harden `/api/apex-chat`**
   - Require Supabase bearer token, resolve user id, load latest `pulse_data`, pass selected profile fields to Dify `inputs`.

5. **Ticket 5 — Conversation identity correctness**
   - Replace static Dify `user` with stable per-user identifier.

6. **Ticket 6 — Contract schema unification**
   - Introduce a single `contract` object model while keeping backward-compatible `signature/signed_date` mirrors.

7. **Ticket 7 — Ledger write safety**
   - Add append-safe persistence strategy (RPC/table) to avoid last-write-wins on JSON array.

8. **Ticket 8 — Naming harmonization**
   - Standardize `user_name`/`full_name` handling and metadata mapping.

