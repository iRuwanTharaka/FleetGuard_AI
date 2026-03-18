#!/bin/bash
# @module     Testing Related
# @author     Iruwan Tharaka <iruwantharaka2001@gmail.com>
# @description This file is part of the test suite of FleetGuard AI.
# @date       2026-02-22

# FleetGuard API Test Script - Run with backend running on localhost:3001
BASE="http://localhost:3001/api"

echo "=== FleetGuard API Tests ==="

# 1. Health check
echo -e "\n1. Health check"
curl -s "$BASE/../api/health" 2>/dev/null || curl -s "http://localhost:3001/api/health" 2>/dev/null || curl -s "$BASE/health" 2>/dev/null
echo ""

# 2. Auth - Register a test driver
echo -e "\n2. Register test driver"
REG=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"name":"Test Driver","email":"testdriver@test.com","password":"Test123!@#","role":"driver","phone":"+94771234567"}')
echo "$REG" | head -c 200
TOKEN=$(echo "$REG" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo -e "\nToken: ${TOKEN:0:50}..."

# 3. Auth - Login
echo -e "\n3. Login"
LOGIN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"testdriver@test.com","password":"Test123!@#"}')
echo "$LOGIN" | head -c 200
DRIVER_TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 4. Get Me (driver)
echo -e "\n4. GET /auth/me (driver)"
curl -s -H "Authorization: Bearer $DRIVER_TOKEN" "$BASE/auth/me" | head -c 300
echo ""

# 5. Driver stats
echo -e "\n5. GET /driver/stats"
curl -s -H "Authorization: Bearer $DRIVER_TOKEN" "$BASE/driver/stats" | head -c 200
echo ""

# 6. Register manager and test manager endpoints
echo -e "\n6. Register manager"
MGR=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"name":"Test Manager","email":"testmanager@test.com","password":"Test123!@#","role":"manager"}')
MGR_TOKEN=$(echo "$MGR" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 7. Manager dashboard stats
echo -e "\n7. GET /manager/dashboard/stats"
curl -s -H "Authorization: Bearer $MGR_TOKEN" "$BASE/manager/dashboard/stats" | head -c 300
echo ""

# 8. Manager drivers list
echo -e "\n8. GET /users/drivers"
curl -s -H "Authorization: Bearer $MGR_TOKEN" "$BASE/users/drivers" | head -c 300
echo ""

# 9. User preferences
echo -e "\n9. GET /user/preferences"
curl -s -H "Authorization: Bearer $MGR_TOKEN" "$BASE/user/preferences" | head -c 200
echo ""

# 10. Analytics
echo -e "\n10. GET /manager/analytics/health-trend?days=30"
curl -s -H "Authorization: Bearer $MGR_TOKEN" "$BASE/manager/analytics/health-trend?days=30" | head -c 200
echo ""

echo -e "\n=== Tests complete ==="
