# AURA Frontend Bug Fix TODO

## Phase 1: Critical Fixes ✅ COMPLETE
## Phase 2: TypeScript & Props [IN PROGRESS]
- [x] Create this TODO.md  
- [x] App.tsx: Add ErrorBoundary wrapper
- [x] PathScreen.tsx: Fix conditional done-check + Lottie error handling
- [x] StudentSettingsScreen.tsx: Remove undefined CSS classes 
- [x] TeamScreen.tsx: Fix confetti key prop (unique IDs)
- [x] All Lazy Components: Add Suspense boundaries
- [x] Inline styles → CSS class consistency

## Phase 2: TypeScript & Props [IN PROGRESS]
- [x] App.tsx: Centralize all interfaces
- [ ] Component Props: Comprehensive interfaces + defaults
- [ ] StudentSettingsScreen.tsx: Remove undefined CSS classes
- [ ] FlameIcon: Add fallback rendering

## Phase 3: Performance
- [ ] React.memo(): Fix deps on all memoized components
- [ ] useCallback/useMemo: Wrap handlers/selectors
- [ ] Leaderboard: Memoize sorting logic

## Phase 4: Accessibility & UX
- [ ] Fix ARIA labels, roles, keyboard nav
- [ ] Add loading states for async ops

## Post-Fix Validation
```
npm run lint -- --fix
npm run build
Lighthouse: 90+ Accessibility
React Profiler: No unnecessary re-renders
```

**Phase 2 START → Centralizing TypeScript interfaces**

