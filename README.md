# 📘 API Test Automation Framework (Playwright Native)

A professional-grade API testing framework built with **Playwright**, designed using **Modular Architecture**. This framework provides deep system verification beyond standard API responses, covering Databases, AWS Logs, and File Systems (S3/SFTP).

---

## ✨ Key Features

### 🚀 1. Modular API Repository
Encapsulates API logic (methods, paths) separately from test scenarios in `lib/api/`, ensuring high maintainability and reusability.

### 🗄️ 2. Deep System Verification
- **Database (Postgres)**: Execute SQL queries directly to verify data persistence via `DbHelper.js`.
- **AWS CloudWatch Logs**: Retrieve and verify system logs using `AwsLogHelper.js`.
- **AWS S3 Lifecycle**: Full file management (Upload, Check, Read, Delete) for batch processing tests.
- **SFTP Support**: Direct file transfers to/from remote servers via `SftpHelper.js`.

### 🛡️ 3. JSON Schema Validation (`ajv`)
Strictly validate the API response structure against a defined blueprint. Ensures data types are correct and mandatory fields are present.

### ✅ 4. Advanced Assertions (`Utils.js`)
A powerful validation engine that mimics Postman's style:
- Supports `mandatory`, `optional`, and **Regex** validation.
- **CSV Comparison**: Compare actual CSV files against local templates row-by-row.
- Detailed **Expected vs Actual** reporting for every field.

### 🎮 5. Smart Notifications
Automated **Discord** notifications upon test completion, including summary tables, failed logs, and full HTML report attachments.

---

## 📂 Project Structure

```text
api-test-playwright-native/
├── lib/                     # 🧠 Core Engine & Helpers
│   ├── api/                 # 🚀 API Definitions (Path/Method)
│   ├── DbHelper.js          # 🗄️ Database Utilities
│   ├── AwsLogHelper.js      # 🔍 AWS CloudWatch Utilities
│   ├── S3Helper.js          # ☁️ AWS S3 Utilities
│   ├── SftpHelper.js        # 📂 SFTP Utilities
│   ├── NotifyHelper.js      # 🎮 Discord Notification Logic
│   └── Utils.js             # ✅ Core Assertion Engine (including Schema & CSV)
├── tests/                   # 🧪 Test Scenarios (.spec.js)
├── input/                   # 📂 Test Data & Expected Templates
└── playwright.config.js     # 🛠️ Main Framework Configuration
```

---

## 🚀 Getting Started

### **Installation**
```bash
git clone https://github.com/Chutiphat/api-test-playwright-native.git
npm install
npx playwright install chromium
```

### **Running Tests**
| Command | Description |
| :--- | :--- |
| `npm run test:allure` | Run all tests and open Allure Report immediately |
| `npx playwright test` | Run tests with standard reporting and Discord notification |
| `allure serve allure-results` | View Allure history report locally |
