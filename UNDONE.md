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
