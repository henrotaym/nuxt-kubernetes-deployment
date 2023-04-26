#!/usr/bin/env node

"use strict";

import {
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  lstatSync,
  rmSync,
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
  "--key": "{MODULE_NAME}",
  "--variable": "{MODULE_VARIABLE}",
  "--env": "{MODULE_ENVIRONMENT}",
};

const commandParameterNames = Object.keys(parametersMapping);

const [, , ...commandArgs] = argv;

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
const devopsPath = resolve(currentPath, "devops");
const environmentDevopsPath = resolve(devopsPath, environment);

const resetDevopsFolder = () => {
  const [, isExisting] = trying(() => lstatSync(devopsPath).isDirectory());
  if (!isExisting) return mkdirSync(devopsPath);
  trying(() => rmSync(environmentDevopsPath, { recursive: true, force: true }));
};

const generateEnvironmentDevops = (
  currentStubPath = stubsPath,
  currentDevopsPath = environmentDevopsPath
) => {
  const elements = readdirSync(currentStubPath);
  if (!elements.length) return;
  mkdirSync(currentDevopsPath);

  elements.forEach((element) => {
    const elementStubPath = resolve(currentStubPath, element);
    const elementDevopsPath = resolve(
      currentDevopsPath,
      element.replace(".stub", "")
    );
    const isDirectory = lstatSync(elementStubPath).isDirectory();
    if (isDirectory)
      return generateEnvironmentDevops(elementStubPath, elementDevopsPath);

    const content = readFileSync(elementStubPath, {
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

    writeFileSync(elementDevopsPath, replacedContent);
  });
};

resetDevopsFolder();
generateEnvironmentDevops();
