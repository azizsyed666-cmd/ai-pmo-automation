# Project 0 — Local AI Automation Environment

## Objective
Set up a local AI automation development environment using Docker and n8n on macOS.
The environment provides the foundation for developing AI-powered PMO automation projects.

## Architecture

Mac
  ↓
Docker Desktop
  ↓
n8n Docker Container
  ↓
Local n8n Instance
  ↓
AI Models and External Services

## Technology Stack
- macOS
- Docker Desktop
- Docker Engine
- n8n
- Docker Persistent Volume

## Implementation
### 1. Docker Installation
Docker Desktop was installed and verified successfully.
Docker version: 29.6.2

### 2. Persistent Storage
A Docker volume was created to persist n8n data:
```bash
docker volume create n8n_data
```
### 3. N8n Deployment
n8n was deployed using Docker:
Bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_SECURE_COOKIE=false \
  docker.n8n.io/n8nio/n8n

### 4.Local Access
The n8n editor was accessed through:
http://localhost:5678

✅ Docker installed
✅ Docker verified
✅ Persistent n8n volume created
✅ n8n deployed in Docker
✅ n8n accessible locally
✅ n8n account created
✅ Local development environment operational

Lessons Learned

* Docker can run n8n without requiring a local Node.js installation.
* n8n data should be stored using a persistent Docker volume.
* The n8n editor can be accessed locally through port 5678.
* The N8N_SECURE_COOKIE setting may need adjustment for local HTTP development when using Safari.
* n8n acts as the orchestration layer for future AI automation projects.
