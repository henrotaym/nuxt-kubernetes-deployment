#!/usr/bin/env node

import {
  getValues,
  createGenerator,
  getCurrentPath,
  getStubsPath,
} from "../utils";

const getDeploymentPath = (...paths: string[]) =>
  getStubsPath("deployments", ...paths);

const deploy = () => {
  const parameters = ["key", "cloudflareKey", "env", "host"];
  const values = getValues(parameters);
  values.branch = values.env === "production" ? "main" : "release/v*";
  const getCurrentEnvPath = (...paths: string[]) =>
    getCurrentPath(values.env, ...paths);

  const generator = createGenerator(values);

  generator.copy(
    getDeploymentPath(".github", "workflows", "kubernetes-deployment.yml"),
    getCurrentPath(
      ".github",
      "workflows",
      `kubernetes-${values.env}-deployment.yml`
    )
  );

  generator.copy(getDeploymentPath("docker"), getCurrentPath());

  generator.copy(
    getDeploymentPath("kubernetes"),
    getCurrentPath(getCurrentEnvPath(), "kubernetes")
  );

  generator.copy(
    getDeploymentPath("infrastructure"),
    getCurrentPath(getCurrentEnvPath(), "infrastructure")
  );
};

export default deploy;
