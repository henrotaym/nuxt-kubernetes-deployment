# Deployment setup

## Terraform cloud

### Register workspace
- Create [{{{{key}}}} workspace](https://app.terraform.io/app/deegital/workspaces/new)
- Add `trustup_io_app_key` variable with `{{{{key}}}}` value to your [workspace variables](https://app.terraform.io/app/deegital/workspaces/{{{{key}}}}/variables)

### Create infrastructure
In your ``infrastructure`` folder run
```shell
terraform init && terraform apply
```

## Configure kubectl
``` shell
doctl kubernetes clusters list
```
``` shell
doctl kubernetes cluster kubeconfig save cluster_id
```

## Configure github secrets

### Create environments
You should configure ``{{{{env}}}}`` environments](https://github.com/deegitalbe/{{{{key}}}}/settings/environments) for your repository

### Save doctl cluster id to desired environment
```shell
DIGITALOCEAN_KUBERNETES_CLUSTER_ID=cluster_id
```

## Configure kubernetes cluster
In your ``kubernetes`` folder run
``` shell
kubectl create namespace traefik && kubectl create namespace app
```

### Traefik
``` shell
kubens traefik && kubectl apply -f traefik/cloudflare-secret.yml && helm repo add traefik https://helm.traefik.io/traefik && helm repo update && helm install traefik traefik/traefik --values=traefik/traefik-values.yml
```

### Register your domain to cloudflare
Get load balancer external IP address
``` shell
kubectl get all
```

Add a [DNS record](https://dash.cloudflare.com/) pointing to the external IP of your load balancer.

### Apply app configuration
``` shell
kubens app && kubectl apply -f app --recursive
```

### Reloader
``` shell
kubens default && kubectl apply -f https://raw.githubusercontent.com/stakater/Reloader/master/deployments/kubernetes/reloader.yaml
```
