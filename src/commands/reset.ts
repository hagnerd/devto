import { GluegunToolbox } from 'gluegun'
const CONFIRM_MESSAGE = 'Are you sure you want to reset your Dev.to API Key?';

module.exports = {
  name: 'reset',
  run: async (toolbox: GluegunToolbox) => {
    const { prompt, print, devto } = toolbox;

    if (await prompt.confirm(CONFIRM_MESSAGE)) {
      // delete the API key
      await devto.resetApiKey();
      print.info('Successfully deleted your Dev.to API key.');
    }
  }
}
