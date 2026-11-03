# Isolated playtest — repository prepared, not deployed

Application source: PR #6 `465574fcc86f44b9d166c998c28a2e0d00a73b25`.
Setup kit: `f558c664fc6149be2cdd3d62ecd62c5577205d2a`.
Prepared bootstrap copied to this repository: `78909c2863a997637d6e6484f69a9bdea17c62c3`.

## Verified progress

- Owner created the empty public `Owen1night/el-zhady-playtest` repository and granted the GitHub integration access.
- Assistant pushed the prepared bootstrap to this test repository's `main` without altering the source repository's main or either draft PR.
- `.github/workflows/pages.yml` matches the reviewed isolated template: manual dispatch only; both deployment jobs refuse `Owen1night/el-zhady`.
- The copied commit was verified through GitHub's branch API. No Actions runs or deployments were created by that push.
- The existing kit's repository/backend guards, storage namespaces and transformed fixture build previously passed CI. They do not establish hosted Auth, database, scheduler or device acceptance.

## Current owner-only step

Open https://github.com/Owen1night/el-zhady-playtest/settings/pages . Under **Build and deployment → Source**, choose **GitHub Actions**. If GitHub offers a starter workflow, do not create it; the isolated workflow is already present. No workflow should be run yet.

The configured CLI could not read/manage Pages settings (`Forbidden`), and the connected GitHub tools do not expose Pages administration. The owner must set this value and report it; it has not been independently verified.

A fresh isolated Supabase project, Auth, test-only migrations/Cron, test build variables and deployment are still pending. No SQL has been executed by this setup work. Continue [the guide](README.md) one owner action at a time; production must remain unchanged.
