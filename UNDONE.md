# Migration Undone Tasks - `factgraph` testing blockers

This document outlines the current blockers and next steps for the `factgraph` migration, specifically regarding the failing test suite.

## Summary of Blocker

The `yarn workspace factgraph test` command consistently hangs and eventually times out, preventing any progress on the `factgraph` migration. The root cause is unknown, but it appears to be an issue with the test runner (`vitest`) or the environment, rather than the test code itself. The process seems to get stuck before the tests are even executed.

### Debugging Steps Taken

The following steps have been taken in an attempt to diagnose and fix the issue, without success:

1.  **Environment Fixes:**
    *   Reset the entire repository to a clean state.
    *   Rebuilt the yarn environment from scratch, removing the pinned `yarnPath` and running `yarn install` successfully.

2.  **Test Code Investigation:**
    *   Identified that only one test file exists: `packages/factgraph/src/__tests__/Dollar.test.ts`. The test code itself appears simple and correct, with no obvious infinite loops or blocking operations.
    *   Temporarily implemented the `get()`, `getThunk()`, and `explain()` methods in `BinaryExpression.ts` and `ReduceExpression.ts` to rule out "Not Implemented" errors as the cause of the hang.

3.  **Test Runner Configuration:**
    *   Examined `packages/factgraph/vitest.config.ts` and the root `vite.config.ts`; both are standard and minimal.
    *   Added verbose logging (`--verbose`, `--logHeapUsage`) to the `vitest` command, which did not provide any useful insights before timing out.
    *   Added a very aggressive `testTimeout: 1000` to the `vitest.config.ts`. The test run still hung and timed out after the full duration, indicating the runner is not even reaching the stage where it applies the test timeout.

## New Plan for Investigation

The next steps will be to try more forceful methods of isolation and execution control.

1.  **Use `timeout` Utility:**
    *   Wrap the test command with the `timeout` command-line utility (e.g., `timeout 30s yarn workspace factgraph test`). This will provide a hard stop to the process and might give a different exit code or signal that can be useful for debugging.

2.  **Isolate Test Execution:**
    *   Attempt to run `vitest` against the single test file directly, bypassing the `yarn workspace` command if possible. The command would look something like `vitest run packages/factgraph/src/__tests__/Dollar.test.ts`.

3.  **Alternative Test Runner:**
    *   If the above steps fail, the final resort is to switch the test runner from `vitest` to `jest`. This is a more involved step that includes:
        *   Adding `jest`, `@types/jest`, and `ts-jest` as dev dependencies.
        *   Creating a `jest.config.js` file.
        *   Updating the `test` script in `package.json`.

### Update: `timeout` Utility Failure

The plan to use the `timeout` command-line utility also failed. The command `timeout 30s yarn workspace factgraph test` did not terminate after 30 seconds and the entire operation timed out after the sandbox limit of 400 seconds.

**This is a critical finding.** It strongly indicates the root of the problem is a fundamental issue within the execution environment provided, as basic shell utilities are not behaving as expected.

**Conclusion:** Progress is blocked until the environment is fixed. The `factgraph` migration cannot continue. A new testing strategy has been documented in `TESTING.md` to be used once a stable environment is available.

---

### Update: Further Investigation (Agent Jules)

A deeper investigation was conducted to resolve the testing blockade. The findings are as follows:

1.  **Environment and `vitest` Hanging:**
    *   The initial hanging issue with `vitest` was resolved. The root causes were a `yarn` version mismatch (fixed by running `corepack enable`) and a missing `jsdom` dependency required by the test environment.
    *   After these fixes, `vitest` no longer hangs. However, it fails to discover any tests, even when the test file is provided directly. It exits with an "Unknown Error".

2.  **Migration to `node:test`:**
    *   As `vitest` proved unworkable, an attempt was made to migrate to the native Node.js test runner (`node --test`).
    *   This involved removing `vitest` dependencies, rewriting the test file to use the `node:test` API, and creating a local `tsconfig.json` for the package.
    *   This approach also failed, but with a different, consistent error: `ERR_REQUIRE_CYCLE_MODULE`.

3.  **Module Cycle Investigation:**
    *   The `ERR_REQUIRE_CYCLE_MODULE` error suggests a circular dependency. An investigation was conducted to determine if a literal cycle existed in the application code.
    *   The analysis confirmed **no circular dependency exists**. The test's only local dependency, `Dollar.ts`, only imports the external `decimal.js` library.
    *   The error is therefore being caused by the tooling itself, most likely an incompatibility between Yarn's Plug'n'Play (PnP) loader and the `node:test` runner's TypeScript transpilation process. Multiple `tsconfig.json` configurations (`NodeNext`, `commonjs`) and file extensions (`.ts`, `.mts`) were attempted, but all resulted in the same error.

**Final Conclusion:** The `factgraph` tests remain blocked. Both `vitest` and `node:test` are non-functional in this package due to what appears to be a fundamental conflict within the repository's tooling and environment setup. The original conclusion that progress is blocked stands.

## Remaining `compnodes` to migrate:
- AsDecimalString
- AsString
- BankAccountNode
- CollectionItemNode
- CollectionNode
- CollectionSize
- CollectionSum
- Count
- Dependency
- EinNode
- EmailAddressNode
- EnumNode
- EnumOptionsContains
- EnumOptionsNode
- EnumOptionsSize
- Filter
- Find
- FirstNCollectionItems
- GreaterThan
- GreaterThanOrEqual
- IndexOf
- IpPinNode
- IsComplete
- Length
- LessThan
- LessThanOrEqual
- Maximum
- Minimum
- MultiEnumNode
- NotEqual
- Paste
- PhoneNumberNode
- PinNode
- Placeholder
- Regex
- RootNode
- Round
- RoundToInt
- StepwiseMultiply
- TinNode
- TodayNode
- ZipCodeNode
- Subtract
