This file contains instructions and conventions for AI agents working in this repository.

## Development Workflow

1.  **Understand the Goal:** The primary goal is to migrate the `factgraph` library from Scala to TypeScript.
2.  **Use the Test Suite:** The test suite is the source of truth for the migration's progress. Use `yarn workspace factgraph test` to run the tests and identify what needs to be implemented or fixed.
3.  **Work Iteratively:** Fix one test or a small group of related tests at a time. This makes it easier to debug and track progress.
4.  **Commit Frequently:** After making a meaningful change (e.g., fixing a group of tests, implementing a new feature), commit your work. This creates a snapshot that you can return to if needed. Never use `reset_all`.

### Debugging Registration Errors

If you encounter `TypeError: Class extends value undefined is not a constructor or null` or `TypeError: Cannot read properties of undefined (reading 'register')`, it is likely due to a circular dependency or an incorrect registration process.

To debug this:
1.  Ensure that the `compNodeRegistry` is defined in its own file (`packages/factgraph/src/compnodes/registry.ts`) and that all files import it from there.
2.  Ensure that all `CompNode` factories are registered in a single location (`packages/factgraph/src/compnodes/index.ts`). Individual node files should not register themselves.
3.  Use a test-driven approach to flush out errors. Run a single test that is failing due to a registration error. When you fix one error, the test will fail with the next one in the import chain. This is an effective way to systematically find and fix all the errors.
