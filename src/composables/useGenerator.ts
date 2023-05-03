#!/usr/bin/env node

import Scaffold from "scaffold-generator";
import Mustache from "mustache";

// Use {{{{  }}}} as interpolation tag.
Mustache.tags = ["{{{{", "}}}}"];

// Don't escape values.
Mustache.escape = (v) => v;

const useGenerator = (data: Record<string, string>) =>
  new Scaffold({
    data,
    render: Mustache.render,
    backup: false,
  });

export default useGenerator;
