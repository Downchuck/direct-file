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

### Debugging Tips

If you are stuck, here are some strategies that have been helpful in the past:

*   **Check for unimplemented files:** Some `CompNode` files are empty and only export an empty object. If `compnodes/index.ts` tries to import and register a factory from one of these files, it will get `undefined` and throw a `TypeError`. Comment out the registration of any unimplemented factories.
*   **Check the factory pattern:** The codebase uses a mix of class-based and constant-based factories. If you get a `TypeError: ... is not a constructor`, it means you are trying to use `new` on a constant-based factory. If you get a `TypeError: Cannot read properties of undefined (reading 'typeName')`, it could be because you are *not* using `new` on a class-based factory. Check the factory's definition and use the correct instantiation method in `compnodes/index.ts`.
*   **Use console logs and traces:** When debugging complex interactions, add `console.log` statements to inspect the values of variables at different points in the execution. Use `console.trace()` to see the full stack trace of a function call, which can help you understand the call order.
*   **Break circular dependencies:** The codebase has a number of circular dependencies. The most common one is when a `CompNode` file (or one of its dependencies) imports a high-level class like `Factual` or `Expression`, which then imports `Fact`, which then imports `CompNode`. To break these cycles, you can use a type alias (`any`) to remove the direct import, or refactor the code to use lazy loading.
