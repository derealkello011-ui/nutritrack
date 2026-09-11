# Copilot instructions for NutriTrack

## Project commands

Install dependencies with:

```bash
npm install
```

Run the app with:

```bash
npm run start       # Expo development server
npm run android     # Android native run
npm run ios         # iOS native run
npm run web         # Expo web
```

Quality checks:

```bash
npm run lint        # expo lint
npx tsc --noEmit    # TypeScript check
```

There is currently no test script, test directory, or configured test runner, so there is no supported single-test command. EAS build profiles are defined in `eas.json` and can be run with `npx eas build --profile development`, `preview`, or `production`.

## Architecture

- This is an Expo SDK 57 app using React Native, TypeScript, and Expo Router. The package entry point is `expo-router/entry`.
- File-based routes live under `src/app`. `src/app/_layout.tsx` defines the root stack and wraps the app in `ThemeProvider`, `GestureHandlerRootView`, and `AppAlertProvider`. `src/app/(tabs)/_layout.tsx` defines the four tabs: Home (`index`), Add Meal, All Meals, and Settings.
- The app is local-only. `src/storage/meals.ts` persists `Meal` records in the SQLite `meals` table in `nutritrack.db`. On first database access it migrates any legacy JSON from the AsyncStorage `meals` key, then removes that legacy key. New meals receive a timestamp-based string ID plus an ISO `createdAt` value.
- The Home screen reloads meals on route focus, filters them by the selected local calendar date, then passes that date-scoped array to presentational components. Previous/next controls in `HomeHeader` support history and future dates; the Home screen's add action passes the selected date to Add Meal so pre-logged meals retain that calendar date. `MacroGrid`, sharing, copying, and recent-meal UI all derive totals from the same filtered array. Recent meals display the first five selected-date records; the All Meals screen displays every record.
- Meal deletion is a swipe-left action on `MealItem`; `All Meals` also supports clearing the entire SQLite collection.
- Reminder state is separately persisted under `remindersEnabled`. `ReminderToggler` requests notification permission before enabling reminders, and `scheduleMealReminders` cancels existing scheduled notifications before creating the three daily breakfast, lunch, and dinner notifications.
- Styling is centralized partly in `src/styles/global.ts` (colors and shared layout) and partly in component-local `StyleSheet` objects. The UI uses a dark palette and adapts some spacing and typography by platform.
- `app.json` owns Expo identity, icons, splash screen, URL scheme, typed routes, React Compiler, and native package configuration. `eas.json` contains development, preview, and production build profiles.
- Settings are local-first: `src/storage/settings.ts` stores the theme preference and profile in AsyncStorage, while `src/theme/ThemeProvider.tsx` resolves system/light/dark appearance for the app. The Settings tab owns profile editing, reminder controls, theme selection, and destructive meal-history clearing.
- All user-facing alerts use `src/components/AppAlertProvider.tsx` and `useAppAlert`; do not use React Native's `Alert.alert`, which produces inconsistent platform-native dialogs. The shared provider supports themed error, success, warning, and info dialogs with cancel, default, and destructive buttons.
- `ProfileAvatar` currently renders deterministic initials from the saved profile name; it is shown beside the NutriTrack home title. If image uploads are added later, preserve the initials fallback.
- Branding source artwork lives in `assets/icon.svg` and `assets/splash-screen.svg`; raster derivatives in `assets/images/nutritrack-icon.png` and `assets/images/nutritrack-splash.png` are referenced by Expo because native icon and splash configuration uses raster assets.
- `metro.config.js` treats WASM as a Metro asset for Expo SQLite web support. The Expo Router web headers in `app.json` enable the cross-origin isolation required by SQLite WASM; preserve both when changing web configuration.

## Repository conventions

- Use the `@/*` TypeScript alias for imports from `src` (for example, `@/storage/meals`); assets can use the `@/assets/*` alias.
- Keep the `Meal` shape and component prop types in `src/types/types.ts`; storage functions accept `Omit<Meal, 'id' | 'createdAt'>` when creating records.
- Treat `src/storage/meals.ts` as the boundary for meal persistence. Do not read or write SQLite or the legacy `meals` AsyncStorage key directly from screens or components. Use `getMealsForDate` when a date-scoped query is sufficient.
- Screens that display meal data should reload on focus with Expo Router's `useFocusEffect`, because add/delete operations update SQLite outside the current screen's state.
- Reuse `colors` and shared layout styles from `src/styles/global.ts` before adding new global visual values. Keep screen-specific styles next to the component that owns them.
- Preserve the current interaction patterns: add-meal validation uses the custom modal, successful add navigates back only after confirmation, and meal deletion uses swipe-left gesture handling.
- Macro totals on Home sum only meals whose `createdAt` falls on the selected local calendar date. Storage still retains all meals, and All Meals remains unfiltered. Date-only comparisons should use the helpers in `src/utils/date.ts` rather than UTC string comparisons.
- Notification scheduling uses Expo Notifications' SDK 57 trigger API and the notification handler is configured at module load in `src/utils/notification.ts`.
- `meals.tsx` uses `FlatList` for the full meal history, and `RecentMeals` uses a non-scrolling `FlatList` for its small dashboard preview. `MealItem` is memoized; aggregate calculations in `MacroGrid`, `CopyButton`, and `ShareButton` use `useMemo`.
- Macro cards show capped linear progress bars against the configured goals. Meal rows are wrapped in `GestureHandlerRootView` and use Gesture Handler plus Reanimated for swipe-left deletion; keep delete completion on the JS thread via `runOnJS`.
- `FrequentMeals` is populated from SQLite `getFrequentMeals()` and selecting a suggestion pre-fills the Add Meal form. `WeeklyTrends` uses the SQLite-backed seven-day totals query and renders a dependency-free bar chart.
- Before changing Expo configuration or SDK APIs, consult the versioned Expo SDK 57 documentation. `AGENTS.md` and `CLAUDE.md` contain the repository's current Expo guidance.
