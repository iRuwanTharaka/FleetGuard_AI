# FleetGuard API Test Script - PowerShell (Windows)
$Base = "http://localhost:3001/api"

Write-Host "=== FleetGuard API Tests ===" -ForegroundColor Cyan

# 1. Health check
Write-Host "`n1. Health check" -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method Get
    $r | ConvertTo-Json
} catch { Write-Host $_.Exception.Message }

# 2. Login (use existing or register)
Write-Host "`n2. Login" -ForegroundColor Yellow
$loginBody = '{"email":"test@test.com","password":"Test123!@#"}'
try {
    $login = Invoke-RestMethod -Uri "$Base/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $login.token
    Write-Host "Token obtained"
} catch {
    Write-Host "Login failed - try registering first"
}

# 3. Dashboard stats (manager token required)
Write-Host "`n3. Manager Dashboard Stats" -ForegroundColor Yellow
if ($token) {
    try {
        $stats = Invoke-RestMethod -Uri "$Base/manager/dashboard/stats" -Method Get -Headers @{Authorization="Bearer $token"}
        $stats | ConvertTo-Json
    } catch { Write-Host $_.Exception.Message }
}

Write-Host "`n=== Tests complete ===" -ForegroundColor Cyan
