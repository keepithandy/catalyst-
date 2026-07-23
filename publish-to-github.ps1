[CmdletBinding()]
param(
    [string]$Owner = "keepithandy",
    [string]$Repository = "catalyst-",
    [ValidateSet("private", "public")]
    [string]$Visibility = "private",
    [switch]$CreateRelease
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Require-Command {
    param([Parameter(Mandatory = $true)][string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found. Install it, reopen PowerShell, and run this script again."
    }
}

Require-Command git
Require-Command gh

Write-Host "Checking GitHub authentication..."
& gh auth status
if ($LASTEXITCODE -ne 0) {
    throw "GitHub CLI is not authenticated. Run 'gh auth login' and then rerun this script."
}

$Login = (& gh api user --jq .login).Trim()
$UserId = (& gh api user --jq .id).Trim()
if (-not $Login -or -not $UserId) {
    throw "Could not resolve the authenticated GitHub account."
}

$FullRepository = "$Owner/$Repository"
Write-Host "Preparing $FullRepository from $PSScriptRoot"

if (-not (Test-Path ".git")) {
    & git init -b main
    if ($LASTEXITCODE -ne 0) { throw "git init failed." }
} else {
    & git branch -M main
    if ($LASTEXITCODE -ne 0) { throw "Could not normalize the local branch to main." }
}

if (-not (& git config --local user.name)) {
    & git config --local user.name $Login
}
if (-not (& git config --local user.email)) {
    & git config --local user.email "$UserId+$Login@users.noreply.github.com"
}

& node tools/smoke.mjs
if ($LASTEXITCODE -ne 0) { throw "Static smoke validation failed. Nothing was published." }

& git add -A
$HasStagedChanges = -not [string]::IsNullOrWhiteSpace((& git diff --cached --name-only | Out-String))
if ($HasStagedChanges) {
    & git commit -m "chore: establish Catalyst v0.1.0 prototype"
    if ($LASTEXITCODE -ne 0) { throw "Initial commit failed." }
} else {
    Write-Host "No uncommitted changes were found."
}

& gh repo view $FullRepository --json nameWithOwner *> $null
$RepositoryExists = $LASTEXITCODE -eq 0

if (-not $RepositoryExists) {
    $VisibilityFlag = "--$Visibility"
    & gh repo create $FullRepository $VisibilityFlag --source . --remote origin --push --description "Mobile-first alchemy companion prototype with a codex, combination lab, recipe notebook, and safe one-way save import."
    if ($LASTEXITCODE -ne 0) { throw "GitHub repository creation or initial push failed." }
} else {
    Write-Host "$FullRepository already exists; pushing the current main branch."
    $Origin = (& git remote get-url origin 2>$null | Out-String).Trim()
    if (-not $Origin) {
        & git remote add origin "https://github.com/$FullRepository.git"
    }
    & git push -u origin main
    if ($LASTEXITCODE -ne 0) { throw "Push to the existing repository failed." }
}

& gh repo edit $FullRepository --description "Mobile-first alchemy companion prototype with a codex, combination lab, recipe notebook, and safe one-way save import." --enable-issues=true
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Repository metadata could not be updated, but the source was published."
}

if ($Visibility -eq "public") {
    Write-Host "Public repository detected. The included Pages workflow will attempt deployment from main."
}

if ($CreateRelease) {
    & git tag --list "v0.1.0" | ForEach-Object { $TagExists = $_ -eq "v0.1.0" }
    if (-not $TagExists) {
        & git tag -a v0.1.0 -m "Catalyst v0.1.0 prototype"
        & git push origin v0.1.0
    }
    & gh release view v0.1.0 --repo $FullRepository *> $null
    if ($LASTEXITCODE -ne 0) {
        & gh release create v0.1.0 --repo $FullRepository --title "Catalyst v0.1.0 Prototype" --notes "Initial mobile-first Catalyst prototype baseline. See ROADMAP.md and SMOKE_REPORT.md for scope and validation."
        if ($LASTEXITCODE -ne 0) { throw "The repository was published, but release creation failed." }
    }
}

Write-Host ""
Write-Host "Catalyst publish complete: https://github.com/$FullRepository"
Write-Host "Validation: node tools/smoke.mjs"
