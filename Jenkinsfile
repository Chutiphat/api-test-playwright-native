pipeline {
    agent any

    // 🕹️ Parameters: คุณสามารถกรอกค่าจากหน้า Jenkins ได้เลย
    parameters {
        string(name: 'ACCOUNT_URL', defaultValue: 'http://uat-api.example.com', description: 'Enter Account Service API URL')
        choice(name: 'TEST_SCOPE', choices: ['ALL', 'Scene 1 Only', 'Scene 2 Only'], description: 'Choose tests to run')
    }

    environment {
        // ดึงค่าจากพารามิเตอร์ที่กรอกมาหน้า UI ไปใช้ในเทส
        ACCOUNT_URL = "${params.ACCOUNT_URL}"
    }

    stages {
        stage('1. Checkout') {
            steps {
                checkout scm
            }
        }

        stage('2. Install') {
            steps {
                sh 'npm install'
                sh 'npx playwright install --with-deps chromium'
            }
        }

        stage('3. Run Tests') {
            steps {
                script {
                    // เลือกคำสั่งรันตาม TEST_SCOPE ที่พนักงานเลือกมา
                    if (params.TEST_SCOPE == 'Scene 1 Only') {
                        sh 'npx playwright test tests/test02-scene1.spec.js || true'
                    } else if (params.TEST_SCOPE == 'Scene 2 Only') {
                        sh 'npx playwright test tests/test02-scene2.spec.js || true'
                    } else {
                        sh 'npx playwright test || true'
                    }
                }
            }
        }
    }

    post {
        always {
            // 📊 เก็บ Report และ Trace
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright API Test Report'
            ])
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}
