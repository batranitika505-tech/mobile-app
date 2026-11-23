# MASTER IMPLEMENTATION PLAN
## JalRakshak – Groundwater Conservation & Management Game

**Project type:** Android Mobile Application  
**Problem Statement:** Development of an Educational Game (Web-based and Mobile-based) on Groundwater Conservation and Management  
**Organisation:** Ministry of Jal Shakti  
**Department:** Central Ground Water Board  
**Development framework:** React Native + Expo  
**Language:** TypeScript  
**Backend:** Supabase  
**Android delivery:** Installable APK through Expo EAS Build

---

## 1. PROJECT OBJECTIVE

Build a complete, polished, functional Android application that teaches groundwater conservation and management through interactive scenario-based gameplay.

Users must be able to:
- Register and log in.
- Play groundwater management scenarios.
- Make decisions involving artificial recharge, micro-irrigation and crop diversification.
- Experience drought, surplus rainfall and groundwater contamination scenarios.
- Earn XP, coins and achievements.
- Track personal game progress.
- View online leaderboard rankings.
- Become eligible for a project-generated educational achievement certificate.

This must be a working mobile application, not a static UI prototype.

## 2. FIXED TECHNOLOGY STACK

- React Native
- Expo
- TypeScript
- Expo Router
- Supabase Authentication
- Supabase PostgreSQL
- AsyncStorage for local progress and guest sessions
- Lucide React Native for icons
- Expo EAS Build for Android APK

Do not introduce unnecessary frameworks, microservices, AI models or additional infrastructure.

## 3. DESIGN REQUIREMENTS

Create a premium, modern environmental gaming interface.

Visual direction:
- Primary colors: deep navy, aquatic blue, turquoise and white.
- Use green selectively for sustainable actions.
- Use subtle gradients and rounded cards.
- Use consistent typography, spacing and iconography.
- Add smooth transitions and lightweight animations.
- Use illustrations for drought, rainfall, agriculture and groundwater.
- Maintain readable text and accessible contrast.
- Design for Android phones of different screen sizes.

Avoid:
- Generic unstyled forms.
- Excessive gradients.
- Inconsistent spacing.
- Fake buttons.
- Empty screens.
- Placeholder functionality.

## 4. REQUIRED APPLICATION SCREENS

1. Splash screen.
2. Onboarding.
3. Registration.
4. Login.
5. Guest mode.
6. Home dashboard.
7. Game world / level selection.
8. Scenario introduction.
9. Interactive gameplay.
10. Decision feedback.
11. Level completion.
12. Rewards and achievements.
13. Leaderboard.
14. Player profile.
15. Certificate screen.
16. Settings and logout.

## 5. GAME MODULES

Implement four complete modules.

### Module 1: Drought Crisis
Teach groundwater conservation during drought.

Concepts:
- Drip irrigation.
- Water-efficient farming.
- Crop diversification.
- Groundwater over-extraction.

### Module 2: Rainfall Opportunity
Teach sustainable management of surplus rainfall.

Concepts:
- Artificial recharge.
- Recharge pits.
- Rainwater harvesting.
- Surface runoff management.

### Module 3: Contamination Crisis
Teach groundwater quality management.

Concepts:
- Contamination source identification.
- Water quality testing.
- Pollution prevention.
- Safe water usage.

### Module 4: Smart Agriculture
Teach sustainable agricultural practices.

Concepts:
- Micro-irrigation.
- Crop selection.
- Irrigation scheduling.
- Efficient water utilization.

Each module must contain multiple meaningful scenarios with 3–4 selectable decisions.

Every decision must:
1. Display its result.
2. Show educational feedback.
3. Award appropriate XP and coins.
4. Update the player's progress.
5. Explain why the selected action is sustainable or unsustainable.

All scenario content and answer keys must be maintained in structured, reusable TypeScript data files.

Do not hardcode gameplay logic separately in every screen.

## 6. GAME ECONOMY

Implement:
- XP.
- Coins.
- Player levels.
- Achievement badges.
- Scenario completion rewards.
- Module completion rewards.

Initial scoring:
- Correct sustainable decision: 100 XP.
- Partially sustainable decision: 40 XP.
- Unsustainable decision: 0 XP.
- Scenario completion bonus: 50 XP.

Prevent duplicate rewards from repeated completion of the same scenario.

Display score changes immediately.

## 7. AUTHENTICATION

Implement:
- Email/password registration.
- Email/password login.
- Logout.
- Session persistence.
- Guest mode.

Guest users must be able to play without registering.

Guest progress must be stored locally.

Registered users must have their progress synchronized with Supabase.

When a guest creates an account, preserve and migrate their local progress without duplicating scores.

Provide proper loading, error and validation states.

## 8. DATABASE

Create SQL migrations for:

### profiles
- id
- username
- display_name
- avatar_url
- created_at

### game_progress
- id
- user_id
- module_id
- completed_scenarios
- total_xp
- updated_at

### game_scores
- id
- user_id
- module_id
- scenario_id
- earned_xp
- earned_coins
- created_at

### achievements
- id
- user_id
- achievement_type
- unlocked_at

### certificates
- id
- user_id
- certificate_number
- issued_at
- total_xp

Configure:
- Foreign keys.
- Unique constraints.
- Appropriate indexes.
- Row Level Security.
- Secure ownership policies.
- Protected score-reward operations.

Do not expose privileged Supabase credentials in the app.

## 9. LEADERBOARD

Implement an online leaderboard.

Requirements:
- Rank registered players by total verified XP.
- Show username, rank and score.
- Highlight the current user's position.
- Handle empty leaderboard states.
- Handle loading and network errors.
- Exclude guest users from online rankings.

Use database-side aggregation or a protected leaderboard query.

## 10. CERTIFICATE

Implement a certificate screen.

Eligibility:
- Complete all four game modules.
- Earn at least 70% of the configured maximum XP.

Generate a project-issued educational achievement certificate containing:
- Player display name.
- Certificate number.
- Achievement title.
- Issue date.
- Total XP.
- JalRakshak branding.

Allow certificate sharing or saving as PDF.

Clearly state that the certificate is a project-generated learning achievement and is not an official government certification.

## 11. OFFLINE SUPPORT

- Cache game content locally.
- Allow guest gameplay without internet.
- Store guest progress locally.
- Handle temporary network failures.
- Synchronize registered user progress when connectivity returns.
- Prevent duplicate rewards during synchronization.

Do not allow unverified offline score submissions to manipulate online leaderboard rankings.

## 12. PROJECT STRUCTURE

Use a clean modular architecture:

app/
  _layout.tsx
  index.tsx
  onboarding/
  auth/
  (tabs)/
    index.tsx
    game.tsx
    leaderboard.tsx
    profile.tsx
  game/
    [moduleId].tsx
    scenario/
    result/
  certificate/

src/
  components/
  constants/
  data/
  features/
    auth/
    game/
    leaderboard/
    achievements/
    certificate/
  hooks/
  lib/
    supabase.ts
  services/
  store/
  types/
  utils/

supabase/
  migrations/

assets/
  images/
  icons/
  illustrations/

Also include:
- .env.example
- README.md
- app.json
- eas.json
- MASTER_IMPLEMENTATION_PLAN.md

Adapt the structure where necessary, but maintain separation between screens, game logic, data and backend services.

## 13. TESTING

Verify:

- Application launches successfully.
- Navigation works.
- Registration and login work.
- Guest mode works.
- All four game modules are playable.
- Decisions generate correct feedback.
- XP and coins update correctly.
- Repeated scenarios do not duplicate rewards.
- Progress persists after restarting the app.
- Supabase synchronization works.
- Leaderboard displays real registered users.
- Certificate eligibility is calculated correctly.
- Offline mode works.
- No critical TypeScript errors.
- No runtime crashes.
- No broken navigation or dead buttons.

Test on an Android emulator and, where possible, a physical Android device.

## 14. ANDROID BUILD

Configure Expo EAS for a standalone Android APK.

Requirements:
- Android package identifier.
- Production environment variables.
- APK build profile.
- Appropriate app name and icon.
- Correct Android permissions.
- No unnecessary permissions.

Use an APK build configuration rather than an Android App Bundle when the objective is direct installation and sharing.

Build using:

npx expo install --check
npx expo-doctor
npx tsc --noEmit
npx expo export --platform android
eas build -p android --profile preview

Configure the preview profile with:

"android": {
  "buildType": "apk"
}

The exact commands may be adjusted based on the installed Expo SDK and EAS configuration.

After building:
- Obtain the EAS build URL.
- Download the generated APK.
- Verify the downloaded APK installs.
- Launch and test the installed application.
- Provide the final APK download link.
- Document the build URL in README.md.

Do not claim a successful build until the APK has actually been generated and verified.

## 15. DEVELOPMENT RULES

1. Inspect the existing repository before making changes.
2. Do not overwrite existing files without inspection.
3. Do not install unnecessary packages.
4. Use compatible Expo-supported package versions.
5. Do not introduce mock backend functionality as a replacement for real functionality.
6. Never expose secrets.
7. Never use hardcoded leaderboard data in production.
8. Do not leave nonfunctional buttons.
9. Do not skip error handling.
10. Run verification after each major milestone.
11. Keep changes scoped to the current milestone.
12. Do not proceed to the next milestone if the current one has critical failures.
13. Commit meaningful completed milestones to Git.
14. Update README.md with actual implementation and setup instructions.

## 16. PRIORITY

P0:
- App startup.
- Navigation.
- Game modules.
- Scenario engine.
- Scoring.
- Local progress.
- APK generation.

P1:
- Authentication.
- Supabase integration.
- Online leaderboard.
- Achievement system.

P2:
- Certificate PDF.
- Offline synchronization refinements.
- UI polish and animations.

Deliver a working application before attempting additional enhancements.

## 17. DEFINITION OF DONE

The project is complete only when:

- The Android application launches.
- Users can play all four modules.
- Game decisions and rewards work correctly.
- Progress persists.
- Registered users can authenticate.
- Scores synchronize online.
- The leaderboard uses real database records.
- The certificate feature works.
- The APK installs and launches successfully.
- The final EAS build URL and APK download URL are documented.

**Final goal: A functional, demonstrable, installable Android application for groundwater conservation education.**