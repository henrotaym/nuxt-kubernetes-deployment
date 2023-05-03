#!/usr/bin/env node

import { resolve } from "path";
import useCurrentPath from "./useCurrentPath";

const useStubsPath = (...paths: string[]) =>
  resolve(useCurrentPath(), "stubs", ...paths);

export default useStubsPath;
