pipeline {
    agent any

    environment {
        // Must match the ID you set in Jenkins → Manage Jenkins → Credentials
        DOCKER_HUB_CREDS = 'docker-hub-credentials'
        // Your Docker Hub username (used for building and pushing images)
        DOCKER_USER = 'gaauraav13'
        // Must match DOCKERHUB_USERNAME in docker-compose.yml image references
        DOCKERHUB_USERNAME = 'gaauraav13'
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
                sh "docker build --platform linux/amd64 -t ${DOCKER_USER}/taskmanager-backend:latest ./backend"
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
                sh "docker build --platform linux/amd64 -t ${DOCKER_USER}/taskmanager-frontend:latest ./frontend"
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
                // Copy the .env file (with MONGODB_URI) from the home directory
                // This file exists on the VM but is never committed to GitHub (secret)
                sh 'cp /home/azureuser/task-manager-ci-cd/.env .env'
                // Stop any existing containers to avoid name conflicts
                sh 'docker-compose down || true'
                // Pull latest images from Docker Hub
                sh 'docker-compose pull'
                // Start containers fresh with new images
                sh 'docker-compose up -d --remove-orphans'
                // Clean up old unused images to save disk space
                sh 'docker image prune -f'
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
