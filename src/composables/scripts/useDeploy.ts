#!/usr/bin/env node

import { useGenerator, useCurrentPath, useStubsPath, usePrompt } from "../";

const useDeploymentPath = (...paths: string[]) =>
  useStubsPath("deployments", ...paths);

const useDeploy = () => {
  const key = usePrompt("App key");
  const cloudflareKey = usePrompt("Cloudflare API key");
  const env = usePrompt("Environment");
  const host = usePrompt("App url");
  const branch = env === "production" ? "main" : "release/v*";

  const generator = useGenerator({ key, cloudflareKey, env, host, branch });

  const useDevopsPath = (...paths: string[]) =>
    useCurrentPath("devops", env, ...paths);

  generator.copy(
    useDeploymentPath(".github", "workflows", "kubernetes-deployment.yml"),
    useCurrentPath(".github", "workflows", `kubernetes-${env}-deployment.yml`)
  );

  generator.copy(useDeploymentPath("docker"), useCurrentPath());

  generator.copy(useDeploymentPath("kubernetes"), useDevopsPath("kubernetes"));

  generator.copy(
    useDeploymentPath("infrastructure"),
    useDevopsPath("infrastructure")
  );
};

export default useDeploy;
