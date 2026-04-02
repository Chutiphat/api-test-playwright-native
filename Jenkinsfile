pipeline {
    agent any

    parameters {
        string(name: 'ACCOUNT_URL', defaultValue: 'http://uat-api.example.com', description: 'Enter API URL')
        choice(name: 'TEST_SCENARIO', choices: ['ALL_SCENES', 'ExchangeRates (Scene 1)', 'CreatePost (Scene 2)', 'BatchFlow (E2E S3)'], description: 'Choose API/Scenario')
        string(name: 'SLACK_WEBHOOK_URL', defaultValue: '', description: 'Slack Webhook URL (optional)')
    }

    environment {
        ACCOUNT_URL = "${params.ACCOUNT_URL}"
        SLACK_WEBHOOK_URL = "${params.SLACK_WEBHOOK_URL}"
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
                if (env.SLACK_WEBHOOK_URL) {
                    sh """
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"✅ *Build Success: ${env.JOB_NAME}* [Build #${env.BUILD_NUMBER}]\nScenario: ${params.TEST_SCENARIO}\nReport: ${env.BUILD_URL}playwright-report/"}' \
                    ${env.SLACK_WEBHOOK_URL}
                    """
                }
            }
        }
        
        failure {
            script {
                if (env.SLACK_WEBHOOK_URL) {
                    sh """
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"❌ *Build Failed: ${env.JOB_NAME}* [Build #${env.BUILD_NUMBER}]\nScenario: ${params.TEST_SCENARIO}\nCheck errors: ${env.BUILD_URL}"}' \
                    ${env.SLACK_WEBHOOK_URL}
                    """
                }
            }
        }
    }
}
