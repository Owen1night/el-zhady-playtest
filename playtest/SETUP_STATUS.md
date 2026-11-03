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

## Owner-reported configuration

The owner reports selecting **GitHub Actions** as the Pages source in this test repository. This is recorded as owner-reported, not independently verified administration state. No deployment has run; branch/API checks still show no Actions runs.

## Current owner-only step

Create a **new empty Supabase project** named `el-zhady-playtest` in the owner's existing Free organization via https://supabase.com/dashboard → **New project**. Keep its generated database password private. Choose a nearby region, then **Create new project** and wait for provisioning. If the Free plan has no available project slot, stop and report the quota message rather than upgrading, deleting or pausing production.

Send only the new project's dashboard URL or public project reference after creation. Do not run SQL or change Auth/Cron yet. This session has no configured Supabase connection or project-management credentials; project creation requires the owner's account. The new project must be separate from production, with no production data copied.

Test-project migrations, Auth, Cron, public build variables and deployment remain pending. No SQL has been executed by this setup work. Continue [the guide](README.md) one owner action at a time; production must remain unchanged.
