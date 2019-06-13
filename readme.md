# devto CLI

A simple CLI for posting to dev.to. This tool was inspired by [Dev.to VSCode Extension](https://github.com/timdeschryver/new-blog-post) made by Tim Deschryver.

## Who is it for?

Do you like to write articles? Are you a programmer? Do you want to make it dead simple to write and post to dev.to?

Then either the VSCode Extension, or this CLI will help you out!

## Commands

### @hagnerd/devto new [TITLE]

Generates a new blog post, which consists of a folder, a markdown file, and a .devto.json file which will be gitignored by default. This will contain the post id, url, and the path to the file to make publishing more ergonomic.

If you pass a title, make sure to wrap it in strings. If you do not pass a title, you will be prompted for one, in which case you do not need to wrap it in strings.

I know, not great, but this is a quick prototype and unfortunately this was the easiest way to get it to work.

### @hagnerd/devto publish

If you are in a directory that has a .devto.json file with a valid path to a markdown file with at least a title field in the frontmatter, then it will attempt to push the article up to dev.to

It will prompt you for a dev.to API key the first time you publish and article, and after that it will save a global config with the key to a .devto file in your home directory. Make sure to globally ignore it in git if you are concerned with your API key getting out.

If you are NOT in a directory that has a .devto.json file or there isn't a valid path, you will be prompted to provide a relative path to a file that meets those requirements.

### @hagnerd/devto dashboard

This command opens up dev.to/dashboard in your default browser.

### @hagnerd/devto reset

Deletes your global config file (located at .devto in your home directory). The next time you attempt to publish an article, it will re-prompt you for your API key.

## Publishing to NPM

To package your CLI up for NPM, do this:

```shell
$ npm login
$ npm whoami
$ npm lint
$ npm test
(if typescript, run `npm run build` here)
$ npm publish
```

# License

MIT - see LICENSE
