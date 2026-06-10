#!/usr/bin/env pwsh
#requires -Version 5.1

<#
.SYNOPSIS
    Prepare MonsterASP.NET deployment package for EUST.uk

.DESCRIPTION
    Creates dist-monster/ folder with all files needed for MonsterASP.NET deployment.
    This script builds frontend and backend, then copies required files.
#>

param(
    [string]$ProjectRoot = (Split-Path $PSScriptRoot -Parent),
    [string]$OutputDir = "dist-monster"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Preparing MonsterASP.NET Deployment Package" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Clean and create output directory
$OutputPath = Join-Path $ProjectRoot $OutputDir

Write-Host "Step 1: Cleaning output directory..." -ForegroundColor Yellow
if (Test-Path $OutputPath) {
    Remove-Item $OutputPath -Recurse -Force
    Write-Host "  Deleted old $OutputDir"
}

# Create directory structure
Write-Host "Step 2: Creating directory structure..." -ForegroundColor Yellow
$dirs = @(
    "api",
    "public",
    "public/uploads",
    "App_Data"
)
foreach ($dir in $dirs) {
    $fullPath = Join-Path $OutputPath $dir
    New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    Write-Host "  Created: $dir"
}

# Build Frontend
Write-Host ""
Write-Host "Step 3: Building frontend..." -ForegroundColor Yellow
$frontendDir = Join-Path $ProjectRoot "artifacts" "university"
if (Test-Path $frontendDir) {
    Set-Location $frontendDir
    try {
        # Try pnpm first, then npm
        if (Get-Command pnpm -ErrorAction SilentlyContinue) {
            pnpm run build 2>&1 | ForEach-Object { "  $_" }
        } else {
            npm run build 2>&1 | ForEach-Object { "  $_" }
        }
        Write-Host "  Frontend build completed"
    } catch {
        Write-Warning "Frontend build may have warnings, continuing..."
    }
    Set-Location $ProjectRoot
} else {
    Write-Warning "Frontend directory not found at $frontendDir"
}

# Copy frontend build
$frontendDist = Join-Path $frontendDir "dist" "public"
if (Test-Path $frontendDist) {
    Write-Host "Step 4: Copying frontend files..." -ForegroundColor Yellow
    Copy-Item "$frontendDist\*" (Join-Path $OutputPath "public") -Recurse -Force
    Write-Host "  Copied frontend files to public/"
} else {
    Write-Warning "Frontend dist not found at $frontendDist"
}

# Build Backend
Write-Host ""
Write-Host "Step 5: Building backend..." -ForegroundColor Yellow
$backendDir = Join-Path $ProjectRoot "artifacts" "api-server"
if (Test-Path $backendDir) {
    Set-Location $backendDir
    try {
        if (Get-Command pnpm -ErrorAction SilentlyContinue) {
            pnpm run build 2>&1 | ForEach-Object { "  $_" }
        } else {
            npm run build 2>&1 | ForEach-Object { "  $_" }
        }
        Write-Host "  Backend build completed"
    } catch {
        Write-Warning "Backend build may have warnings, continuing..."
    }
    Set-Location $ProjectRoot
} else {
    Write-Warning "Backend directory not found at $backendDir"
}

# Copy backend bundle
$backendDist = Join-Path $backendDir "dist" "index.mjs"
if (Test-Path $backendDist) {
    Write-Host "Step 6: Copying backend bundle..." -ForegroundColor Yellow
    Copy-Item $backendDist (Join-Path $OutputPath "api" "index.mjs") -Force
    Write-Host "  Copied: api/index.mjs"
    
    # Copy source map if exists
    $sourceMap = Join-Path $backendDir "dist" "index.mjs.map"
    if (Test-Path $sourceMap) {
        Copy-Item $sourceMap (Join-Path $OutputPath "api" "index.mjs.map") -Force
        Write-Host "  Copied: api/index.mjs.map"
    }
} else {
    Write-Warning "Backend bundle not found at $backendDist"
}

# Copy MonsterASP deployment files
Write-Host ""
Write-Host "Step 7: Copying MonsterASP files..." -ForegroundColor Yellow
$deploySource = Join-Path $ProjectRoot "deploy" "monsterasp"

$filesToCopy = @(
    "server.cjs",
    "server-smoke.cjs",
    "web.config",
    ".env.monster.example",
    "README_MONSTER_DEPLOYMENT.md"
)

foreach ($file in $filesToCopy) {
    $source = Join-Path $deploySource $file
    if (Test-Path $source) {
        Copy-Item $source $OutputPath -Force
        Write-Host "  Copied: $file"
    } else {
        Write-Warning "  Missing: $file"
    }
}

# Create .gitkeep files
Write-Host ""
Write-Host "Step 8: Creating .gitkeep files..." -ForegroundColor Yellow
"# Database folder placeholder" | Out-File (Join-Path $OutputPath "App_Data" ".gitkeep") -Encoding UTF8
"# Uploads folder placeholder" | Out-File (Join-Path $OutputPath "public" "uploads" ".gitkeep") -Encoding UTF8
Write-Host "  Created .gitkeep files"

# Create package.json for production
Write-Host ""
Write-Host "Step 9: Creating package.json..." -ForegroundColor Yellow

# Read backend package.json to get dependencies
$backendPackagePath = Join-Path $backendDir "package.json"
$runtimeDeps = @{}

if (Test-Path $backendPackagePath) {
    $backendPackage = Get-Content $backendPackagePath | ConvertFrom-Json
    $depsToInclude = @(
        "express",
        "@libsql/client",
        "drizzle-orm",
        "better-sqlite3",
        "pino",
        "pino-http",
        "pino-pretty",
        "cors",
        "cookie-parser",
        "multer",
        "sharp",
        "zod",
        "bcryptjs",
        "jsonwebtoken",
        "helmet"
    )
    
    foreach ($dep in $depsToInclude) {
        if ($backendPackage.dependencies.$dep) {
            $runtimeDeps[$dep] = $backendPackage.dependencies.$dep
        }
    }
}

# Add express if not found
if (-not $runtimeDeps["express"]) {
    $runtimeDeps["express"] = "^4.21.2"
}

$packageJson = @{
    name = "university-website-monster"
    version = "1.0.0"
    description = "University Website for MonsterASP.NET"
    main = "server.cjs"
    scripts = @{
        start = "node server.cjs"
    }
    dependencies = $runtimeDeps
    engines = @{
        node = ">=18.0.0"
    }
} | ConvertTo-Json -Depth 10

$packageJson | Out-File (Join-Path $OutputPath "package.json") -Encoding UTF8
Write-Host "  Created: package.json"

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Monster deployment package created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Location: $OutputPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Upload the CONTENTS of $OutputDir/ to MonsterASP wwwroot/"
Write-Host "2. In MonsterASP Control Panel, run: npm install --omit=dev"
Write-Host "3. Create .env file from .env.monster.example"
Write-Host "4. Click Restart"
Write-Host "5. Test: https://yourdomain.runasp.net/api/health"
Write-Host ""
Write-Host "Files in package:" -ForegroundColor Yellow
Get-ChildItem $OutputPath -Recurse | Where-Object { -not $_.PSIsContainer } | ForEach-Object {
    $size = if ($_.Length -lt 1KB) { "$($_.Length) B" } elseif ($_.Length -lt 1MB) { "{0:N1} KB" -f ($_.Length / 1KB) } else { "{0:N1} MB" -f ($_.Length / 1MB) }
    Write-Host "  $($_.FullName.Replace($OutputPath, '.')) ($size)"
}

Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green
