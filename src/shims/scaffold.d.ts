#!/usr/bin/env node

declare module "scaffold-generator" {
  import { render } from "mustache";

  type Render = typeof render;
  class Scaffold {
    constructor(options: {
      data: Record<string, string>;
      render: Render;
      backup?: boolean;
    });
    copy(from: string, to: string): Promise<void>;
  }
  export = Scaffold;
}
