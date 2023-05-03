#!/usr/bin/env node

import { resolve } from "path";

export const getCommandArgs: () => string[] = () => {
  const [, , , ...commandArgs] = process.argv;

  return commandArgs;
};

export const getCommandName: () => string = () => {
  const [, , commandName] = process.argv;

  return commandName;
};

// export const getCurrentPath = (appended?: string) =>
//   resolve(process.cwd(), appended || "");

// export const getStubsPath = (appended?: string) =>
//   resolve(
//     getCurrentPath(),
//     "node_modules",
//     "@henrotaym/salameche",
//     "stubs",
//     appended || ""
//   );

export const getCurrentPath = (...paths: string[]) =>
  resolve(process.cwd(), ...paths);

export const getStubsPath = (...paths: string[]) =>
  resolve(getCurrentPath(), "stubs", ...paths);

export const getValues: (acceptedArgs: string[]) => Record<string, string> = (
  acceptedArgs: string[]
) =>
  getCommandArgs().reduce((values, arg) => {
    const [rawKey, value] = arg.split("=");
    const key = rawKey.replace("--", "");
    const isValid = acceptedArgs.includes(key);
    if (!isValid) throw new Error(`invalid argument ${key}`);
    return {
      ...values,
      [key]: value,
    };
  }, {});
