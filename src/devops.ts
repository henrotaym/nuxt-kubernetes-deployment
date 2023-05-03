#!/usr/bin/env node

import { generateDeploy } from "./scripts";
import { getCommandName } from "./utils";

const generate = () => {
  const name = getCommandName();

  if (name === "deploy") generateDeploy();
};

export { generate };
