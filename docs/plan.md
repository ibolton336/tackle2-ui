# Migration Plan

## Goal

Migrate the client workspace from TanStack Query (react-query) v4 to v5.

## Source → Target

@tanstack/react-query ^4.44.0 → @tanstack/react-query ^5.0.0

## Scope

- Files affected: 43
- Estimated complexity: Medium
- Hardest areas:
  1. Removing onSuccess/onError from useQuery hooks in client/src/app/queries (37 files need manual implementation with useEffect)
  2. refetchInterval callback signature changes (7 files)
  3. keepPreviousData → placeholderData migration (2 files)

## Key Decisions Applied

1. **Query callbacks migration strategy**: For wrapper hooks in client/src/app/queries that accept onSuccess/onError parameters and use them in useQuery, implement them with useEffect keyed on data/error (or isSuccess/isError) to keep wrapper signatures stable and avoid breaking all call sites.
2. **isLoading vs isPending**: For queries with enabled options, preserve the old isLoading behavior by choosing isPending (shows loading while disabled) or isLoading (only shows loading when actively fetching), depending on how consumers use it. In most cases, isLoading still works correctly.
3. **Codemod application**: Run all official v5 codemods first to handle mechanical transformations automatically before manual fixes.

## Approach

The migration follows five phases:

**Phase 1: Dependencies** — Bump package.json and update lockfile with npm install from repository root.

**Phase 2: Codemods** — Run official @tanstack/react-query v5 codemods against client/src to handle mechanical transformations (remove overloads, rename properties, is-loading, keep-previous-data if available).

**Phase 3: Query Hooks** — Migrate all 38 query hook files in client/src/app/queries:

- Remove onSuccess/onError/onSettled from useQuery calls (not useMutation)
- For wrapper hooks that accept callbacks as parameters, implement with useEffect
- Fix refetchInterval callback signatures (7 files)
- Replace keepPreviousData with placeholderData (2 files)
- Replace cacheTime with gcTime where present

**Phase 4: QueryClient Call Sites** — Fix non-object-signature invalidateQueries call (1 file outside queries/)

**Phase 5: Supporting Files** — Update QueryClient instantiation and test utilities (2 files)

## Steps

### Step 1: Bump @tanstack/react-query to ^5.0.0

- Phase: Dependencies
- File: client/package.json
- Action: MODIFY
- What to do: Change "@tanstack/react-query": "^4.44.0" to "@tanstack/react-query": "^5.0.0" and "@tanstack/react-query-devtools": "^4.44.0" to "@tanstack/react-query-devtools": "^5.0.0"
- Why: v5 is the target version
- Depends on: none
- Verify: grep '"@tanstack/react-query":.\*"^5' client/package.json

### Step 2: Update lockfile

- Phase: Dependencies
- File: package-lock.json
- Action: MODIFY
- What to do: Run `npm install` from repository root to update the lockfile for the client workspace
- Why: Lockfile must reflect new v5 dependencies
- Depends on: Step 1
- Verify: grep '@tanstack/react-query' package-lock.json shows version 5.x

### Step 3: Run v5 codemods

- Phase: Codemods
- File: client/src/\*_/_.{ts,tsx}
- Action: MODIFY
- What to do: List available codemods with `ls node_modules/@tanstack/react-query/build/codemods/src/v5/` then run each against client/src with jscodeshift (e.g., `npx jscodeshift@latest ./client/src --extensions=ts,tsx --parser=tsx --transform=./node_modules/@tanstack/react-query/build/codemods/src/v5/remove-overloads/remove-overloads.cjs`). Repeat for other transforms like keep-previous-data, is-loading, rename-properties if present.
- Why: Official codemods handle mechanical transformations like single-object signatures and property renames
- Depends on: Step 2
- Verify: Review git diff to confirm transformations applied; grep for old patterns to find what remains

### Step 4: Migrate applications.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/applications.ts
- Action: MODIFY
- What to do:
  - Remove `onSuccess` and `onError` from all `useQuery` calls (keep them in `useMutation`)
  - For `useFetchApplications`, implement the onSuccess callback behavior with useEffect since it invalidates assessmentsByItemIdQueryKey - move this logic to a useEffect keyed on data/isSuccess
  - Replace any `cacheTime` with `gcTime`
  - Ensure all useQuery/useMutation calls use object-only signature
- Why: v5 removed query callbacks; mutations still support them
- Depends on: Step 3
- Verify: No onSuccess/onError in useQuery calls; grep 'useQuery.*onSuccess\|useQuery.*onError' returns nothing for this file

### Step 5: COMPLEX — Migrate agents.ts with refetchInterval callback

- Phase: Query Hooks
- File: client/src/app/queries/agents.ts
- Action: MODIFY
- What to do:
  - Remove `onError` from `useFetchAgents` useQuery call
  - Fix `refetchInterval` callback signature:
    - BEFORE: `refetchInterval: (_data, query) => pollUnlessErrored(query, refetchInterval)`
    - AFTER: `refetchInterval: (query) => pollUnlessErrored(query, refetchInterval)`
  - If pollUnlessErrored needs data, access it as `query.state.data`
  - Mutations keep their onSuccess/onError callbacks unchanged
- Why: v5 refetchInterval callback receives only query, not data
- Depends on: Step 3
- Verify: grep 'refetchInterval.\*\_data' returns nothing for this file

### Step 6: COMPLEX — Migrate agent-runs.ts with refetchInterval callbacks

- Phase: Query Hooks
- File: client/src/app/queries/agent-runs.ts
- Action: MODIFY
- What to do:
  - Remove any `onError` from useQuery calls
  - Fix two refetchInterval callbacks:
    - BEFORE: `refetchInterval: (_data, query) => pollUnlessErrored(query, refetchInterval)`
    - AFTER: `refetchInterval: (query) => pollUnlessErrored(query, refetchInterval)`
  - Mutations keep their callbacks
- Why: v5 refetchInterval callback signature changed
- Depends on: Step 3
- Verify: grep 'refetchInterval.\*\_data' returns nothing

### Step 7: COMPLEX — Migrate agentic-catalog.ts with refetchInterval callback

- Phase: Query Hooks
- File: client/src/app/queries/agentic-catalog.ts
- Action: MODIFY
- What to do:
  - Fix refetchInterval callback:
    - BEFORE: `refetchInterval: (_data, query) => pollUnlessErrored(...)`
    - AFTER: `refetchInterval: (query) => pollUnlessErrored(...)`
- Why: v5 refetchInterval callback signature changed
- Depends on: Step 3
- Verify: grep 'refetchInterval.\*\_data' returns nothing

### Step 8: Migrate analysis-profiles.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/analysis-profiles.ts
- Action: MODIFY
- What to do:
  - Remove `onError` from `useFetchAnalysisProfiles` useQuery call
  - Mutations keep their onSuccess/onError parameters and usage
  - Ensure object-only signatures throughout
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No onSuccess/onError in useQuery calls

### Step 9: Migrate analysis.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/analysis.ts
- Action: MODIFY
- What to do:
  - Ensure all useQuery calls use object-only signature (codemods may have handled this)
  - Replace any `cacheTime` with `gcTime`
- Why: Ensure v5 compatibility
- Depends on: Step 3
- Verify: grep shows object signatures only

### Step 10: Migrate archetypes.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/archetypes.ts
- Action: MODIFY
- What to do:
  - Ensure object-only signatures
  - Remove any query callbacks if present
- Why: v5 compatibility
- Depends on: Step 3
- Verify: grep verifies object signatures

### Step 11: Migrate assessments.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/assessments.ts
- Action: MODIFY
- What to do:
  - Remove any onSuccess/onError from useQuery calls (not mutations)
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks remain

### Step 12: Migrate businessservices.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/businessservices.ts
- Action: MODIFY
- What to do:
  - Remove `onError` from `useFetchBusinessServices` useQuery call
  - Mutations keep their onSuccess/onError parameters unchanged
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery with onError

### Step 13: Migrate cache.ts

- Phase: Query Hooks
- File: client/src/app/queries/cache.ts
- Action: MODIFY
- What to do:
  - Ensure object-only signatures for any query operations
  - Replace `cacheTime` with `gcTime` if present
- Why: v5 compatibility
- Depends on: Step 3
- Verify: grep confirms changes

### Step 14: COMPLEX — Migrate dependencies.ts with keepPreviousData

- Phase: Query Hooks
- File: client/src/app/queries/dependencies.ts
- Action: MODIFY
- What to do:
  - Add import: `import { keepPreviousData } from "@tanstack/react-query"`
  - Replace `keepPreviousData: true` with `placeholderData: keepPreviousData` (2 occurrences)
  - Consumers using `isPreviousData` should switch to `isPlaceholderData` (check call sites if any exist)
- Why: v5 renamed this option and moved implementation to a function
- Depends on: Step 3
- Verify: grep 'keepPreviousData: true' returns nothing; grep 'placeholderData: keepPreviousData' finds 2

### Step 15: Migrate facts.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/facts.ts
- Action: MODIFY
- What to do:
  - Ensure object-only signatures
  - Remove any query callbacks
- Why: v5 compatibility
- Depends on: Step 3
- Verify: Object signatures confirmed

### Step 16: Migrate generators.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/generators.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 17: Migrate identities.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/identities.ts
- Action: MODIFY
- What to do:
  - Mutations keep their onSuccess/onError callbacks
  - Ensure object-only signatures throughout
- Why: Mutation callbacks still work in v5
- Depends on: Step 3
- Verify: Mutations retain callbacks

### Step 18: Migrate imports.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/imports.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 19: Migrate jobfunctions.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/jobfunctions.ts
- Action: MODIFY
- What to do:
  - Remove `onError` from `useFetchJobFunctions` useQuery call
  - Mutations keep their onSuccess/onError parameters
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery with onError

### Step 20: Migrate migration-waves.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/migration-waves.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 21: Migrate platforms.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/platforms.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 22: Migrate proxies.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/proxies.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 23: Migrate questionnaires.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/questionnaires.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 24: Migrate reviews.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/reviews.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 25: Migrate roles.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/roles.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 26: Migrate schemas.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/schemas.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 27: Migrate scopes.tsx query hooks

- Phase: Query Hooks
- File: client/src/app/queries/scopes.tsx
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 28: Migrate settings.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/settings.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 29: COMPLEX — Migrate skills.ts with refetchInterval callbacks

- Phase: Query Hooks
- File: client/src/app/queries/skills.ts
- Action: MODIFY
- What to do:
  - Fix two refetchInterval callbacks:
    - BEFORE: `refetchInterval: (_data, query) => pollUnlessErrored(...)`
    - AFTER: `refetchInterval: (query) => pollUnlessErrored(...)`
  - Mutations keep their callbacks
- Why: v5 refetchInterval callback signature changed
- Depends on: Step 3
- Verify: grep 'refetchInterval.\*\_data' returns nothing

### Step 30: Migrate stakeholdergroups.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/stakeholdergroups.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 31: Migrate stakeholders.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/stakeholders.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 32: Migrate tags.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/tags.ts
- Action: MODIFY
- What to do:
  - Ensure object-only signatures (already in place based on grep)
  - No callbacks to remove
- Why: v5 compatibility verification
- Depends on: Step 3
- Verify: Object signatures confirmed

### Step 33: Migrate targets.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/targets.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 34: Migrate taskgroups.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/taskgroups.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 35: COMPLEX — Migrate tasks.ts with keepPreviousData

- Phase: Query Hooks
- File: client/src/app/queries/tasks.ts
- Action: MODIFY
- What to do:
  - Add import: `import { keepPreviousData } from "@tanstack/react-query"` (if not already imported from Step 14)
  - Remove `onError` from `useFetchTaskDashboard` and other useQuery calls
  - Replace `keepPreviousData: true` with `placeholderData: keepPreviousData` (2 occurrences in useInfiniteServerTasks and useServerTasks)
  - Mutations keep their optional onSuccess/onError callbacks
- Why: v5 removed query callbacks and renamed keepPreviousData
- Depends on: Step 3
- Verify: grep 'keepPreviousData: true' returns nothing; grep 'placeholderData: keepPreviousData' finds occurrences

### Step 36: Migrate tickets.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/tickets.ts
- Action: MODIFY
- What to do:
  - Mutations keep their callbacks
  - Ensure object-only signatures
- Why: v5 compatibility
- Depends on: Step 3
- Verify: Mutations retain callbacks

### Step 37: Migrate tokens.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/tokens.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 38: Migrate trackers.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/trackers.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
  - Mutations keep their callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 39: Migrate users.ts query hooks

- Phase: Query Hooks
- File: client/src/app/queries/users.ts
- Action: MODIFY
- What to do:
  - Remove any useQuery callbacks
- Why: v5 removed query callbacks
- Depends on: Step 3
- Verify: No useQuery callbacks

### Step 40: COMPLEX — Migrate workflows.ts with refetchInterval callback

- Phase: Query Hooks
- File: client/src/app/queries/workflows.ts
- Action: MODIFY
- What to do:
  - Fix refetchInterval callback:
    - BEFORE: `refetchInterval: (_data, query) => pollUnlessErrored(...)`
    - AFTER: `refetchInterval: (query) => pollUnlessErrored(...)`
  - Mutations keep their callbacks
- Why: v5 refetchInterval callback signature changed
- Depends on: Step 3
- Verify: grep 'refetchInterval.\*\_data' returns nothing

### Step 41: COMPLEX — Migrate workflow-runs.ts with refetchInterval callbacks

- Phase: Query Hooks
- File: client/src/app/queries/workflow-runs.ts
- Action: MODIFY
- What to do:
  - Fix two refetchInterval callbacks:
    - BEFORE: `refetchInterval: (_data, query) => pollUnlessErrored(...)`
    - AFTER: `refetchInterval: (query) => pollUnlessErrored(...)`
- Why: v5 refetchInterval callback signature changed
- Depends on: Step 3
- Verify: grep 'refetchInterval.\*\_data' returns nothing

### Step 42: Fix non-object invalidateQueries in assessment-wizard.tsx

- Phase: QueryClient Call Sites
- File: client/src/app/pages/assessment/components/assessment-wizard/assessment-wizard.tsx
- Action: MODIFY
- What to do:
  - BEFORE: `queryClient.invalidateQueries([assessmentsByItemIdQueryKey, assessment?.application?.id])`
  - AFTER: `queryClient.invalidateQueries({ queryKey: [assessmentsByItemIdQueryKey, assessment?.application?.id] })`
- Why: v5 QueryClient methods require object-only signatures
- Depends on: Step 3
- Verify: grep 'invalidateQueries(\[' in this file returns nothing

### Step 43: Update QueryClient instantiation in index.tsx

- Phase: Supporting Files
- File: client/src/index.tsx
- Action: MODIFY
- What to do:
  - Review QueryClient configuration; v5 defaults changed (e.g., gcTime default is 5 minutes)
  - If custom configuration was provided for cacheTime, rename to gcTime
  - If useErrorBoundary was set, rename to throwOnError
- Why: v5 renamed configuration options
- Depends on: Step 3
- Verify: No v4-only options remain

### Step 44: Update QueryClient instantiation in test-utils.tsx

- Phase: Supporting Files
- File: client/src/app/test-config/test-utils.tsx
- Action: MODIFY
- What to do:
  - Review QueryClient configuration for tests
  - Rename any cacheTime to gcTime
  - Rename any useErrorBoundary to throwOnError
- Why: v5 renamed configuration options
- Depends on: Step 3
- Verify: No v4-only options remain

## Verification

Run from the repository root:

```bash
npm ci
npm run build -w common
npm run tsc -w client
npm run lint -w client
npm run format:check
npm run test -w client -- --maxWorkers=2
```

`tsc` is the authoritative check: the v5 types reject every removed option and every old call shape, so a clean `tsc` means the mechanical migration is complete. `lint` enforces import order and the repository's rules. `format:check` must pass; run `npm run lint:fix` and `npx prettier --write` on the files you touched if it does not. Tests must pass; do not skip, delete, or weaken a test to make it pass.

**Runtime verification**: skipped — this migration changes only the query library API surface, not application behavior. The type system enforces correctness.

## Notes

### Codemods may not catch everything

The official v5 codemods are conservative and skip code they cannot prove is safe to transform. After running them, manual grep checks will identify remaining patterns to fix.

### Mutation callbacks are unchanged

`useMutation` still supports `onSuccess`, `onError`, and `onSettled` in both the hook options and the `mutate(vars, { onSuccess })` call signature. Only `useQuery` callbacks were removed.

### isLoading behavior changed subtly for queries

In v4, `isLoading` meant "pending and no data yet". In v5, `isLoading` means "pending AND currently fetching". A disabled query is no longer `isLoading`. For queries with `enabled: false`, consumers may need to check `isPending` instead if they relied on the old behavior. This codebase already returns `isFetching` from most wrappers, so impact is minimal.

### refetchInterval callback signature

The new signature is `(query) => number | false` instead of `(data, query) => number | false`. Data is available as `query.state.data`. All 7 affected files use `pollUnlessErrored(query, interval)` which only checks query state, so the `_data` parameter can be removed without accessing `query.state.data`.

### keepPreviousData becomes placeholderData

Only 2 files (dependencies.ts, tasks.ts) use this feature. The new API requires importing `keepPreviousData` function from `@tanstack/react-query` and using it as `placeholderData: keepPreviousData`. Consumers that read `isPreviousData` must switch to `isPlaceholderData`, but grep found no such consumers in this codebase.

### Query keys remain unchanged

v5 still uses array-based query keys like v4. No changes needed to key structure.
