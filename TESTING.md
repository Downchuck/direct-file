# `factgraph` Testing Strategy

This document outlines the strategy for testing the `factgraph` package to ensure its correctness and prevent regressions. This plan should be executed in a stable and reliable environment where standard command-line utilities and the chosen test runner (`vitest` or an alternative) function correctly.

## 1. Environment Verification

Before running any application-specific tests, the environment itself must be verified.

1.  **Verify Core Utilities:** Confirm that basic shell commands like `timeout` work as expected.
    *   **Command:** `timeout 5s sleep 10`
    *   **Expected Outcome:** The command should exit with a non-zero status code after 5 seconds.
2.  **Verify Node/Yarn/Vitest Installation:** Confirm that the test runner can be invoked and can run a minimal, "hello world" test case.
    *   Create a `__tests__/sanity.test.ts` with a single `expect(true).toBe(true)` test.
    *   **Command:** `yarn workspace factgraph test __tests__/sanity.test.ts`
    *   **Expected Outcome:** The test should run and pass almost instantaneously.

## 2. Isolate and Conquer

Given the previous issues with hanging processes, the primary strategy is to run tests in the smallest possible, isolated units.

1.  **Run Tests File-by-File:** Instead of running the entire test suite, run each test file individually.
    *   **Command:** `yarn workspace factgraph test <path_to_test_file>`
    *   **Benefit:** This will immediately identify which specific test *file* is causing a hang or a long run time.

2.  **Run Tests Name-by-Name:** `vitest` allows running specific tests by name using the `-t` or `--testNamePattern` flag.
    *   **Command:** `yarn workspace factgraph test -t "test name pattern"`
    *   **Benefit:** If a single file contains many tests, this allows for even finer-grained isolation to find the exact test case that is problematic.

## 3. Implement Timeouts

Timeouts are a critical safety net.

1.  **Tool-level Timeout:** Wrap the entire test execution in the `timeout` utility. This is the outermost safety net to prevent the entire agent session from hanging.
    *   **Command:** `timeout 300s yarn workspace factgraph test` (with a reasonable timeout like 5 minutes).
2.  **Test Runner Timeout:** Configure a timeout within `vitest.config.ts`. This should be much shorter, intended to catch individual test hangs.
    *   **Configuration:** `test: { testTimeout: 5000 }` (5 seconds).

## 4. Debugging Long-Running Tests

If a specific test is identified as taking too long:

1.  **Add Logging:** Sprinkle `console.log` statements throughout the test and the code it exercises to trace the execution path and find where it gets stuck.
2.  **Simplify the Test Case:** Reduce the test to its absolute minimum. If it's testing a complex calculation, start with the simplest inputs and gradually add complexity until the problem appears.
3.  **Review Dependencies:** Examine the dependencies of the code under test. Are there any network calls, file system access, or other I/O operations that could be blocking? Mock these dependencies.

By following this structured approach, we can systematically isolate the problem and ensure that the `factgraph` test suite is both reliable and efficient.
