
import { GluegunToolbox } from 'gluegun'


module.exports = {
  name: 'devto',
  run: async (toolbox: GluegunToolbox) => {
    const { print } = toolbox

    print.info('A nifty little tool to make setting up a post, and publishing to Dev.to even easier');
  },
}
