#!/bin/bash
set -e
yarn install
yarn workspace @direct-file/audit-service test
