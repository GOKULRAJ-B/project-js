pipeline {

    agent {
        docker {
            image 'node:20-alpine'
            args '-u root'
            
        }
    }

    environment {

        // SonarQube
        SONAR_HOST_URL = 'http://host.docker.internal:9000'
        SONAR_PROJECT_KEY = 'project-js'
        SONAR_PROJECT_NAME = 'project-js'

        // Jenkins Credentials ID
        SONAR_TOKEN = credentials('SONAR_TOKEN')
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh '''
                    export npm_config_cache=/tmp/.npm
                    npm install
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'npm run build'
            }
        }

        stage('Install Sonar Scanner') {
            steps {

                echo 'Installing Sonar Scanner...'

                sh '''
                    apk add --no-cache curl unzip openjdk21-jre

                    curl -sSLo /tmp/sonar-scanner.zip \
                    https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-6.2.1.4610.zip

                    unzip -q /tmp/sonar-scanner.zip -d /opt
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {

                withSonarQubeEnv('sonarqube-server') {

                    echo 'Running SonarQube analysis...'

                    sh '''
                        /opt/sonar-scanner-6.2.1.4610/bin/sonar-scanner \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.projectName=${SONAR_PROJECT_NAME} \
                        -Dsonar.sources=src \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.token=${SONAR_TOKEN} \
                        -Dsonar.exclusions=node_modules/**,dist/** \
                        -Dsonar.typescript.tsconfigPath=tsconfig.json
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {

                timeout(time: 5, unit: 'MINUTES') {

                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Test') {
            steps {

                echo 'Running tests...'

                sh 'npm test'
            }
        }
    }

    post {

        always {
            echo 'Pipeline completed!'
        }

        success {
            echo 'Build successful! Code quality passed SonarQube checks.'
        }

        failure {
            echo 'Build failed. Check Jenkins and SonarQube logs.'
        }
    }
}