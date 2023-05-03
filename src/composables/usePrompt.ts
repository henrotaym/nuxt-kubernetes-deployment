import promptConfigurator from "prompt-sync";

const usePrompt = (asking: string) =>
  promptConfigurator({ sigint: true })(`${asking} : `);

export default usePrompt;
