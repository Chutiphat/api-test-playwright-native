pipeline {
    agent any

    parameters {
        string(name: 'ACCOUNT_URL', defaultValue: 'http://uat-api.example.com', description: 'Enter API URL (e.g. http://10.x.x.x:8081)')
        
        // 🎯 เมนูสำหรับเลือกเส้นที่จะเทส (Scenario Selection)
        choice(name: 'TEST_SCENARIO', 
               choices: [
                   'ALL_SCENES', 
                   'ExchangeRates (Scene 1)', 
                   'CreatePost (Scene 2)', 
                   'BatchFlow (E2E S3)'
               ], 
               description: 'โปรดเลือก API หรือ Scenario ที่ต้องการทดสอบ')
    }

    environment {
        // ดึงค่า URL ไปใช้งานในโค้ดผ่าน process.env.ACCOUNT_URL
        ACCOUNT_URL = "${params.ACCOUNT_URL}"
    }

    stages {
        stage('1. Checkout') { steps { checkout scm } }
        
        stage('2. Setup Environment') {
            steps {
                sh 'npm install'
                sh 'npx playwright install --with-deps chromium'
            }
        }

        stage('3. Execute Testing') {
            steps {
                script {
                    // ตรวจสอบเงื่อนไขตามที่เลือกจากหน้าจอ Jenkins
                    switch(params.TEST_SCENARIO) {
                        case 'ExchangeRates (Scene 1)':
                            sh 'npx playwright test tests/test02-scene1.spec.js || true'
                            break
                        case 'CreatePost (Scene 2)':
                            sh 'npx playwright test tests/test02-scene2.spec.js || true'
                            break
                        case 'BatchFlow (E2E S3)':
                            sh 'npx playwright test tests/batch-e2e-flow.spec.js || true'
                            break
                        case 'ALL_SCENES':
                        default:
                            // รันทุกไฟล์ในโฟลเดอร์ tests/
                            sh 'npx playwright test || true'
                            break
                    }
                }
            }
        }
    }

    post {
        always {
            // 📊 แสดงผล Report บน Jenkins
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright API Test Report'
            ])
            // เก็บ Artifacts (Trace/Screenshots)
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}
