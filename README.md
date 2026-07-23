# Catalyst — Alchemy Companion Prototype

Catalyst is a standalone, mobile-first browser companion for **Alchemy Game**.

## Prototype scope

- Ingredient codex with discovery state, rarity, effects, traits, search, and filters
- Combination Lab for two- or three-ingredient compatibility estimates
- Shared-effect detection, conflict flags, estimated rarity, stability, and value
- Recipe notebook with favorites, reload-to-lab, planning, and deletion
- Pinned ingredient list, planned brew checklist, and autosaved research notes
- Local browser storage
- Safe one-way JSON import from an Alchemy Game-style save
- Separate Catalyst JSON backup export

## Save boundary

Catalyst does **not** overwrite, patch, or replace the Alchemy Game save. The import flow only reads a selected JSON file and copies recognized discoveries into Catalyst's own browser storage.

## Run locally

Open `index.html` in a modern browser. No install or build step is required.

For a local server in PowerShell, from this folder:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Prototype import fields

The one-way importer recognizes these optional JSON fields:

- `discoveredIngredients`
- `knownIngredients`
- `ingredients.discovered`
- `knownRecipes`
- `recipes`

Ingredient entries may be strings or objects containing `id`, `slug`, or `name`.

## Current limitation

The ingredient data and scoring model are prototype fixtures. They establish the UX and data contracts without claiming to represent final Alchemy Game balance or save schema.

## Automated GitHub publishing

The prototype includes a PowerShell publisher that initializes Git, validates the source, creates `keepithandy/catalyst`, pushes `main`, and configures repository metadata.

```powershell
.\publish-to-github.ps1
```

The default repository visibility is **private**. To publish publicly and allow the included GitHub Pages workflow to deploy the static app:

```powershell
.\publish-to-github.ps1 -Visibility public
```

To create a tagged `v0.1.0` GitHub release as part of the same run:

```powershell
.\publish-to-github.ps1 -Visibility public -CreateRelease
```

Prerequisites: Git, GitHub CLI, and an authenticated `gh` session (`gh auth login`).

## Continuous validation

`.github/workflows/validate.yml` runs `node tools/smoke.mjs` on pushes to `main`, pull requests, and manual dispatches. Public repositories also receive automated GitHub Pages deployment through `.github/workflows/pages.yml`.
