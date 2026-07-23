# Catalyst Roadmap

Catalyst is a standalone, mobile-first companion for Alchemy Game. Development must preserve the separation between Catalyst data and the game save.

## v0.1.0 — Prototype baseline

- [x] Ingredient codex and discovery filters
- [x] Two- and three-ingredient Combination Lab
- [x] Recipe notebook, favorites, and brew planner
- [x] Local browser persistence
- [x] One-way JSON import
- [x] Catalyst-only JSON backup export
- [x] Mobile-first responsive shell
- [x] Static smoke validation and GitHub Actions workflow

## v0.2.0 — Data-contract hardening

- [ ] Extract ingredient fixtures into a versioned data file
- [ ] Add explicit import schema versions and migration warnings
- [ ] Add import preview before applying discoveries
- [ ] Add duplicate-recipe reconciliation
- [ ] Add accessible keyboard and screen-reader states
- [ ] Expand browser-level smoke coverage

## v0.3.0 — Alchemy Game companion integration

- [ ] Define a documented, read-only export contract from Alchemy Game
- [ ] Map live ingredient IDs without copying gameplay logic
- [ ] Surface unsupported or unknown imported records safely
- [ ] Add compatibility reports with transparent scoring inputs
- [ ] Keep all write-back to the Alchemy Game save disabled

## Guardrails

1. Catalyst never overwrites, patches, or replaces an Alchemy Game save.
2. Imported data is copied into Catalyst-owned storage only after validation.
3. Prototype scores are estimates and must not be represented as final game balance.
4. Mobile usability remains a release requirement.
5. Changes require a green static smoke run before merge.
