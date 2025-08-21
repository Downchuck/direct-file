# `factgraph` Migration Status

This document tracks the progress of the `factgraph` migration from Scala to TypeScript.

## Migrated `compnodes`
- [x] BankAccountNode
- [x] CollectionItemNode
- [x] CollectionNode
- [x] CollectionSize
- [x] CollectionSum
- [x] Dependency
- [x] EnumOptionsContains
- [x] EnumOptionsNode
- [x] EnumOptionsSize
- [x] Filter
- [x] Find
- [x] FirstNCollectionItems
- [x] IndexOf
- [x] IpPinNode
- [x] IsComplete
- [x] MultiEnumNode
- [x] Paste
- [x] PhoneNumberNode
- [x] PinNode
- [x] Placeholder
- [x] RootNode

## Remaining `compnodes` to migrate:
- Regex
- StepwiseMultiply
- TodayNode
- ZipCodeNode

## Current Status (2025-08-20)

A major architectural overhaul has been completed. The initial attempt to use constant-based factories was found to be incorrect. All `CompNode` factories have now been refactored to be **class-based**, aligning with the design of the `compNodeRegistry`.

A `RootNode` has been implemented and a global test setup file (`test-setup.ts`) has been added to ensure all node types are registered before any tests run.

This has resolved the core architectural problems and fixed a significant number of failing tests. The test suite is now in a much healthier state, although some failures remain.

The following work is remaining:
*   Fix the remaining failing tests. While many tests have been fixed, the suite is not yet 100% passing. The remaining errors appear to be:
    *   `...Factory.fromDerivedConfig is not a function` in several tests due to the tests calling the factory directly instead of using the registry.
    *   `TypeError: graph.getDefinition is not a function` in `CollectionSum.ts`.
    *   `TypeError: Cannot read properties of undefined (reading 'hasValue')` in `Maximum.test.ts`.
*   Continue the migration of the remaining `compnodes`:
    *   Regex
    *   StepwiseMultiply
    *   TodayNode
    *   ZipCodeNode
