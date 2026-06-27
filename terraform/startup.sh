#!/bin/bash
# ============================================================
# TaskFlow VM Startup Script
# Run this once on a fresh Azure VM after terraform apply
# Usage: bash startup.sh <YOUR_MONGODB_URI>
# ============================================================

set -e  # Exit immediately if any command fails

MONGO_URI=$1
REPO_URL="https://github.com/gaurav130105/task-manager-ci-cd.git"
DOMAIN="adaptiqaag.tech"

echo "🚀 Starting TaskFlow VM Setup..."

# ─────────────────────────────────────────────
# STEP 1: Install Docker & Docker Compose V2
# ─────────────────────────────────────────────
echo ""
echo "📦 Step 1: Installing Docker..."
sudo apt-get update -y
sudo apt-get install ca-certificates curl gnupg -y
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
sudo usermod -aG docker $USER
echo "✅ Docker installed successfully!"

# ─────────────────────────────────────────────
# STEP 2: Clone the repository
# ─────────────────────────────────────────────
echo ""
echo "📁 Step 2: Cloning repository..."
if [ -d "$HOME/task-manager-ci-cd" ]; then
  echo "Repo already exists. Pulling latest changes..."
  cd ~/task-manager-ci-cd && git pull origin master
else
  git clone $REPO_URL ~/task-manager-ci-cd
fi
echo "✅ Repository ready!"

# ─────────────────────────────────────────────
# STEP 3: Create the .env file
# ─────────────────────────────────────────────
echo ""
echo "🔑 Step 3: Creating .env file..."
if [ -z "$MONGO_URI" ]; then
  echo "⚠️  WARNING: No MongoDB URI provided. You must manually create the .env file:"
  echo "   nano ~/task-manager-ci-cd/.env"
  echo "   Add: MONGODB_URI=mongodb+srv://..."
else
  echo "MONGODB_URI=$MONGO_URI" > ~/task-manager-ci-cd/.env
  echo "✅ .env file created!"
fi

# ─────────────────────────────────────────────
# STEP 4: Install Certbot & Generate SSL
# ─────────────────────────────────────────────
echo ""
echo "🔒 Step 4: Installing Certbot & generating SSL certificate..."
sudo apt install certbot -y
echo ""
echo "⚠️  ACTION REQUIRED: Ensure your DNS A-Record points to this VM's IP before continuing!"
echo "   Domain: $DOMAIN"
echo "   Run manually after DNS update:"
echo "   sudo certbot certonly --standalone -d $DOMAIN"
echo ""

# ─────────────────────────────────────────────
# STEP 5: Setup auto-renewal hook for SSL
# ─────────────────────────────────────────────
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
echo '#!/bin/bash
docker restart task-manager-frontend' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh > /dev/null
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
echo "✅ SSL auto-renewal hook configured!"

# ─────────────────────────────────────────────
# DONE
# ─────────────────────────────────────────────
echo ""
echo "============================================================"
echo "✅ VM Setup Complete!"
echo "============================================================"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Run SSL cert command:  sudo certbot certonly --standalone -d $DOMAIN"
echo "2. Update AZURE_VM_IP secret in GitHub with your new IP."
echo "3. Go to GitHub Actions and click 'Re-run all jobs' to deploy containers."
echo "4. Visit https://$DOMAIN to verify!"
echo ""
