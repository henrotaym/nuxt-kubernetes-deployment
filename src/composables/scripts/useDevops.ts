#!/usr/bin/env node

import { useCommandName, useDeploy } from "../";

const useDevops = () => {
  const name = useCommandName();

  if (name === "deploy") return useDeploy();
};

export default useDevops;
