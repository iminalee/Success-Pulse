# Success Pulse Project Instructions

## Product concept
Success Pulse is an identity-based future-self coaching app. The core object is the Pulse Profile. Multiple input routes may update the profile, but the app and Apex AI must always read from one unified profile.

## Core principle
Input routes can be multiple:
- Act 1 quick onboarding survey
- user manual entry in My Lab
- counselor manual entry
- AI chat profile patch proposal

But the storage and AI context must be unified:
- Supabase pulse_data is the single profile store.
- ledger is the single source of truth for Mental Bank deposits.
- Apex AI must read the latest pulse_data before responding.
- AI must not silently overwrite profile data. It may propose PROFILE_PATCH, and the user must approve.

## Do not break
- Keep existing UI styling as much as possible.
- Do not remove existing views unless explicitly asked.
- Do not commit API keys.
- Do not move OpenAI/Dify keys to frontend.
- Do not write directly to main.
- Keep backward compatibility with existing fields: user_name, annual_income, target_date, ledger, visions, bps_traits, vak_profile, tci_profile, signature, signed_date, apex_conversation_id.

## Build command
- Use npm install if dependencies are missing.
- Use npm run build to verify.
- Do not add new dependencies unless necessary.

## Development workflow
Before changing code:
1. Inspect relevant files.
2. Explain the intended changes.
3. Make the smallest safe change.
4. Run build.
5. Summarize changed files and manual test steps.

## Current architecture notes
- Main app: src/App.js
- Supabase client: src/supabaseClient.js
- Act 1 onboarding: src/components/discover/DiscoverJourney.jsx
- Signup gate: src/components/discover/SignupGate.jsx
- BPS generation: src/components/discover/BpsGenerator.jsx
- Apex chat server function: api/apex-chat.js

## Target architecture
1. AccountGate replaces or extends SignupGate.
2. Act 1 values must save to Supabase after real login session exists.
3. My Lab manual values must save to the same pulse_data profile.
4. Apex chat server must verify Supabase access token, load pulse_data, and pass profile context to Dify.
5. Contract in Act 1 and Contract in App.js should use one shared contract data model.