# Migration Undone Tasks - `factgraph` testing blockers

This document outlines the current blockers and next steps for the `factgraph` migration, specifically regarding the failing test suite.

## Summary of Blocker

The test environment for the `factgraph` package is currently broken, preventing any progress on verifying the migrated compnodes. The root cause appears to be a fundamental issue with the test runner and the project's configuration.

### Debugging Steps Taken

The following steps have been taken in an attempt to diagnose and fix the issue, without success:

1.  **`vitest` Failures:**
    *   The initial test runner, `vitest`, was hanging and timing out. This was resolved by fixing `yarn` version issues and adding the `jsdom` dependency.
    *   However, `vitest` then failed to discover any tests, even when provided with a direct path to a test file.

2.  **`node:test` Failures:**
    *   An attempt to migrate to the native `node:test` runner also failed, consistently producing an `ERR_REQUIRE_CYCLE_MODULE` error, even though no circular dependencies were found in the application code. This suggests an incompatibility with Yarn's Plug'n'Play (PnP) loader.

3.  **`jest` Failures:**
    *   A further attempt was made to migrate to `jest`. This also failed, with Jest being unable to find any of the modules installed at the root of the project, including the transformers (`@swc/jest`, `ts-jest`) and presets. This occurred even when providing absolute paths to the modules in the configuration.

**Conclusion:** Progress is blocked until the test environment is fixed. The `factgraph` migration cannot be fully verified.

---

## Migrated `compnodes` (Testing Blocked)
The following "SIMPLE" compnodes have been migrated from Scala to TypeScript, but their tests cannot be run due to the broken test environment.

- `EinNode`
- `EmailAddressNode`
- `TinNode`
- `EnumNode`
- `AsString`

## Blocked `compnodes`
- `Maximum`: Blocked by unimplemented `CollectionNode`.
- `Minimum`: Blocked by unimplemented `CollectionNode`.
- `Count`: The operator is tested, but full integration requires `CollectionNode`.

## Remaining `compnodes` to migrate:
- BankAccountNode
- CollectionItemNode
- CollectionNode
- CollectionSize
- CollectionSum
- Dependency
- EnumOptionsContains
- EnumOptionsNode
- EnumOptionsSize
- Filter
- Find
- FirstNCollectionItems
- IndexOf
- IpPinNode
- IsComplete
- MultiEnumNode
- Paste
- PhoneNumberNode
- PinNode
- Placeholder
- Regex
- RootNode
- StepwiseMultiply
- TodayNode
- ZipCodeNode
