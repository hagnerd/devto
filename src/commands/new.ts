import { DevtoToolbox } from '../devto'

const NEXT_STEPS = (target: string) => `
CD into ${target}.
Write your blog post.
Run 'devto publish'
Run 'devto dashboard' to see your post in the browser
`

module.exports = {
  name: 'new',
  description:
    'Creates a new folder, and markdown file with all possible compatible frontmatter for Dev.to',
  run: async (toolbox: DevtoToolbox) => {
    const { parameters, prompt, template, print, filesystem, devto } = toolbox

    let input = parameters.array

    if (input.length > 1) {
      print.error('Please enter your title within quotation marks')
      return
    }

    let title = parameters.first

    if (!title) {
      let result = await prompt.ask({
        type: 'input',
        name: 'title',
        message: 'Enter the title of your new article'
      })

      if (result && result.title) {
        title = result.title
      }
    }

    if (!title) {
      print.error("You didn't enter a title for your article :(")
      return
    }

    let slugged = devto.slugifyTitle(title)
    let target = `${filesystem.cwd()}/${slugged}/${slugged}.md`

    await template.generate({
      template: 'default.ts.ejs',
      target,
      props: { title }
    })

    // Create .gitignore file with .devto ignored
    await template.generate({
      template: 'gitignore.ts.ejs',
      target: `${filesystem.cwd()}/${slugged}/.gitignore`
    })

    // Create .devto file
    // Add path to md file in .devto
    await template.generate({
      template: 'post-config.ts.ejs',
      target: `${filesystem.cwd()}/${slugged}/.devto.json`,
      props: { path: target, id: null, url: null }
    })

    print.success(`A new post was created at ${target}`)
    print.info(NEXT_STEPS(`${slugged}`))
  }
}
