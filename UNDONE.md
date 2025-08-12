# Migration Undone Tasks

This document outlines the remaining tasks for migrating the `direct-file` project into the new TypeScript monorepo structure.

## High-Level Summary

The original `direct-file` project is a mix of Java, Scala, and TypeScript. The goal is to migrate all of it to a pure TypeScript monorepo under the `packages/` directory. While some progress has been made (e.g., `email-service`, `factgraph`), a significant amount of work remains.

## Detailed Breakdown of Remaining Work

### 1. Backend Migration (Java to TypeScript)

*   **Source:** `direct-file/backend`
*   **Target:** `packages/backend`
*   **Description:** This is the largest and most critical part of the migration. The existing Java backend contains the core business logic. This will involve a complete rewrite of the Java code into TypeScript, including:
    *   API endpoints
    *   Database interactions (migrating from what looks like Spring Data JPA to node:sqlite)
    *   Business logic
    *   Tests

### 2. Fact-Graph Migration (Scala to TypeScript)

*   **Source:** `direct-file/fact-graph-scala`
*   **Target:** `packages/factgraph`
*   **Description:** The Scala implementation of the fact graph needs to be fully migrated to the existing TypeScript `factgraph` package. The current TypeScript implementation may be incomplete.

### 3. Frontend Migration (`df-client`)

*   **Source:** `direct-file/df-client`
*   **Target:** New packages under `packages/` (e.g., `packages/df-client-app`, `packages/df-static-site`)
*   **Description:** The `df-client` directory contains two frontend applications. These are already in TypeScript, so this task is more about moving, re-wiring, and ensuring they work within the new monorepo structure.
    *   `df-client-app`: The main client application.
    *   `df-static-site`: A static site.

### 4. Shared Libraries Migration (Java to TypeScript)

*   **Source:** `direct-file/libs`
*   **Target:** New packages under `packages/`
*   **Description:** The shared Java libraries need to be rewritten in TypeScript and organized into new packages. This includes:
    *   `irs-spring-boot-starter-boilerplate`
    *   `irs-spring-boot-starter-openfeature`
    *   `irs-spring-boot-starter-test`
    *   `irs-spring-boot-starter-validation`

### 5. Utilities Migration

*   **Source:** `direct-file/utils`
*   **Target:** New packages under `packages/` or scripts in the root.
*   **Description:**
    *   `csp-simulator` (Python): Needs to be migrated to TypeScript.
    *   `pdf-to-yaml` (Java): Needs to be migrated to TypeScript.

### 6. Scripts and Build Process

*   **Source:** `direct-file/scripts`
*   **Description:** The shell and python scripts for building and managing the old project need to be replaced with `npm` scripts in the relevant `package.json` files.

### 7. Monitoring and Docker

*   **Source:** `direct-file/monitoring`, `direct-file/docker`
*   **Description:** The monitoring and Docker configurations need to be updated to support the new TypeScript-based architecture. This includes updating `docker-compose.yaml` files and monitoring configurations for Grafana and Prometheus.

### 8. Bill of Materials (BOMs)

*   **Source:** `direct-file/boms`
*   **Description:** This is a Maven concept. It will be replaced by standard `package.json` dependency management in the monorepo. This directory can be removed after all Java projects are migrated.

## Recent Progress and Next Steps (as of 2025-08-12)

This section documents the latest migration progress and outlines the immediate next steps.

### Progress Made

*   **Begun `factgraph` migration:**
    *   Migrated the `Equal` compnode from Scala to TypeScript (`packages/factgraph/src/compnodes/Equal.ts`).
    *   Identified that the `Expression` system in TypeScript was incomplete. Created the base structure for `Expression` subclasses by adding `packages/factgraph/src/expressions/BinaryExpression.ts` and `ReduceExpression.ts`.
    *   Refactored the existing (and incomplete) `Add.ts` and `Subtract.ts` compnodes to use the new `Expression` classes.
*   **Dependency and Environment Debugging:**
    *   Corrected the dependency in `packages/df-client-app/package.json` from the legacy `js-factgraph` to the new `factgraph` workspace package.
    *   Fixed the `vitest` configuration in `packages/factgraph/vitest.config.ts` to use `jsdom` and the correct `mergeConfig` import.

### Blockers and Next Steps

The primary blocker is an issue with the development environment that prevents `yarn` commands from running successfully (they consistently time out). The following steps need to be taken once the environment is fixed:

1.  **Stabilize the Yarn Environment:**
    *   Successfully run `corepack enable`.
    *   Successfully run `yarn set version stable`. This is a critical step that has been failing.
2.  **Install Dependencies:**
    *   Run `yarn install` to ensure all project dependencies are correctly installed using the stable Yarn version.
3.  **Continue `factgraph` Test Debugging:**
    *   Run `yarn workspace factgraph test`.
    *   The next expected error is `Not implemented` from the `get()` methods in `BinaryExpression.ts` and `ReduceExpression.ts`.
4.  **Implement Expression Logic:**
    *   Translate the core evaluation logic from `Expression.scala` into the `get()`, `getThunk()`, and `explain()` methods of the new TypeScript `Expression` subclasses. This is the next major piece of the migration.
5.  **Continue Migration:**
    *   Continue migrating the remaining `compnodes` and other parts of the `fact-graph-scala` project.
