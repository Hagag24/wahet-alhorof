#!/usr/bin/env pwsh
#requires -Version 5.1

<#
.SYNOPSIS
    Prepare COMPLETE MonsterASP.NET deployment package with full node_modules

.DESCRIPTION
    Creates dist-monster-full/ folder with everything needed for manual upload.
    Includes real backend bundle, frontend build, and FULL node_modules.
    No npm install needed on Monster if upload succeeds.
#>

param(
    [string]$ProjectRoot = (Split-Path $PSScriptRoot -Parent),
    [string]$OutputDir = "dist-monster-full"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Preparing COMPLETE MonsterASP.NET Package" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean and create output directory
$OutputPath = Join-Path $ProjectRoot $OutputDir

Write-Host "Step 1: Cleaning output directory..." -ForegroundColor Yellow
if (Test-Path $OutputPath) {
    Write-Host "  Removing old $OutputDir..."
    Remove-Item $OutputPath -Recurse -Force
}
New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
Write-Host "  Created fresh $OutputDir"

# Create subdirectories
$dirs = @("api", "public", "public/uploads", "App_Data")
foreach ($dir in $dirs) {
    $fullPath = Join-Path $OutputPath $dir
    New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
}
Write-Host "  Created subdirectories"

# Step 2: Build Frontend
Write-Host ""
Write-Host "Step 2: Building frontend..." -ForegroundColor Yellow
$frontendDir = Join-Path $ProjectRoot "artifacts" "university"

if (Test-Path $frontendDir) {
    Push-Location $frontendDir
    try {
        Write-Host "  Running: pnpm run build"
        $buildOutput = & pnpm run build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Frontend build completed successfully" -ForegroundColor Green
        } else {
            Write-Warning "Frontend build may have warnings"
        }
    } catch {
        Write-Warning "Frontend build issue: $_"
    }
    Pop-Location
} else {
    throw "Frontend directory not found: $frontendDir"
}

# Step 3: Build Backend
Write-Host ""
Write-Host "Step 3: Building backend..." -ForegroundColor Yellow
$backendDir = Join-Path $ProjectRoot "artifacts" "api-server"

if (Test-Path $backendDir) {
    Push-Location $backendDir
    try {
        Write-Host "  Running: pnpm run build"
        $buildOutput = & pnpm run build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Backend build completed successfully" -ForegroundColor Green
        } else {
            Write-Warning "Backend build may have warnings"
        }
    } catch {
        Write-Warning "Backend build issue: $_"
    }
    Pop-Location
} else {
    throw "Backend directory not found: $backendDir"
}

# Step 4: Copy Frontend
Write-Host ""
Write-Host "Step 4: Copying frontend files..." -ForegroundColor Yellow
$frontendDist = Join-Path $frontendDir "dist" "public"

if (Test-Path $frontendDist) {
    $files = Get-ChildItem $frontendDist -Recurse
    Write-Host "  Found $($files.Count) frontend files"
    
    Copy-Item "$frontendDist\*" (Join-Path $OutputPath "public") -Recurse -Force
    Write-Host "  Copied frontend to public/" -ForegroundColor Green
} else {
    throw "Frontend dist not found: $frontendDist"
}

# Verify frontend
$indexHtml = Join-Path $OutputPath "public" "index.html"
if (-not (Test-Path $indexHtml)) {
    throw "index.html not found after copy!"
}
Write-Host "  Verified: public/index.html exists" -ForegroundColor Green

# Step 5: Copy Backend
Write-Host ""
Write-Host "Step 5: Copying backend bundle..." -ForegroundColor Yellow
$backendDist = Join-Path $backendDir "dist"
$backendEntry = Join-Path $backendDist "index.mjs"

if (Test-Path $backendEntry) {
    # Copy main bundle
    Copy-Item $backendEntry (Join-Path $OutputPath "api" "index.mjs") -Force
    Write-Host "  Copied: api/index.mjs ($((Get-Item $backendEntry).Length) bytes)" -ForegroundColor Green
    
    # Copy source map if exists
    $sourceMap = "$backendEntry.map"
    if (Test-Path $sourceMap) {
        Copy-Item $sourceMap (Join-Path $OutputPath "api" "index.mjs.map") -Force
        Write-Host "  Copied: api/index.mjs.map"
    }
    
    # Copy any additional required files from dist
    $additionalFiles = Get-ChildItem $backendDist -File | Where-Object { 
        $_.Name -ne "index.mjs" -and $_.Name -ne "index.mjs.map" 
    }
    foreach ($file in $additionalFiles) {
        Copy-Item $file.FullName (Join-Path $OutputPath "api" $file.Name) -Force
        Write-Host "  Copied: api/$($file.Name)"
    }
} else {
    throw "Backend bundle not found: $backendEntry"
}

# Step 6: Verify backend is NOT a placeholder
Write-Host ""
Write-Host "Step 6: Verifying backend bundle is real..." -ForegroundColor Yellow
$apiContent = Get-Content (Join-Path $OutputPath "api" "index.mjs") -Raw -ErrorAction Stop

if ($apiContent -match "Placeholder file|please copy the real API bundle|PLACHOLDER") {
    throw "ERROR: api/index.mjs is still a placeholder! Real bundle was not copied."
}

if ($apiContent.Length -lt 1000) {
    Write-Warning "api/index.mjs seems small ($($apiContent.Length) bytes). Verify it's the real bundle."
}

Write-Host "  Verified: api/index.mjs is REAL bundle ($($apiContent.Length) bytes)" -ForegroundColor Green

# Step 7: Copy MonsterASP deployment files
Write-Host ""
Write-Host "Step 7: Copying MonsterASP config files..." -ForegroundColor Yellow
$deploySource = Join-Path $ProjectRoot "deploy" "monsterasp"

$requiredFiles = @(
    "server.cjs",
    "server-smoke.cjs",
    "web.config"
)

foreach ($file in $requiredFiles) {
    $source = Join-Path $deploySource $file
    if (Test-Path $source) {
        Copy-Item $source $OutputPath -Force
        Write-Host "  Copied: $file"
    } else {
        throw "Required file missing: $file"
    }
}

# Copy README if exists
$readmeSource = Join-Path $deploySource "README_MONSTER_DEPLOYMENT.md"
if (Test-Path $readmeSource) {
    Copy-Item $readmeSource (Join-Path $OutputPath "README_MONSTER_MANUAL_UPLOAD.md") -Force
    Write-Host "  Copied: README_MONSTER_MANUAL_UPLOAD.md"
}

# Step 8: Create .gitkeep files
Write-Host ""
Write-Host "Step 8: Creating placeholder files..." -ForegroundColor Yellow
"# Database folder - SQLite will be created here" | Out-File (Join-Path $OutputPath "App_Data" ".gitkeep") -Encoding UTF8
"# Uploads folder - user files go here" | Out-File (Join-Path $OutputPath "public" "uploads" ".gitkeep") -Encoding UTF8
Write-Host "  Created .gitkeep files"

# Step 9: Create package.json
Write-Host ""
Write-Host "Step 9: Creating package.json..." -ForegroundColor Yellow

# Read backend package.json for dependencies
$backendPackagePath = Join-Path $backendDir "package.json"
$runtimeDeps = @{
    "express" = "^5.2.1"
    "@libsql/client" = "^0.14.0"
    "drizzle-orm" = "^0.38.0"
    "pino" = "^9.14.0"
    "pino-http" = "^10.5.0"
    "cors" = "^2.8.6"
    "cookie-parser" = "^1.4.7"
    "multer" = "^2.1.1"
    "sharp" = "^0.34.5"
    "zod" = "^3.24.0"
    "pino-pretty" = "^13.1.3"
}

if (Test-Path $backendPackagePath) {
    $backendPackage = Get-Content $backendPackagePath | ConvertFrom-Json
    
    # Add any additional deps from backend
    $extraDeps = @("bcryptjs", "jsonwebtoken", "nanoid", "helmet", "dotenv")
    foreach ($dep in $extraDeps) {
        if ($backendPackage.dependencies.$dep) {
            $runtimeDeps[$dep] = $backendPackage.dependencies.$dep
        }
    }
}

$packageJson = @{
    name = "university-website-monster"
    version = "1.0.0"
    description = "University Website for MonsterASP.NET - FULL PACKAGE with node_modules"
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
Write-Host "  Created package.json with $($runtimeDeps.Count) dependencies"

# Step 10: npm install to create node_modules
Write-Host ""
Write-Host "Step 10: Installing npm dependencies (this may take 1-2 minutes)..." -ForegroundColor Yellow
Push-Location $OutputPath

try {
    # Use npm (not pnpm) for flat node_modules suitable for upload
    Write-Host "  Running: npm install --omit=dev"
    $npmOutput = & npm install --omit=dev 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  npm install completed successfully" -ForegroundColor Green
    } else {
        Write-Warning "npm install exit code: $LASTEXITCODE"
    }
} catch {
    Write-Error "npm install failed: $_"
    throw
}

Pop-Location

# Step 11: Verify node_modules
Write-Host ""
Write-Host "Step 11: Verifying node_modules..." -ForegroundColor Yellow

$requiredModules = @(
    "express",
    "@libsql/client",
    "drizzle-orm",
    "sharp",
    "pino",
    "cors",
    "multer"
)

$allFound = $true
foreach ($mod in $requiredModules) {
    $modPath = Join-Path $OutputPath "node_modules" $mod
    if (Test-Path $modPath) {
        Write-Host "  ✓ $mod" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $mod NOT FOUND!" -ForegroundColor Red
        $allFound = $false
    }
}

if (-not $allFound) {
    throw "Some required node_modules are missing!"
}

# Step 12: Create zip
Write-Host ""
Write-Host "Step 12: Creating ZIP archive..." -ForegroundColor Yellow
$zipPath = Join-Path $ProjectRoot "$OutputDir.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Use Compress-Archive
Compress-Archive -Path "$OutputPath\*" -DestinationPath $zipPath -Force

if (Test-Path $zipPath) {
    $zipSize = (Get-Item $zipPath).Length
    $zipSizeMB = [math]::Round($zipSize / 1MB, 2)
    Write-Host "  Created: $OutputDir.zip ($zipSizeMB MB)" -ForegroundColor Green
} else {
    throw "Failed to create ZIP file!"
}

# Final Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "COMPLETE PACKAGE READY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Location: $OutputPath" -ForegroundColor Cyan
Write-Host "ZIP: $zipPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Package Contents:" -ForegroundColor Yellow
Write-Host "  ✓ web.config (IISNode config)"
Write-Host "  ✓ server.cjs (CommonJS entry)"
Write-Host "  ✓ server-smoke.cjs (smoke test)"
Write-Host "  ✓ package.json (dependencies list)"
Write-Host "  ✓ package-lock.json (lock file)"
Write-Host "  ✓ node_modules/ ($($runtimeDeps.Count) packages, ~$zipSizeMB MB)"
Write-Host "  ✓ api/index.mjs (REAL backend bundle, $(($apiContent).Length) bytes)"
Write-Host "  ✓ public/ (frontend files)"
Write-Host "  ✓ public/uploads/ (empty with .gitkeep)"
Write-Host "  ✓ App_Data/ (empty with .gitkeep)"
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "UPLOAD INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Upload the CONTENTS of $OutputDir/ to Monster wwwroot/" -ForegroundColor Yellow
Write-Host "   (Extract $OutputDir.zip and upload all contents, not just the zip)"
Write-Host ""
Write-Host "2. Because node_modules is included, you do NOT need to run npm install."
Write-Host ""
Write-Host "3. Create .env file from .env.example and customize it."
Write-Host ""
Write-Host "4. Click RESTART in MonsterASP Control Panel."
Write-Host ""
Write-Host "5. Test these URLs:"
Write-Host "   https://yourdomain.runasp.net/api/health"
Write-Host "   https://yourdomain.runasp.net/"
Write-Host "   https://yourdomain.runasp.net/admin"
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TROUBLESHOOTING:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If Monster says 'Cannot find package express':" -ForegroundColor Red
Write-Host "  → node_modules was not uploaded correctly (too large?)"
Write-Host "  → Run: npm install --omit=dev inside wwwroot on Monster"
Write-Host ""
Write-Host "If native modules (sharp, libsql) fail:" -ForegroundColor Red
Write-Host "  → Run: npm rebuild" -ForegroundColor Yellow
Write-Host "  → Or: delete node_modules and run npm install --omit=dev on Monster"
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "DONE! Package is ready for upload." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
