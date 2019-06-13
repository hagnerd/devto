import * as fm from 'front-matter'
import { DevtoToolbox } from '../devto'

const API_KEY_MESSAGE = `
Before publishing to Dev.to, you'll need an API key.
Go to https://dev.to/api and get an access token.
Once you have your token, enter it below.
TOKEN: 
`

module.exports = {
  name: 'publish',
  description:
    'This command will attempt to post your article to dev.to/api/articles. You will need to be logged in first',
  run: async (toolbox: DevtoToolbox) => {
    const { template, filesystem, prompt, print, devto } = toolbox

    const devtoConfig = await devto.getLocalConfig()

    if (devtoConfig === false) {
      print.error('SOMETHING CRAZY IS HAPPENING')
      return
    }

    // load the post file
    let post = await filesystem.readAsync(`${devtoConfig.path}`)

    if (post === undefined) {
      const result = await prompt.ask({
        type: 'input',
        name: 'filepath',
        message: 'Enter the path to the file'
      })

      if (result && result.filepath) {
        post = await filesystem.readAsync(
          `${filesystem.cwd()}/${result.filepath}`
        )
      }
    }

    // parse the Markdown
    const { attributes, body }: { attributes: any; body: string } = fm(post)

    if (attributes.title === undefined || attributes.title === null) {
      print.error('Please add a title field to your frontmatter and try again')
      return
    }

    if (attributes.published === undefined || attributes.published === false) {
      const result = await prompt.ask({
        type: 'radio',
        name: 'shouldPublish',
        message: 'Would you like to set `published` to true?',
        choices: ['Yes', 'No']
      })

      if (result && result.shouldPublish === 'Yes') {
        if (
          await prompt.confirm(
            'Setting published to true will publish your post immediately'
          )
        ) {
          attributes.published = true
        }
      }
    }

    if ((await devto.getApiKey()) === false) {
      const result = await prompt.ask({
        type: 'input',
        name: 'token',
        message: API_KEY_MESSAGE
      })

      if (result && result.token) {
        await devto.saveApiKey(result.token)
      } else {
        print.error('You didnt provide a token')
        return
      }
    }

    const articleResponse = await devto.postArticle(body, attributes)

    print.success(`Post has successfully been pushed up to Dev.to`)

    print.info('Writing some post metadata for later...')
    await template.generate({
      template: 'post-config.ts.ejs',
      target: `${filesystem.cwd()}/.devto.json`,
      props: {
        id: articleResponse.data.id,
        url: articleResponse.data.url,
        path: devtoConfig.path
      }
    })

    if (attributes.published !== true) {
      print.info('Your article is currently unpublished.')
      print.info(
        'Run devto dashboard to open your dev.to/dashboard in the browser, click on your article, and set published to true'
      )
    }
  }
}
