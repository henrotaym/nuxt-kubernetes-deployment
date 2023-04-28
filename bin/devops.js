#!/usr/bin/env node

"use strict";

import {
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  lstatSync,
} from "fs";
import { resolve } from "path";
import { argv } from "process";

const trying = (expected) => {
  try {
    return [null, expected()];
  } catch (error) {
    return [error, null];
  }
};

const parametersMapping = {
  "--key": "{APP_KEY}",
  "--cloudflare-key": "{CLOUDFLARE_API_KEY}",
  "--env": "{APP_ENV}",
};

const commandParameterNames = Object.keys(parametersMapping);

const [, , commandName, ...commandArgs] = argv;

const valuesMapping = commandArgs.reduce((valuesMapping, commandArg) => {
  const [key, value] = commandArg.split("=");
  return {
    ...valuesMapping,
    [key]: value,
  };
}, {});

const environment = valuesMapping["--env"] || "production";

const currentPath = resolve(process.cwd());

const stubsPath = resolve(
  currentPath,
  "node_modules",
  "@henrotaym/nuxt-kubernetes-deployment",
  "stubs"
);

const makeSureFolderExist = (path) => {
  const [, isExisting] = trying(() => lstatSync(path).isDirectory());
  if (!isExisting) return mkdirSync(path);
};

const resolveOrCreate = (...paths) => {
  const [firstPath, ...newPaths] = paths;
  makeSureFolderExist(firstPath);
  if (paths.length === 1) return resolve(firstPath);
  newPaths[0] = resolve(firstPath, newPaths[0]);
  resolveOrCreate(newPaths);
};

const replaceFileContent = (stubPath, realPath) => {
  const content = readFileSync(stubPath, {
    encoding: "utf8",
    flag: "r",
  });

  const replacedContent = commandParameterNames.reduce(
    (replacedContent, parameter) => {
      const { [parameter]: value } = valuesMapping;
      if (!value) return replacedContent;
      const { [parameter]: key } = parametersMapping;
      return replacedContent.replace(new RegExp(key, "g"), value);
    },
    content
  );

  writeFileSync(realPath, replacedContent);
};

const generateFilesRecursively = (currentStubPath, currentRealPath) => {
  const [, isFile] = trying(() => lstatSync(currentStubPath).isFile());

  if (isFile) return replaceFileContent(currentStubPath, currentRealPath);

  const elements = readdirSync(currentStubPath);
  if (!elements.length) return;

  elements.forEach((element) => {
    const elementStubPath = resolve(currentStubPath, element);
    const elementRealPath = resolve(currentRealPath, element);
    generateFilesRecursively(elementStubPath, elementRealPath);
  });
};

const generateDeployment = (env) => {
  const deploymentStubPath = resolve(stubsPath, "deployments");
  parametersMapping["--branch"] = "{BRANCH_NAME}";
  valuesMapping["--branch"] = env === "production" ? "main" : "release/v*";

  // GITHUB ACTIONS
  generateFilesRecursively(
    resolve(deploymentStubPath, ".github/workflows/kubernetes-deployment.yml"),
    resolveOrCreate(
      currentPath,
      ".github/workflows",
      `kubernetes-${env}-deployment`
    )
  );

  // INFRASTRUCTURE FOLDER
  generateFilesRecursively(
    resolve(deploymentStubPath, "infrastructure"),
    resolveOrCreate(currentPath, "deployments", env, "infrastructure")
  );

  // INFRASTRUCTURE FOLDER
  generateFilesRecursively(
    resolve(deploymentStubPath, "kubernetes"),
    resolveOrCreate(currentPath, "deployments", env, "kubernetes")
  );

  // DOCKER FILE
  generateFilesRecursively(
    resolve(deploymentStubPath, "docker"),
    resolveOrCreate(currentPath)
  );
};

if (commandName === "deployment") return generateDeployment(environment);
