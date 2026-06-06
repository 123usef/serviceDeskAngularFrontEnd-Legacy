# ServiceDesk Legacy — Environment Setup

## Required Node Version

This project requires **Node 18** (LTS). The `.nvmrc` file and `package.json` `engines`
field both enforce this.

Angular 15 does **not** support Node 20+. Running on Node 24 (or any version outside 18.x)
will produce an "Unsupported" warning and may cause build failures or runtime errors.

## Switching to Node 18

This project uses [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage
Node versions. After cloning the repo, run:

```powershell
nvm use 18
```

If Node 18 is not yet installed:

```powershell
nvm install 18
nvm use 18
```

Verify with:

```powershell
node -v
# Expected: v18.20.8 (or any 18.x)
```

> **Note:** `nvm use` requires an **elevated (admin) PowerShell** on Windows to update the
> global symlink. If you see a permissions error, right-click PowerShell and select
> "Run as administrator", then re-run `nvm use 18`.

## After Switching Node

```powershell
npm install
ng serve
```

The app will be available at `http://localhost:4200`.
