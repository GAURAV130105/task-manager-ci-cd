pipeline {
    agent any

    environment {
        // Must match the ID you set in Jenkins → Manage Jenkins → Credentials
        DOCKER_HUB_CREDS = 'docker-hub-credentials'
        // Your Docker Hub username
        DOCKER_USER = 'gaauraav13'
        // Folder where docker-compose.yml lives on the Jenkins VM
        PROJECT_DIR = '/home/azureuser/task-manager-ci-cd'
    }

    stages {

        // ─────────────────────────────────────────────
        // STAGE 1: Pull the latest code from GitHub
        // Jenkins does this automatically via SCM config
        // ─────────────────────────────────────────────
        stage('Checkout Code') {
            steps {
                echo '📥 Checking out latest code from GitHub...'
                checkout scm
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 2: Log in to Docker Hub
        // Uses the credentials stored securely in Jenkins
        // ─────────────────────────────────────────────
        stage('Login to Docker Hub') {
            steps {
                echo '🔐 Logging in to Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: env.DOCKER_HUB_CREDS,
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                }
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 3: Build & Push Backend Docker Image
        // Builds from the backend/ directory's Dockerfile
        // ─────────────────────────────────────────────
        stage('Build & Push Backend Image') {
            steps {
                echo '🔨 Building backend Docker image...'
                sh "docker build -t ${DOCKER_USER}/taskmanager-backend:latest ./backend"
                echo '📤 Pushing backend image to Docker Hub...'
                sh "docker push ${DOCKER_USER}/taskmanager-backend:latest"
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 4: Build & Push Frontend Docker Image
        // Multi-stage build: React build → Nginx hosting
        // ─────────────────────────────────────────────
        stage('Build & Push Frontend Image') {
            steps {
                echo '🔨 Building frontend Docker image...'
                sh "docker build -t ${DOCKER_USER}/taskmanager-frontend:latest ./frontend"
                echo '📤 Pushing frontend image to Docker Hub...'
                sh "docker push ${DOCKER_USER}/taskmanager-frontend:latest"
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 5: Redeploy the Application
        // Pulls new images and restarts containers
        // ─────────────────────────────────────────────
        stage('Deploy Application') {
            steps {
                echo '🚀 Deploying updated containers...'
                sh """
                    cd ${PROJECT_DIR}
                    docker-compose pull
                    docker-compose up -d --remove-orphans
                    docker image prune -f
                """
            }
        }
    }

    // ─────────────────────────────────────────────
    // POST: Always runs after all stages complete
    // Logs out of Docker Hub regardless of success/failure
    // ─────────────────────────────────────────────
    post {
        always {
            echo '🔒 Logging out of Docker Hub...'
            sh 'docker logout'
        }
        success {
            echo '✅ Pipeline completed successfully! App is live.'
        }
        failure {
            echo '❌ Pipeline failed. Check the stage logs above for errors.'
        }
    }
}
