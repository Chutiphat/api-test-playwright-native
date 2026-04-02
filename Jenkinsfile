pipeline {
    agent any

    parameters {
        string(name: 'ACCOUNT_URL', defaultValue: 'http://uat-api.example.com', description: 'Enter Account Service API URL')
        choice(name: 'TEST_SCOPE', choices: ['ALL', 'Scene 1 Only', 'Scene 2 Only', 'Batch Flow'], description: 'Choose tests to run')
    }

    environment {
        ACCOUNT_URL = "${params.ACCOUNT_URL}"
    }

    stages {
        stage('1. Checkout') {
            steps { checkout scm }
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
                    if (params.TEST_SCOPE == 'Scene 1 Only') {
                        sh 'npx playwright test tests/test02-scene1.spec.js || true'
                    } else if (params.TEST_SCOPE == 'Scene 2 Only') {
                        sh 'npx playwright test tests/test02-scene2.spec.js || true'
                    } else if (params.TEST_SCOPE == 'Batch Flow') {
                        sh 'npx playwright test tests/batch-e2e-flow.spec.js || true'
                    } else {
                        sh 'npx playwright test || true'
                    }
                }
            }
        }
    }

    post {
        always {
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
