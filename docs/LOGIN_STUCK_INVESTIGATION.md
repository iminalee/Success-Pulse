# Act 1 Existing-Account Login Stuck Investigation

Date: 2026-05-25
Scope: Investigation-only diagnosis for production symptom where existing-account login modal remains at "확인 중...".

## 1) Exact text search results

Searched full repo for:
- "확인 중"
- "기존 계정으로 로그인"
- "로그인 후 자동으로 이어서 진행됩니다"

### Matches

1. `src/components/discover/WelcomeScreen.jsx`
   - Contains modal title "기존 계정으로 로그인"
   - Contains subtitle "로그인 후 자동으로 이어서 진행됩니다."
   - Contains button state text "확인 중..."

2. `src/components/discover/AccountGate.jsx`
   - Does **not** contain "확인 중..."
   - Uses login button states "로그인하고 계속하기" / "로그인 중..."

Conclusion: The production text reported by user maps to **WelcomeScreen login modal**, not AccountGate.

## 2) Which component renders that modal

The observed modal ("기존 계정으로 로그인" + "확인 중...") is rendered by:
- `WelcomeScreen.jsx` (Step 0 view), using `showLogin` modal state.

`WelcomeScreen.handleLogin` flow:
- sets `loginLoading=true`
- calls `supabase.auth.signInWithPassword`
- on success: sets `pulse_onboarding_complete=true`, then `window.location.reload()`
- on failure: sets error and resets `loginLoading=false`

Notably, there is no `finally` reset; success path relies on reload to leave the screen.

## 3) Is DiscoverJourney Step 3 using AccountGate?

Yes.
- `DiscoverJourney.jsx` imports `AccountGate` and renders it in `case 3`.
- No `SignupGate` usage inside DiscoverJourney currently.

Therefore, the stuck modal shown in production is not from Step 3 AccountGate UI; it is from Step 0 WelcomeScreen’s existing-account modal.

## 4) Is SignupGate still imported/used?

- `SignupGate.jsx` still exists in repo.
- Current `DiscoverJourney.jsx` does not import/use SignupGate.
- Search indicates no active usage path from App/DiscoverJourney for SignupGate.

So SignupGate is currently legacy/unreferenced for Act 1 flow.

## 5) Could App.js show another auth/login modal during Act 1?

No matching text for this modal appears in `App.js`.
The exact observed strings are only in `WelcomeScreen.jsx`.

## 6) Can `handleOnboardingComplete` throw/return before UI state is set?

Yes, but this is likely unrelated to the "확인 중..." modal symptom.

`handleOnboardingComplete` in `App.js`:
- Sets local onboarding state optimistically before DB upsert.
- If no session, it shows toast and returns.
- On upsert error, it sets onboarding complete back to false and throws.

This function runs after Act 1 completion path (later steps), not in WelcomeScreen Step 0 existing-login modal. So it does not explain being stuck on "확인 중..." in that modal.

## 7) Does AccountGate await `onComplete` and always clear loading?

Yes, in both signup/login paths:
- `setLoading(true)` before auth call
- `try/catch/finally` pattern where `finally` sets `loading=false`
- `onComplete` is awaited inside try

So AccountGate itself has proper loading cleanup.

## 8) Supabase upsert shape: direct columns vs non-existent JSON column

Current onboarding/profile writes use direct columns on `pulse_data` (e.g., `user_name`, `tci_profile`, `vak_profile`, `ledger`, etc.) rather than a single nested `pulse_data` JSON column.

This aligns with existing code conventions and is not the immediate cause of the stuck "확인 중..." state.

## 9) Could localStorage `pulse_onboarding_complete` create inconsistent state?

Potentially yes.

WelcomeScreen login success sets `pulse_onboarding_complete=true` **before** full app re-hydration and immediately reloads page.
If session establishment is delayed/fails to restore after reload, UI could enter a mismatched state (onboarding skipped but profile/session incomplete).

However, this would usually show post-reload inconsistency, not a persistent pre-reload "확인 중..." spinner by itself.

## 10) Build/package settings relevance

No package/build setting directly indicates this specific modal hang.
Given the exact text mismatch clue, deployment/version skew is more likely than build script behavior itself.

---

## Root cause hypotheses (ranked)

### 1) Highest likelihood — Production is serving code path with WelcomeScreen login modal (not AccountGate login)
Evidence:
- Exact strings map only to WelcomeScreen.
- AccountGate uses different strings.
- Reported production UI matches WelcomeScreen text exactly.

Interpretation:
- Either users are using Step 0 existing-account modal intentionally,
- or production bundle is stale/older and still using old auth UX path.

### 2) High likelihood — WelcomeScreen login promise path can appear stuck when success path reload doesn’t execute reliably
`handleLogin` sets loading true and only clears on catch.
Success depends on immediate `window.location.reload()` side effect. If reload is blocked/not reached, the button remains "확인 중...".

### 3) Medium likelihood — Supabase auth call not resolving in production environment
If `supabase.auth.signInWithPassword` remains pending (network/env), loading stays true.
Needs runtime network log verification in deployed app.

### 4) Lower likelihood — `handleOnboardingComplete`/upsert issue
This happens in later flow and not in WelcomeScreen modal login, so low fit for this symptom.

---

## Is production likely stale code or different component?

Most likely **different component path** (WelcomeScreen modal) and possibly also stale deployment confusion.
- The observed text is definitely from WelcomeScreen, not AccountGate.
- This does not necessarily prove stale deploy by itself; it proves the user hit a different login entrypoint than Step 3 AccountGate.

---

## Smallest safe code changes recommended (no broad refactor)

1. **One-line resilience fix in `WelcomeScreen.handleLogin`**
   - Add `setLoginLoading(false)` in a `finally` block (or right before `reload` fallback timeout) so spinner cannot remain forever if reload side effect fails.

2. **Optional tiny consistency fix**
   - Change WelcomeScreen button text from "확인 중..." to "로그인 중..." for parity with AccountGate (reduces debugging confusion).

3. **Optional tiny UX routing fix**
   - In WelcomeScreen existing-account modal success, route into authenticated flow without hard page reload where possible.

All are small and isolated. No schema/package/API broad changes needed.

---

## Manual test plan

1. Local dev: WelcomeScreen existing-account login
   - Open Act 1 welcome screen.
   - Click "이미 계정이 있으신가요?"
   - Login with known existing account.
   - Verify spinner transitions and app proceeds (or reloads) within expected time.

2. Local dev: Step 3 AccountGate login path
   - Start Act 1, progress to step 3.
   - Switch to login mode.
   - Login with existing account.
   - Verify button uses "로그인 중..." then proceeds to step 4.

3. Production verification
   - Repeat both entry points (WelcomeScreen modal vs Step 3 AccountGate) and confirm which one users actually use.
   - Use browser devtools network log to confirm whether `signInWithPassword` returns success/error/pending.

4. Regression check
   - New signup flow still works.
   - Existing onboarding completion flag behavior remains consistent after refresh.

---

## Supabase/Vercel manual checks needed

Yes (diagnostic checks only):

1. **Vercel deployment/version check**
   - Confirm latest commit hash deployed to production domain.
   - Check if preview/prod alias is pointing at expected build.

2. **Runtime source map / bundle text check**
   - Inspect loaded JS bundle in prod and verify whether "확인 중..." string is present.
   - If yes, production definitely still includes WelcomeScreen login modal text.

3. **Supabase auth logs**
   - Check auth events for attempted sign-ins at failure time.
   - Confirm whether requests complete and what error codes (if any) are returned.

---

## Conclusion

- The reported production modal is identified as `WelcomeScreen` existing-account modal, not `AccountGate`.
- The strongest diagnosis is component-path/deployment mismatch plus fragile success-path spinner handling in WelcomeScreen login.
- No broad refactor required; a tiny loading-finalization hardening change is the safest next fix.

SAFE_TO_MERGE: yes
Reason: This ticket added investigation documentation only (no runtime code behavior change), and findings are directly traceable to current source.
