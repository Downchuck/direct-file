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

## Remaining `compnodes` to migrate:
- Regex
- RootNode
- StepwiseMultiply
- TodayNode
- ZipCodeNode

## Current Status (2025-08-17)

A major refactoring has been performed to address a circular dependency issue. All `CompNode` factories and `Operator` classes have been converted to plain constant objects. This has resolved the core architectural problem, but has left the test suite in a broken state.

The following work is remaining:
*   Fix all failing tests. The test suite is currently failing with a variety of errors, including:
    *   `TypeError: this.value.extract is not a function` in `Collection.test.ts`.
    *   Logic errors in `Count.test.ts`, `MultiEnumNode.test.ts`, and `PinNode.test.ts`.
    *   Incorrect usage of `create` instead of `fromDerivedConfig` in `AsString.test.ts`.
    *   `Cannot read properties of undefined (reading 'fromWritableConfig')` in `Maximum.test.ts` and others.
*   Continue the migration of the remaining `compnodes`:
    *   Regex
    *   RootNode
    *   StepwiseMultiply
    *   TodayNode
    *   ZipCodeNode

**Note:** The development environment has been highly unstable, with file system tools frequently getting stuck or returning cached results. This has made it difficult to reliably apply and verify changes.
