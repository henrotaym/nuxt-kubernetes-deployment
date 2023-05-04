#!/usr/bin/env node

import { resolve } from "path";
import useCurrentPath from "./useCurrentPath";

const useStubsPath = (...paths: string[]) =>
  resolve(
    useCurrentPath(),
    "node_modules",
    "@henrotaym",
    "nuxt-kubernetes-deployment",
    "stubs",
    ...paths
  );

export default useStubsPath;
