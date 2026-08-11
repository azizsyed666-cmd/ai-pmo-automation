# Project 0 — Local  Self-Hosted AI Automation Environment

## Objective
Set up a local AI automation development environment using Docker and n8n on macOS.
The environment provides the foundation for developing AI-powered PMO automation projects.

## Architecture

Mac
  ↓
Docker Desktop
  ↓
Docker Engine
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
- Docker Containers
- n8n
- Docker Persistent Volume
- Google Chrome
- Localhost

## Implementation
### 1. Docker Installation
Docker Desktop was installed and verified successfully.
Docker version: 29.6.2

### 2. Persistent Storage
A Docker volume was created to persist n8n data:
```bash
docker volume create n8n_data
```
The Docker volume was mounted to the n8n data directory:
```bash
dn8n_data:/home/node/.n8n
```
This allows n8n data to persist beyond the lifecycle of an individual Docker container.

The persistent volume is important because workflows, configuration, credentials, and other n8n application data should not rely only on the temporary container filesystem.

### 3. N8n Deployment (Revised)
n8n was deployed using Docker:
Bash
docker run -d --name n8n \
  -p 5678:5678 \
  -e N8N_SECURE_COOKIE=false \
  -e GENERIC_TIMEZONE=Asia/Dubai \
  -e TZ=Asia/Dubai \
  -e N8N_RESTRICT_FILE_ACCESS_TO=/tmp \
  -e NODE_FUNCTION_ALLOW_BUILTIN=fs,child_process \
  -v n8n_data:/home/node/.n8n \
  n8n-custom

| Configuration   | Value             |
| --------------- | ----------------- |
| Container Name  | `n8n`             |
| Local Port      | `5678`            |
| n8n Data Volume | `n8n_data`        |
| Data Mount Path | `/home/node/.n8n` |
| Deployment Type | Local self-hosted |
| Runtime         | Docker            |
| Browser         | Google Chrome     |
| Access Method   | Local HTTP        |


### 4.Local Access
The n8n editor was accessed locally using Google Chrome through:
http://localhost:5678

A local n8n account was created and successfully accessed.
The n8n instance is running locally on the Mac and is not dependent on the n8n Cloud service.

### 5.Loca cookie configration
Because the local n8n instance was accessed through HTTP rather than HTTPS, the following configuration was used:
N8N_SECURE_COOKIE=false

This configuration was used for the local development environment.
For a production deployment exposed to the internet, HTTPS/TLS and secure cookie configuration would be required.

### 6. n8n License
A free n8n license key was applied to the self-hosted n8n instance to unlock eligible licensed features.
The n8n instance continues to run locally through Docker on macOS.
The actual license key is not stored in this repository.

Current Status

✅ Docker Desktop installed
✅ Docker installation verified
✅ Persistent n8n Docker volume created
✅ n8n deployed using Docker
✅ n8n accessible locally
✅ Google Chrome configured for local access
✅ n8n account created
✅ Free n8n license applied
✅ Local self-hosted environment operational

Lessons Learned

* Docker can run n8n without requiring a local Node.js installation.
* Docker provides an isolated and reproducible environment for running applications.
* n8n can be self-hosted locally using Docker.
* Persistent storage should be configured to prevent application data from depending only on the lifecycle of a temporary container.
* The n8n editor can be accessed locally through port 5678.
* localhost refers to the local machine running the n8n instance.
* The N8N_SECURE_COOKIE setting is relevant when running a local instance over HTTP rather than HTTPS.
* License keys and other sensitive configuration should not be committed to a public GitHub repository.
* n8n acts as the orchestration layer for future AI automation projects.

Architecture Summary

The completed environment can be represented a
macOS
  │
  ▼
Docker Desktop
  │
  ▼
Docker Engine
  │
  ▼
n8n Docker Container
  │
  ├── Persistent Volume: n8n_data
  │
  ▼
Local n8n Instance
  │
  ▼
AI Models
  │
  ▼
External Services and Business Systems
