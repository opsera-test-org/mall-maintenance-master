# Opsera Code-to-Cloud - mall-maintenance

This directory contains all infrastructure-as-code configurations for deploying the mall-maintenance application using Opsera's Code-to-Cloud Enterprise platform.

## 📁 Directory Structure

```
.opsera-mall-maintenance/
├── opsera-config.yaml          # Single source of truth configuration
├── k8s/                        # Kubernetes manifests
│   ├── base/                   # Base manifests (shared)
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── ingress.yaml
│   │   └── kustomization.yaml
│   └── overlays/               # Environment-specific configs
│       └── dev/
│           └── kustomization.yaml
└── argocd/                     # ArgoCD applications
    └── dev/
        └── application.yaml
```

## 🚀 Quick Start

### 1. Configure GitHub Secrets

Before running any workflows, configure these secrets in your GitHub repository:

```bash
# Navigate to: Settings → Secrets and variables → Actions → New repository secret
```

**Required Secrets:**

| Secret Name | Description | Example/Notes |
|-------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | AWS access key | For ECR and AWS operations |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | For ECR and AWS operations |
| `GH_PAT` | GitHub Personal Access Token | Must have `repo` and `workflow` scopes |
| `KUBECONFIG_HUB` | Hub cluster kubeconfig (base64) | ArgoCD cluster config |
| `KUBECONFIG_SPOKE` | Spoke cluster kubeconfig (base64) | Application deployment cluster |

**To encode kubeconfig files:**
```bash
cat ~/.kube/config-hub | base64 | tr -d '\n'
cat ~/.kube/config-spoke | base64 | tr -d '\n'
```

### 2. Run Bootstrap Workflow (REQUIRED FIRST STEP)

The bootstrap workflow creates all necessary infrastructure:

```bash
# Using GitHub CLI
gh workflow run bootstrap-infrastructure-mall-maintenance.yaml

# Or via GitHub UI
# Actions → Bootstrap Infrastructure - mall-maintenance → Run workflow
```

**Bootstrap Creates:**
- ✅ ECR repository for container images
- ✅ Kubernetes namespace: `opsera-mall-maintenance-dev`
- ✅ ECR pull secret in namespace
- ✅ ArgoCD repository registration
- ✅ ArgoCD application for continuous deployment

### 3. Deploy Application

After bootstrap completes successfully, trigger the first deployment:

```bash
# Deployment happens automatically on push to main branch
git push origin main

# Or manually trigger:
gh workflow run ci-build-push-mall-maintenance-dev.yaml
```

## 🔄 CI/CD Pipeline

The CI/CD pipeline consists of 8 stages:

1. **Security Scan** - Gitleaks secret scanning
2. **Build & Push** - Docker build + Grype vulnerability scan + ECR push
3. **Update Manifests** - Update Kustomize image tags
4. **Refresh ECR Secret** - Refresh ECR pull credentials (12h expiry)
5. **Sync ArgoCD** - Trigger ArgoCD application sync
6. **Verify Deployment** - Health checks via port-forward
7. **Deployment Summary** - Generate deployment report
8. **Deployment Landscape** - Update dashboard (optional)

## 🔍 Troubleshooting

### Run Diagnostics

```bash
gh workflow run diagnostics-mall-maintenance.yaml \
  --field environment=dev \
  --field check_argocd=true \
  --field check_pods=true \
  --field check_events=true
```

### Common Issues

#### ImagePullBackOff
- **Cause**: ECR pull secret expired (12-hour token lifetime)
- **Fix**: Re-run CI/CD workflow to refresh secret

#### CrashLoopBackOff
- **Cause**: Application startup failure
- **Check**: Pod logs via diagnostics workflow
- **Debug**: Health check at `/` on port 8080

#### ArgoCD Out of Sync
- **Cause**: Manual changes or sync conflicts
- **Fix**: Visit ArgoCD UI and force sync
- **URL**: https://argocd-usw2.agent.opsera.dev

#### Ingress Not Working
- **Check**: Ingress controller is running
- **Verify**: DNS points to load balancer
- **Test**: `curl http://mall-maintenance-dev.agent.opsera.dev`

## 🌐 Access Points

### Development Environment

- **Application**: http://mall-maintenance-dev.agent.opsera.dev
- **ArgoCD Dashboard**: https://argocd-usw2.agent.opsera.dev
- **Namespace**: `opsera-mall-maintenance-dev`
- **Cluster**: `opsera-usw2-np` (spoke)

## 📊 Configuration Details

### Image Configuration

- **ECR Repository**: `mall-maintenance`
- **Image Tag Format**: `dev-{short-sha}-{timestamp}`
- **Example**: `dev-e7fb71a2-20260207172734`
- **Tag Policy**: Immutable (RULE 175)

### Container Configuration

- **Base Image**: `nginxinc/nginx-unprivileged:alpine`
- **Container Port**: 8080 (non-root requirement)
- **Health Check**: `/` (SPA root path)
- **Resources**:
  - Requests: 100m CPU, 128Mi memory
  - Limits: 200m CPU, 256Mi memory

### Security

- **runAsNonRoot**: `true`
- **runAsUser**: `101` (nginx user)
- **allowPrivilegeEscalation**: `false`
- **Capabilities**: All dropped

## 📝 Architecture Rules

This deployment follows Opsera's production-tested deployment rules:

- **RULE 74**: Non-root nginx on port 8080
- **RULE 79**: SPA health check at `/`
- **RULE 127**: Bootstrap must run before CI/CD
- **RULE 149**: Use `destination.name` for ArgoCD
- **RULE 168**: Health checks via port-forward
- **RULE 175**: Immutable ECR image tags

## 🔐 Security & Compliance

### Security Scanning

- **Gitleaks**: Secret detection in source code
- **Grype**: Container vulnerability scanning
- **Policy**: Fail on HIGH severity vulnerabilities

### Container Security

- Non-root user (nginx:101)
- Read-only root filesystem capability
- Minimal attack surface with Alpine base
- No privilege escalation allowed

## 🛠️ Maintenance

### Refresh ECR Credentials

ECR tokens expire after 12 hours. The CI/CD pipeline automatically refreshes them, but you can manually refresh:

```bash
# Automatically handled by CI/CD workflow
# Or run diagnostics to check secret age
gh workflow run diagnostics-mall-maintenance.yaml
```

### Force ArgoCD Sync

```bash
# Via kubectl (if you have hub cluster access)
kubectl patch application mall-maintenance-dev -n argocd \
  --type merge \
  -p '{"operation": {"sync": {"revision": "main"}}}'

# Or via ArgoCD UI
# Visit: https://argocd-usw2.agent.opsera.dev
```

### Update Infrastructure

To modify infrastructure settings:

1. Edit `opsera-config.yaml`
2. Update corresponding K8s manifests in `k8s/base/` or `k8s/overlays/dev/`
3. Commit and push changes
4. ArgoCD will auto-sync the changes

## 📚 Additional Resources

- **Opsera Documentation**: https://docs.opsera.io
- **ArgoCD Documentation**: https://argo-cd.readthedocs.io
- **Kustomize Reference**: https://kubectl.docs.kubernetes.io/references/kustomize/

---

*Generated by Opsera Code-to-Cloud Enterprise v0.922*
*Powered by Claude Sonnet 4.5*
