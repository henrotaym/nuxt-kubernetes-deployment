#!/usr/bin/env node

declare module "scaffold-generator" {
  interface Options {
    data: Record<string, string>;
    render(template: string, view: string): string;
    backup: boolean;
  }

  class Scaffold {
    constructor(options: Options);
    copy(from: string, to: string): Promise<void>;
  }

  export default Scaffold;
}
