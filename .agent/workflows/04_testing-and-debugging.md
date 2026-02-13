---
description: Test and debug the application using Browser Control to ensure all flows (Landing, Login, Dashboard, Logout) work correctly.
---

# 04 Testing & Debugging with Browser Control

This workflow uses the Antigravity Browser Control to verify the end-to-end functionality of Maulana Laundry Web App.

## 1. Landing Page Verification
// turbo
Verify all navigation links and sections on the landing page.
```bash
# Task for Browser Subagent:
# 1. Open http://localhost:5173
# 2. Click each menu in the Navbar (Beranda, Layanan, Harga, Tentang, Kontak)
# 3. Ensure the page scrolls to the correct section for each click.
# 4. Check for any broken images or layout issues.
```

## 2. Admin Login Flow
// turbo
Test the login process with seeded credentials.
```bash
# Task for Browser Subagent:
# 1. Navigate to http://localhost:5173/admin/login
# 2. Enter email: admin@maulana.com (Check seeder.go if different)
# 3. Enter password: admin123
# 4. Click login button.
# 5. Verify it redirects to /admin/dashboard.
# NOTE: If login fails, verify backend is running on port 8080 (check .env and output.log).
```

## 3. Dashboard Interactivity
// turbo
Test sidebar, multi-tab system, and profile dropdown.
```bash
# Task for Browser Subagent:
# 1. On Dashboard, click sidebar menus: Users, Transactions, Services, Settings.
# 2. Verify new tabs are created correctly in the Tab Bar.
# 3. Click the Sidebar toggle to collapse/expand.
# 4. Success-click on the Profile dropdown (User Avatar).
```

## 4. Logout & Security
// turbo
Test logout and protected route access.
```bash
# Task for Browser Subagent:
# 1. Click Profile Dropdown -> Logout (Terminate Session).
# 2. Verify it redirects to /admin/login.
# 3. Try manual navigation to /admin/dashboard.
# 4. Verify it redirects back to /admin/login (Protected Route).
```

## 5. Automated Debugging
If the browser subagent reports an error (red screen, console error, or failed navigation):
1. **Analyze logs**: Check `backend/output.log` and browser console.
2. **Fix Code**: Apply necessary fixes via `replace_file_content`.
3. **Re-test**: Run the workflow step again until successful.
