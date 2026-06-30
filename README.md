# 📋 TaskFlow — Production-Ready CI/CD Task Manager

> A full-stack task management application built as a **comprehensive DevOps & Cloud Engineering showcase**, demonstrating a complete journey from local development to a fully automated, containerized, monitored, and secured production pipeline on **Microsoft Azure**.

[![CI/CD](https://github.com/GAURAV130105/task-manager-ci-cd/actions/workflows/deploy.yml/badge.svg)](https://github.com/GAURAV130105/task-manager-ci-cd/actions/workflows/deploy.yml)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)
![Terraform](https://img.shields.io/badge/IaC-Terraform-7B42BC?logo=terraform)
![Prometheus](https://img.shields.io/badge/Monitoring-Prometheus-E6522C?logo=prometheus)
![Grafana](https://img.shields.io/badge/Dashboard-Grafana-F46800?logo=grafana)
![Security](https://img.shields.io/badge/Security-Trivy%20%7C%20GitLeaks-00979D)

---

## 🔗 Live Deployments

| Service | URL |
|---|---|
| 🔒 **Application** | [https://adaptiqaag.tech](https://adaptiqaag.tech) |
| 📊 **Grafana Dashboard** | `http://<VM_IP>:3000` |
| 🔭 **Prometheus** | `http://<VM_IP>:9090` |

---

## 🛠️ Technology Stack

### Application
| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), Vanilla CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **API** | RESTful JSON API |

### DevOps & Infrastructure
| Category | Tools |
|---|---|
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions, Jenkins |
| **Infrastructure as Code** | Terraform (Azure) |
| **Cloud** | Microsoft Azure (VM, NSG, VNet) |
| **SSL/TLS** | Let's Encrypt + Certbot |
| **Reverse Proxy** | Nginx |
| **Monitoring** | Prometheus, Grafana, cAdvisor, Node Exporter |
| **Security** | GitLeaks, Trivy, npm audit |

---

## 🏗️ Full Architecture

```
[ Developer Laptop ]
        │
        └──▶ git push origin master
                        │
                        ▼
            ┌─────────────────────────────────────┐
            │         GitHub Actions               │
            │                                     │
            │  Job 1: 🛡️ Security Scan            │
            │  ├── GitLeaks (secret scanning)     │
            │  ├── npm audit (backend deps)       │
            │  └── npm audit (frontend deps)      │
            │              │                      │
            │              ▼ (only if passes)     │
            │  Job 2: 🐳 Build & Deploy           │
            │  ├── Build backend image            │
            │  ├── Trivy scan (report CVEs)       │
            │  ├── Push to Docker Hub             │
            │  ├── Build frontend image           │
            │  ├── Trivy scan (report CVEs)       │
            │  ├── Push to Docker Hub             │
            │  └── SSH Deploy to Azure VM         │
            └─────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Azure VM (Ubuntu)   │
                    │   (via Terraform IaC) │
                    │                       │
                    │  docker compose up    │
                    │  ├── 🌐 Frontend      │
                    │  │   (Nginx + SSL)    │
                    │  ├── ⚙️ Backend       │
                    │  │   (Express API)    │
                    │  ├── 🍃 MongoDB       │
                    │  ├── 📊 Prometheus    │
                    │  ├── 📈 Grafana       │
                    │  ├── 🐳 cAdvisor      │
                    │  └── 🖥️ Node Exporter │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
            https://adaptiqaag.tech   Grafana :3000
            (React App + HTTPS)       (Live Dashboards)
```

---

## 🗂️ Project Structure

```
task-manager-ci-cd/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline (with security scanning)
├── backend/
│   ├── models/Task.js          # Mongoose Schema
│   ├── routes/taskRoutes.js    # CRUD REST endpoints
│   ├── server.js               # Express entry point + Prometheus /metrics
│   ├── Dockerfile              # Security-hardened (node:20-alpine + apk upgrade)
│   └── package.json            # Includes prom-client for metrics
├── frontend/
│   ├── src/                    # React components (TaskForm, TaskCard, Stats, EditModal)
│   ├── nginx.conf              # HTTPS reverse proxy + SPA routing
│   └── Dockerfile              # Multi-stage: node:20-alpine builder + nginx:1.25-alpine
├── monitoring/
│   └── prometheus.yml          # Prometheus scrape config (backend, cadvisor, node-exporter)
├── terraform/
│   ├── main.tf                 # Azure VM, VNet, NSG, Public IP, NIC
│   ├── variables.tf            # Configurable input variables
│   ├── outputs.tf              # Public IP output
│   ├── providers.tf            # AzureRM provider config
│   └── startup.sh              # VM bootstrap automation script
├── docker-compose.yml          # Full stack: app + monitoring containers
├── Jenkinsfile                 # Declarative Jenkins CI/CD pipeline
└── README.md
```

---

## 🚀 The DevOps Journey — 9 Phases

### ✅ Phase 1: Full-Stack Application Development
- Built the backend REST API using **Node.js + Express + MongoDB**
- Developed a modern, responsive frontend using **React (Vite)** and Vanilla CSS
- Implemented full CRUD operations for task management with priority queues, status filters, and search

### ✅ Phase 2: Containerization with Docker
- Wrote optimized `Dockerfiles` for both frontend and backend services
- Created `docker-compose.yml` to orchestrate all 3 containers (frontend, backend, database) locally
- Implemented persistent MongoDB data volumes

### ✅ Phase 3: Manual Cloud Deployment (Azure VM)
- Provisioned an **Azure Virtual Machine** running Ubuntu manually
- Installed Docker and Docker Compose on the host
- Deployed and verified the full application stack live via VM public IP

### ✅ Phase 4: CI/CD with GitHub Actions
- Set up a `.github/workflows/deploy.yml` pipeline
- Automated: build Docker images → push to Docker Hub → SSH deploy to Azure VM
- Configured GitHub Secrets for secure credential storage

### ✅ Phase 5: Self-Hosted CI/CD with Jenkins
- Installed **Java 21** and **Jenkins** on the Azure VM
- Set up Jenkins credentials, pipelines, and a **GitHub Webhook** for instant auto-builds
- Wrote a `Jenkinsfile` with declarative pipeline stages

### ✅ Phase 6: Custom Domain + HTTPS/SSL Security
- Mapped custom domain **`adaptiqaag.tech`** to the Azure VM via DNS A-Record
- Installed **Certbot** and generated **Let's Encrypt SSL/TLS certificates**
- Configured **Nginx** to serve HTTPS on port `443` and force-redirect port `80` → `443`
- Set up SSL certificate auto-renewal

### ✅ Phase 7: Infrastructure as Code (Terraform)
- Replaced all manual Azure setup with **Terraform IaC** configuration
- Defined: Resource Group, Virtual Network, Subnet, NSG rules, Public IP, NIC, and VM in code
- Enabled reproducible infrastructure with `terraform apply` / `terraform destroy`
- Added SSH key authentication for secure VM access

### ✅ Phase 8: Monitoring & Observability
- Integrated **`prom-client`** into the Node.js backend to expose a `/metrics` endpoint
- Added **Prometheus** to scrape metrics from backend, containers, and host VM
- Added **Grafana** with pre-built dashboards:
  - **Dashboard 1860** — Node Exporter (VM CPU, RAM, Disk, Network)
  - **Dashboard 14282** — cAdvisor (per-container CPU & Memory usage)
- Added **cAdvisor** for Docker container metrics
- Added **Node Exporter** for host VM system metrics

### ✅ Phase 9: DevSecOps — Security in the Pipeline
- Restructured GitHub Actions into **2 separate jobs** (security-scan → build-and-deploy)
- **GitLeaks**: Scans entire codebase for accidentally committed secrets and API keys
- **npm audit**: Scans backend and frontend dependencies for known CVEs
- **Trivy**: Scans built Docker images for OS and library vulnerabilities before deployment
- Hardened Dockerfiles: upgraded to `node:20-alpine`, added `apk upgrade` to patch OS CVEs

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch all tasks (with filters & search) |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/metrics` | Prometheus metrics endpoint (internal) |

---

## ⚡ Quick Start (Local Run)

### Prerequisites
- Node.js 20+
- Docker & Docker Compose

### Run with Docker Compose
```bash
# Clone the repository
git clone https://github.com/GAURAV130105/task-manager-ci-cd.git
cd task-manager-ci-cd

# Create .env file
echo "MONGODB_URI=mongodb://database:27017/taskdb" > .env

# Start all containers
docker compose up -d
```
App runs at `http://localhost`

### Run Locally (Development)
```bash
# Backend
cd backend && npm install && npm run dev   # http://localhost:5000

# Frontend (new terminal)
cd frontend && npm install && npm run dev  # http://localhost:5173
```

---

## 📊 Monitoring Dashboards

| Service | Access | Credentials |
|---|---|---|
| **Grafana** | `http://<VM_IP>:3000` | admin / admin123 |
| **Prometheus** | `http://<VM_IP>:9090` | No auth |
| **Prometheus Targets** | `http://<VM_IP>:9090/targets` | Shows all 4 scrape targets |

### Grafana Dashboard IDs
| Dashboard | ID | Metrics |
|---|---|---|
| Node Exporter Full | `1860` | VM CPU, RAM, Disk, Network |
| Docker cAdvisor | `14282` | Container CPU & Memory |

---

## 🏗️ Infrastructure Management (Terraform)

```powershell
# Navigate to terraform folder
cd terraform/

# Initialize (first time only)
terraform init

# Preview changes
terraform plan

# Create all Azure resources
terraform apply

# Destroy all resources (saves Azure credits)
terraform destroy
```

---

## 🔒 Security Features

| Tool | What It Scans | When |
|---|---|---|
| **GitLeaks** | Leaked secrets & API keys in git history | Every push (before build) |
| **npm audit** | Vulnerable npm packages (backend + frontend) | Every push (before build) |
| **Trivy** | Docker image OS & library CVEs | After build, before push |
| **Nginx** | Force HTTPS, SSL/TLS termination | Runtime |
| **Azure NSG** | Firewall — only ports 22, 80, 443, 3000, 9090 open | Infrastructure |

---

## 🗺️ VM Maintenance Commands

```bash
# Check all running containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# View backend logs
docker logs -f task-manager-backend

# View Prometheus logs
docker logs prometheus --tail 20

# Restart monitoring stack
docker compose restart prometheus grafana

# Renew SSL certificates
sudo certbot renew --dry-run

# Pull latest code and redeploy
cd ~/task-manager-ci-cd && git pull origin master && docker compose up -d
```
