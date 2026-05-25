# Success Pulse Project Instructions

## Product concept

Success Pulse is an identity-based future-self coaching app.

The core object is the Pulse Profile. Multiple input routes may update the profile, but the app and Apex AI must always read from one unified profile.

## Core principle

Input routes can be multiple:

- Act 1 quick onboarding survey
- User manual entry in My Lab
- Counselor manual entry
- AI chat profile patch proposal

But the storage and AI context must be unified:

- Supabase pulse_data is the single profile store.
- Ledger is the single source of truth for Mental Bank deposits.
- Apex AI must read the latest pulse_data before responding.
- AI must not silently overwrite profile data.
- AI may propose PROFILE_PATCH, but the user must approve before saving.

## Do not break

- Keep existing UI styling as much as possible.
- Do not remove existing views unless explicitly asked.
- Do not commit API keys or secrets.
- Do not expose OpenAI, Dify, or Supabase service role keys to the frontend.
- Do not make broad refactors.
- Do not change unrelated UI.
- Keep backward compatibility with existing fields:
  - user_name
  - annual_income
  - target_date
  - ledger
  - visions
  - bps_traits
  - vak_profile
  - tci_profile
  - signature
  - signed_date
  - apex_conversation_id

## Build command

- Use npm install if dependencies are missing.
- Use npm run build to verify changes.
- Do not add new dependencies unless necessary.

## Development workflow

Before changing code:

1. Inspect relevant files.
2. Explain the intended changes.
3. Make the smallest safe change.
4. Run npm run build.
5. Summarize changed files and manual test steps.

After changes, always report:

1. Files changed
2. What changed
3. How to test manually
4. Risks or follow-up tasks

## Current architecture notes

- Main app: src/App.js
- Supabase client: src/supabaseClient.js
- Act 1 onboarding: src/components/discover/DiscoverJourney.jsx
- Signup gate: src/components/discover/SignupGate.jsx
- BPS generation: src/components/discover/BpsGenerator.jsx
- Apex chat server function: api/apex-chat.js

## Target architecture

1. AccountGate should replace or extend SignupGate.
2. Act 1 values must save to Supabase only after a real login session exists.
3. My Lab manual values must save to the same pulse_data profile.
4. Apex chat server must verify the Supabase access token, load pulse_data, and pass profile context to Dify.
5. Contract in Act 1 and Contract in App.js should share one contract data model.
6. Ledger should become the single source of truth for Mental Bank deposits.

## Product data model direction

The unified Pulse Profile should include:

- user_name
- tci_profile
- vak_profile
- annual_income
- target_date
- life_profile
  - sleep_time
  - wake_time
  - sleep_notes
  - major_goals
- visions or levels
  - level 1 to 5 goals
  - fixed_value_events
- bps_traits
- apex_bps
- contract
- ledger
- apex_conversation_id

## AI behavior

Apex AI should use the user's latest Pulse Profile when responding.

Apex AI may suggest profile updates using this format:

[PROFILE_PATCH]
...
[/PROFILE_PATCH]

But the app must ask the user to approve the patch before saving it.

## Important rule

Do not attempt to fix the entire app at once.

Work ticket by ticket.
