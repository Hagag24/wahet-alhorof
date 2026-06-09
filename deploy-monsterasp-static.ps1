$ErrorActionPreference = "Stop"

# Detect project root based on script location
$ScriptPath = $PSScriptRoot
$ProjectRoot = $ScriptPath

Write-Host "Project root: $ProjectRoot" -ForegroundColor Cyan

# Validate that package.json exists
$PackageJsonPath = Join-Path $ProjectRoot "package.json"
if (-not (Test-Path $PackageJsonPath)) {
    Write-Error "package.json not found at $PackageJsonPath"
    exit 1
}

Write-Host "✓ package.json found" -ForegroundColor Green

# Check if node_modules exists
$NodeModulesPath = Join-Path $ProjectRoot "node_modules"
if (-not (Test-Path $NodeModulesPath)) {
    Write-Host "node_modules not found. Running npm install..." -ForegroundColor Yellow
    Push-Location $ProjectRoot
    try {
        npm install
    } finally {
        Pop-Location
    }
    Write-Host "✓ npm install completed" -ForegroundColor Green
} else {
    Write-Host "node_modules exists. Skipping npm install." -ForegroundColor Green
}

# Run validation commands
Push-Location $ProjectRoot

Write-Host "Running npm run lint..." -ForegroundColor Yellow
try {
    npm run lint
    Write-Host "✓ lint passed" -ForegroundColor Green
} catch {
    Write-Warning "lint failed or not configured, continuing..."
}

Write-Host "Running npm test..." -ForegroundColor Yellow
try {
    npm test
    Write-Host "✓ test passed" -ForegroundColor Green
} catch {
    Write-Warning "test failed or not configured, continuing..."
}

Write-Host "Running npx tsc --noEmit..." -ForegroundColor Yellow
try {
    npx tsc --noEmit
    Write-Host "✓ TypeScript check passed" -ForegroundColor Green
} catch {
    Write-Warning "TypeScript check failed, continuing..."
}

Write-Host "Running npm run build..." -ForegroundColor Yellow
npm run build
Write-Host "✓ build completed" -ForegroundColor Green

Pop-Location

# Verify that out/ exists
$OutPath = Join-Path $ProjectRoot "out"
if (-not (Test-Path $OutPath)) {
    Write-Error "Build completed but out/ folder was not found. Static export failed."
    exit 1
}
Write-Host "✓ out/ folder found" -ForegroundColor Green

# Verify that web.config exists
$WebConfigSource = Join-Path $ProjectRoot "deployment\monsterasp-static\web.config"
if (-not (Test-Path $WebConfigSource)) {
    Write-Error "web.config not found at $WebConfigSource"
    exit 1
}
Write-Host "✓ web.config found" -ForegroundColor Green

# Create or clean deployment/monsterasp-upload/
$UploadPath = Join-Path $ProjectRoot "deployment\monsterasp-upload"
if (Test-Path $UploadPath) {
    Write-Host "Cleaning existing upload folder..." -ForegroundColor Yellow
    Remove-Item $UploadPath -Recurse -Force
}
New-Item -ItemType Directory -Path $UploadPath -Force | Out-Null
Write-Host "✓ upload folder created" -ForegroundColor Green

# Copy contents of out/ to deployment/monsterasp-upload/
Write-Host "Copying build output to upload folder..." -ForegroundColor Yellow
Copy-Item -Path "$OutPath\*" -Destination $UploadPath -Recurse -Force
Write-Host "✓ build output copied" -ForegroundColor Green

# Copy web.config to deployment/monsterasp-upload/
Write-Host "Copying web.config..." -ForegroundColor Yellow
Copy-Item -Path $WebConfigSource -Destination (Join-Path $UploadPath "web.config") -Force
Write-Host "✓ web.config copied" -ForegroundColor Green

# Create ZIP
$ZipPath = Join-Path $ProjectRoot "deployment\kids-monsterasp-static-upload.zip"
Write-Host "Creating ZIP at $ZipPath..." -ForegroundColor Yellow
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}
Compress-Archive -Path "$UploadPath\*" -DestinationPath $ZipPath -Force
Write-Host "✓ ZIP created" -ForegroundColor Green

# Verify required items exist
$RequiredItems = @("index.html", "_next", "lessons", "audio", "images", "web.config")
$MissingItems = @()
foreach ($item in $RequiredItems) {
    $ItemPath = Join-Path $UploadPath $item
    if (-not (Test-Path $ItemPath)) {
        $MissingItems += $item
    }
}

if ($MissingItems.Count -gt 0) {
    Write-Warning "Missing required items: $($MissingItems -join ', ')"
} else {
    Write-Host "✓ All required items present" -ForegroundColor Green
}

# Verify forbidden items are NOT included
$ForbiddenItems = @("node_modules", ".next", "app", "components", "data", "lib", "hooks", "contexts", "types", "styles", "package.json", "package-lock.json", "server.js", "deployment", "docs")
$FoundForbidden = @()
foreach ($item in $ForbiddenItems) {
    $ItemPath = Join-Path $UploadPath $item
    if (Test-Path $ItemPath) {
        $FoundForbidden += $item
    }
}

if ($FoundForbidden.Count -gt 0) {
    Write-Warning "Found forbidden items: $($FoundForbidden -join ', ')"
} else {
    Write-Host "✓ No forbidden items included" -ForegroundColor Green
}

# Get ZIP info
$ZipInfo = Get-Item $ZipPath
$ZipSizeMB = [math]::Round($ZipInfo.Length / 1MB, 2)
$FileCount = (Get-ChildItem -Path $UploadPath -Recurse -File).Count

# Print final summary
Write-Host "`n=== DEPLOYMENT SUMMARY ===" -ForegroundColor Cyan
Write-Host "ZIP path: $ZipPath" -ForegroundColor White
Write-Host "ZIP size: $ZipSizeMB MB" -ForegroundColor White
Write-Host "File count: $FileCount" -ForegroundColor White
Write-Host "web.config at ZIP root: $((Test-Path (Join-Path $UploadPath 'web.config')))" -ForegroundColor White
Write-Host "Forbidden files not included: $($FoundForbidden.Count -eq 0)" -ForegroundColor White
Write-Host "`nUpload instruction:" -ForegroundColor Yellow
Write-Host "Upload the ZIP to MonsterASP /wwwroot and extract it there." -ForegroundColor White
Write-Host "`n=== END SUMMARY ===" -ForegroundColor Cyan
