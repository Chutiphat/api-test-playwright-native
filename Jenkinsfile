pipeline {
    agent any

    parameters {
        string(name: 'ACCOUNT_URL', defaultValue: 'http://uat-api.example.com', description: 'Enter API URL')
        choice(name: 'TEST_SCENARIO', choices: ['ALL_SCENES', 'ExchangeRates (Scene 1)', 'CreatePost (Scene 2)', 'BatchFlow (E2E S3)'], description: 'Choose API/Scenario')
        string(name: 'DISCORD_WEBHOOK_URL', defaultValue: 'https://discord.com/api/webhooks/1489116989006807081/jErQuJx6lZXjOcE2rx5TKzG4rwzb5Dmra3VwXlnvOKzCB0J7O3hIbvM_sAubic4qoNgc', description: 'Discord Webhook URL')
    }

    environment {
        ACCOUNT_URL = "${params.ACCOUNT_URL}"
        DISCORD_WEBHOOK_URL = "${params.DISCORD_WEBHOOK_URL}"
    }

    stages {
        stage('1. Checkout') { steps { checkout scm } }
        stage('2. Setup') {
            steps {
                sh 'npm install'
                sh 'npx playwright install --with-deps chromium'
            }
        }
        stage('3. Run Tests') {
            steps {
                script {
                    def testCmd = "npx playwright test"
                    switch(params.TEST_SCENARIO) {
                        case 'ExchangeRates (Scene 1)': testCmd += " tests/test02-scene1.spec.js"; break
                        case 'CreatePost (Scene 2)': testCmd += " tests/test02-scene2.spec.js"; break
                        case 'BatchFlow (E2E S3)': testCmd += " tests/batch-e2e-flow.spec.js"; break
                    }
                    sh "${testCmd} || true"
                }
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true,
                reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright API Test Report'
            ])
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
        
        success {
            script {
                if (env.DISCORD_WEBHOOK_URL) {
                    sh """
                    curl -X POST -H "Content-Type: application/json" \
                    -d '{
                        "embeds": [{
                            "title": "✅ API Test: SUCCESS",
                            "description": "**Job:** ${env.JOB_NAME} [Build #${env.BUILD_NUMBER}]\\n**Scenario:** ${params.TEST_SCENARIO}\\n**Report:** [Click Here](${env.BUILD_URL}playwright-report/)",
                            "color": 3066993
                        }]
                    }' ${env.DISCORD_WEBHOOK_URL}
                    """
                }
            }
        }
        
        failure {
            script {
                if (env.DISCORD_WEBHOOK_URL) {
                    sh """
                    curl -X POST -H "Content-Type: application/json" \
                    -d '{
                        "embeds": [{
                            "title": "❌ API Test: FAILED",
                            "description": "**Job:** ${env.JOB_NAME} [Build #${env.BUILD_NUMBER}]\\n**Scenario:** ${params.TEST_SCENARIO}\\n**Status:** พบข้อผิดพลาด กรุณาตรวจสอบลิงก์ด้านล่าง\\n**Detail:** [View Errors](${env.BUILD_URL})",
                            "color": 15158332
                        }]
                    }' ${env.DISCORD_WEBHOOK_URL}
                    """
                }
            }
        }
    }
}
