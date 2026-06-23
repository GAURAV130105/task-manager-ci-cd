# 📋 TaskFlow — Production-Ready Task Manager with CI/CD

TaskFlow is a modern, full-stack task management application built using **Node.js**, **Express**, **MongoDB**, and **React (Vite)**. 

This project serves as a comprehensive DevOps and Cloud engineering showcase, demonstrating a journey from local development to a fully automated, containerized, and secured production pipeline on **Azure** using **Jenkins** and **SSL/TLS**.

---

## 🔗 Live Deployments

* **🔒 Secure Application URL:** [https://adaptiqaag.tech](https://adaptiqaag.tech) *(Nginx serves the React app and proxies API calls over SSL)*
* **⚙️ Jenkins Server:** `http://172.188.113.47:8080` *(Private CI/CD automation server)*

---

## 🛠️ Architecture & CI/CD Pipeline

```
[ Local Laptop ] ──► git push ──► [ GitHub Repository ]
                                        │
                                        ▼ (Webhook Event)
                                  [ Jenkins Server (Azure VM) ]
                                        │ (Reads Jenkinsfile)
                                        ├── 1. Pulls latest master code
                                        ├── 2. Logs in to Docker Hub
                                        ├── 3. Builds multi-platform Docker images
                                        ├── 4. Pushes images to Docker Hub
                                        └── 5. Triggers Local Zero-Downtime Deployment
                                                │
                                                ▼
                                  [ Docker Compose Containers ]
                                        ├── Frontend (Nginx + SSL on Port 443)
                                        ├── Backend (Express API on Port 5000)
                                        └── Database (MongoDB on Port 27017)
```

---

## 🗂️ Project Structure

```
task-manager-ci-cd/
├── backend/                  # Node.js + Express API
│   ├── models/Task.js        # Mongoose Schema
│   ├── routes/taskRoutes.js  # CRUD endpoints
│   ├── server.js             # Express Entry Point
│   └── Dockerfile            # Container build for Backend
├── frontend/                 # React + Vite + Axios UI
│   ├── src/                  # Components (TaskForm, TaskCard, Stats, EditModal)
│   ├── nginx.conf            # HTTPS/SSL reverse proxy configuration
│   └── Dockerfile            # Container build for Frontend
├── docker-compose.yml        # Orchestrates Frontend, Backend, and MongoDB
├── Jenkinsfile               # Declarative Jenkins CI/CD Pipeline
├── phase5.md                 # Complete Phase 5 Installation Reference
├── phase6.md                 # Complete Phase 6 SSL/HTTPS Reference
└── README.md                 # Project Overview & Showcase
```

---

## 🚀 The DevOps Journey (Project Phases)

### 🔹 Phase 1: Local Development
* Created the backend REST API using Express and MongoDB.
* Developed the frontend interface using React (Vite) and Vanilla CSS.
* Set up mock task structures with searches, filters, and priority queues.

### 🔹 Phase 2: Containerization (Docker)
* Wrote optimized `Dockerfiles` for both frontend and backend services.
* Created a multi-container environment using `docker-compose.yml` to spin up the entire stack locally with database persistence.

### 🔹 Phase 3: Manual Cloud Deployment
* Provisioned an **Azure Virtual Machine** running Ubuntu.
* Manually configured Docker and Compose on the host, verified connection endpoints, and launched the application live via the VM IP address.

### 🔹 Phase 4: Cloud CI/CD (GitHub Actions)
* Set up a GitHub Actions workflow (`.github/workflows/deploy.yml`).
* Automated building and pushing Docker images to Docker Hub, followed by an SSH deploy sequence into the Azure VM.

### 🔹 Phase 5: Self-Hosted CI/CD (Jenkins)
* Installed **Java 21** and **Jenkins** directly on the Azure VM.
* Set up Jenkins credentials, pipelines, and a **GitHub Webhook** to trigger instant builds when developers push to `master`.
* Converted the workflow into a local Docker agent runner to optimize VM hardware usage.

### 🔹 Phase 6: HTTPS & SSL Security (Let's Encrypt)
* Mapped the custom domain **`adaptiqaag.tech`** to the Azure VM.
* Installed **Certbot** and generated Let's Encrypt SSL/TLS certificates.
* Configured the **Nginx** server inside the frontend container to secure traffic on port `443` and force-redirect port `80` to `443`.
* Mounted host VM certificates as read-only volumes to the container, and established automatic SSL renewal cron jobs.

---

## 🔌 API Endpoints Reference

| Method   | Endpoint           | Description              |
|----------|--------------------|--------------------------|
| `GET`    | `/api/tasks`       | Fetch all tasks (with filters & search) |
| `POST`   | `/api/tasks`       | Create a new task        |
| `PUT`    | `/api/tasks/:id`   | Update an existing task  |
| `DELETE` | `/api/tasks/:id`   | Delete a task            |

---

## 🛠️ Quick Start (Local Run)

### Prerequisites
* Node.js 18+
* Docker & Docker Compose

### 1. Running with Docker Compose (Easiest)
```bash
# Clone the repository
git clone https://github.com/GAURAV130105/task-manager-ci-cd.git
cd task-manager-ci-cd

# Spin up all containers
docker-compose up -d
```
The application will be live at `http://localhost`.

### 2. Manual Local Development
**Start Backend:**
```bash
cd backend
npm install
npm run dev         # Runs on http://localhost:5000
```

**Start Frontend:**
```bash
cd frontend
npm install
npm run dev         # Runs on http://localhost:5173
```

---

## 🚨 VM Maintenance & Troubleshooting Commands

### Check running containers:
```bash
docker ps
```

### View backend application logs:
```bash
docker logs -f task-manager-backend
```

### Check Jenkins service status:
```bash
sudo systemctl status jenkins
```

### Manually renew SSL certificates:
```bash
sudo certbot renew --dry-run
```
