# Create MonsterASP.NET full deployment package with node_modules
param([string]$ProjectRoot = (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent))

$ErrorActionPreference = "Stop"
$OutputDir = "dist-monster-full"
$OutputPath = Join-Path $ProjectRoot $OutputDir

Write-Host "========================================"
Write-Host "Creating MonsterASP.NET Full Package"
Write-Host "========================================"

# Step 1: Clean output directory
Write-Host "`nStep 1: Cleaning output directory..."
if (Test-Path $OutputPath) {
    Remove-Item $OutputPath -Recurse -Force
}
New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $OutputPath "api") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $OutputPath "public") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $OutputPath "public\uploads") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $OutputPath "App_Data") -Force | Out-Null
Write-Host "Created directory structure"

# Step 2: Build frontend
Write-Host "`nStep 2: Building frontend..."
$frontendDir = Join-Path $ProjectRoot "artifacts\university"
Push-Location $frontendDir
& pnpm run build 2>&1 | ForEach-Object { "  $_" }
Pop-Location
Write-Host "Frontend build completed"

# Step 3: Build backend
Write-Host "`nStep 3: Building backend..."
$backendDir = Join-Path $ProjectRoot "artifacts\api-server"
Push-Location $backendDir
& pnpm run build 2>&1 | ForEach-Object { "  $_" }
Pop-Location
Write-Host "Backend build completed"

# Step 4: Copy frontend
Write-Host "`nStep 4: Copying frontend..."
$frontendDist = Join-Path $frontendDir "dist\public"
Copy-Item "$frontendDist\*" (Join-Path $OutputPath "public") -Recurse -Force
Write-Host "Copied frontend files to public/"

# Step 5: Copy backend
Write-Host "`nStep 5: Copying backend..."
$backendEntry = Join-Path $backendDir "dist\index.mjs"
if (-not (Test-Path $backendEntry)) {
    throw "Backend bundle not found: $backendEntry"
}

$apiContent = Get-Content $backendEntry -Raw
if ($apiContent -match "Placeholder file|please copy the real API bundle") {
    throw "Backend is a placeholder! Real build required."
}

Copy-Item $backendEntry (Join-Path $OutputPath "api\index.mjs") -Force
$apiSize = (Get-Item (Join-Path $OutputPath "api\index.mjs")).Length
Write-Host "Copied api/index.mjs ($apiSize bytes)"

# Step 6: Copy deployment files
Write-Host "`nStep 6: Copying deployment files..."
$deploySource = Join-Path $ProjectRoot "deploy\monsterasp"
Copy-Item (Join-Path $deploySource "server.cjs") $OutputPath -Force
Copy-Item (Join-Path $deploySource "server-smoke.cjs") $OutputPath -Force
Copy-Item (Join-Path $deploySource "web.config") $OutputPath -Force
Write-Host "Copied server.cjs, server-smoke.cjs, web.config"

# Step 7: Create .gitkeep files
"# Database folder" | Out-File (Join-Path $OutputPath "App_Data\.gitkeep") -Encoding UTF8
"# Uploads folder" | Out-File (Join-Path $OutputPath "public\uploads\.gitkeep") -Encoding UTF8

# Step 8: Create package.json
Write-Host "`nStep 7: Creating package.json..."
$packageJson = @{
    name = "university-website-monster"
    version = "1.0.0"
    main = "server.cjs"
    scripts = @{ start = "node server.cjs" }
    dependencies = @{
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
    engines = @{ node = ">=18.0.0" }
} | ConvertTo-Json -Depth 10

$packageJson | Out-File (Join-Path $OutputPath "package.json") -Encoding UTF8
Write-Host "Created package.json with 11 dependencies"

# Step 9: npm install
Write-Host "`nStep 8: Running npm install (takes 2-3 minutes)..."
Push-Location $OutputPath
& npm install --omit=dev 2>&1 | ForEach-Object { "  $_" }
Pop-Location
Write-Host "npm install completed"

# Step 10: Verify
Write-Host "`nStep 9: Verifying..."
$checks = @(
    @("api\index.mjs", "Backend bundle"),
    @("public\index.html", "Frontend HTML"),
    @("node_modules\express", "Express module"),
    @("node_modules\@libsql\client", "LibSQL client"),
    @("node_modules\sharp", "Sharp module"),
    @("web.config", "IIS config"),
    @("server.cjs", "Server entry")
)

$allOk = $true
foreach ($check in $checks) {
    $path = Join-Path $OutputPath $check[0]
    if (Test-Path $path) {
        Write-Host "  OK: $($check[1])"
    } else {
        Write-Host "  FAIL: $($check[1])" -ForegroundColor Red
        $allOk = $false
    }
}

if (-not $allOk) { throw "Verification failed!" }

# Step 11: Create ZIP
Write-Host "`nStep 10: Creating ZIP..."
$zipPath = Join-Path $ProjectRoot "$OutputDir.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$OutputPath\*" -DestinationPath $zipPath -Force
$zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host "Created: $OutputDir.zip ($zipSize MB)"

# Final output
Write-Host "`n========================================"
Write-Host "PACKAGE READY!"
Write-Host "========================================"
Write-Host "Folder: $OutputPath"
Write-Host "ZIP: $zipPath"
Write-Host "Size: $zipSize MB"
Write-Host "`nUPLOAD INSTRUCTIONS:"
Write-Host "1. Extract $OutputDir.zip"
Write-Host "2. Upload ALL contents to Monster wwwroot/"
Write-Host "3. No npm install needed - node_modules included"
Write-Host "4. Create .env file from .env.example"
Write-Host "5. Click Restart"
Write-Host "6. Test: /api/health, /, /admin"
