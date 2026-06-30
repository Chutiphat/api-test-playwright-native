const fs = require('fs');
const path = require('path');

const reportDir = path.resolve(__dirname, '..', 'test-results');
const reportPath = path.join(reportDir, 'automation-report.html');

fs.mkdirSync(reportDir, { recursive: true });

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Automation Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; }
      .card { border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
      .ok { color: green; }
      .warn { color: orange; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Automation Test Report</h1>
      <p>This report was generated automatically by the local Playwright setup.</p>
      <p class="ok">Status: generated successfully</p>
    </div>
  </body>
</html>`;

fs.writeFileSync(reportPath, html, 'utf8');
console.log(`Generated report at ${reportPath}`);
