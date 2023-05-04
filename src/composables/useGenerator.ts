#!/usr/bin/env node

import Scaffold from "scaffold-generator";
import Mustache from "mustache";

// Use {{{{  }}}} as interpolation tag.
Mustache.tags = ["{{{{", "}}}}"];

// Don't escape values.
Mustache.escape = (v) => v;

// Add gitignore to interpolation data.
const useGenerator = (data: Record<string, string>) =>
  new Scaffold({
    data: { ...data, gitignore: ".gitignore" },
    render: Mustache.render,
    backup: false,
  });

export default useGenerator;
