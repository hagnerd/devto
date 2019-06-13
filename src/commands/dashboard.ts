import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'dashboard',
  description: "Quick access to your dashboard",
  run: async (toolbox: GluegunToolbox) => {
    const { print } = toolbox;
    const open = require('open');
    print.success('Opening in the browser');
    open("https://dev.to/dashboard");
  }
}
