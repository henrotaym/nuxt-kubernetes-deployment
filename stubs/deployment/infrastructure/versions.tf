terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.11"
    }
  }
  cloud {
    organization = "deegital"

    workspaces {
      name = "{APP_KEY}"
    }
  }
}