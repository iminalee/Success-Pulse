# Supabase Schema Audit for Act 1 Onboarding Persistence

Date: 2026-05-25  
Scope: `pulse_data` compatibility review for the current `src/App.js` onboarding persistence merge.

## 1) Current app usage of `public.pulse_data`

The app currently upserts a profile payload into `public.pulse_data` keyed by `user_id`, and reads/writes profile data across both dedicated columns and JSON shape usage paths. In the onboarding completion flow, data is merged and persisted through:

- `user_id` (row ownership key)
- `pulse_data` (JSON payload container; merged object includes many profile fields)

From the current app behavior and project docs, active profile fields include (backward compatibility set):

- `user_name`
- `annual_income`
- `target_date`
- `ledger`
- `visions`
- `bps_traits`
- `vak_profile`
- `tci_profile`
- `signature`
- `signed_date`
- `apex_conversation_id`

These fields are currently treated as part of the profile document model and should remain compatible.

---

## 2) New fields required by the onboarding persistence PR

The onboarding persistence change now writes/depends on additional fields in profile payload:

- `selectedNeedLevel` (camelCase, integer)  
  - written by current `App.js` for immediate compatibility.
- `contract` (JSON object)
  - includes fields such as:
    - `status`
    - `signature`
    - `signed_at`
    - `source`
    - `contract_version`
    - `selected_need_level`
    - `apex_bps_title`
    - `journey_snapshot`
- `life_profile` (JSON object; target architecture direction)
- `apex_bps` (JSON object; target architecture direction)
- Optional provenance marker:
  - `profile_source` (text) for route/source diagnostics.

---

## 3) Top-level columns vs JSONB recommendation

## Keep as top-level columns (table columns)

Recommended columns in `public.pulse_data`:

- `user_id` (existing key)
- `pulse_data` (existing profile JSON)
- `selectedNeedLevel` (integer)
- `contract` (jsonb)
- `life_profile` (jsonb)
- `apex_bps` (jsonb)
- `profile_source` (text)

Rationale:
- Enables incremental migration from “all-in-one JSON” toward queryable structured fields.
- Supports admin/reporting/filtering use cases without full JSON path extraction.
- Allows safe dual-write/dual-read strategy while preserving current app compatibility.

## Keep in JSONB payload

The broader evolving profile object can continue in `pulse_data` JSONB for now (especially nested, rapidly-changing shapes):

- `visions`
- `ledger`
- `tci_profile`
- `vak_profile`
- `contract.journey_snapshot`
- future patchable AI-generated structures.

---

## 4) Naming decision: `selectedNeedLevel` vs `selected_need_level`

Current `App.js` writes **`selectedNeedLevel`** for compatibility.

Recommendation:
- **Now:** keep `selectedNeedLevel` as a real column to avoid breaking existing code paths.
- **Later migration ticket:** standardize on `selected_need_level` (snake_case) with a staged transition:
  1. add snake_case column,
  2. dual-write both names,
  3. migrate reads,
  4. backfill,
  5. remove camelCase only after full rollout verification.

---

## 5) RLS policy recommendations (`user_id = auth.uid()`)

For `public.pulse_data`, enforce row ownership:

- SELECT: only own row
- INSERT: only own `user_id`
- UPDATE: only own row
- DELETE: optional; usually own row only if account deletion flow needs it

Recommended policy condition pattern:

- `USING (user_id = auth.uid())`
- `WITH CHECK (user_id = auth.uid())`

Also confirm:
- RLS is enabled on `public.pulse_data`.
- No overly-broad service/public policies allow cross-user access from client tokens.

---

## 6) Risks if SQL migration is NOT applied before merge

If merged without schema alignment, risks include:

1. **Write inconsistency:**
   - App writes new keys in JSON only, but DB-level columns expected by future queries/reporting won’t exist.

2. **Operational drift:**
   - Different environments (local/staging/prod) may diverge in field availability and behavior.

3. **Future query failures:**
   - Admin/reporting or RPC logic expecting `selectedNeedLevel`, `contract`, `life_profile`, `apex_bps`, or `profile_source` columns may fail.

4. **Migration debt accumulation:**
   - Delayed schema change makes later backfills and naming normalization (`selected_need_level`) harder.

5. **Security ambiguity:**
   - Without explicit RLS audit/application, ownership constraints may be incomplete or environment-specific.

---

## 7) Merge gate recommendation

This onboarding persistence PR should be considered **not fully deploy-safe** until the accompanying SQL migration is manually applied in Supabase for each target environment (at minimum staging + production) and RLS is verified.
