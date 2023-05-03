#!/usr/bin/env node

const useCommandName: () => string = () => {
  const [, , commandName] = process.argv;

  return commandName;
};

export default useCommandName;
