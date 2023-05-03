#!/usr/bin/env node

import { resolve } from "path";

const useCurrentPath = (...paths: string[]) => resolve(process.cwd(), ...paths);

export default useCurrentPath;
