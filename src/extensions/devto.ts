import { GluegunToolbox } from 'gluegun'
import {
  LocalConfig,
  FrontMatterInput,
  Post,
  DevExtensions,
  CreateArticleSuccess
} from '../devto'
import axios, { AxiosResponse } from 'axios'

module.exports = (toolbox: GluegunToolbox) => {
  const { filesystem } = toolbox

  const DEV_TO_CONFIG = `${filesystem.homedir()}/.devto/config`

  let devtoKey: string | false = false

  async function getApiKey(): Promise<string | false> {
    if (devtoKey) {
      return devtoKey
    }

    devtoKey = await readApiKey()

    return devtoKey
  }

  async function readApiKey(): Promise<string | false> {
    return (
      filesystem.exists(DEV_TO_CONFIG) && filesystem.readAsync(DEV_TO_CONFIG)
    )
  }

  async function saveApiKey(key: string): Promise<void> {
    return filesystem.writeAsync(DEV_TO_CONFIG, key)
  }

  async function resetApiKey(): Promise<void> {
    await filesystem.removeAsync(DEV_TO_CONFIG)
  }

  function slugifyTitle(title: string): string {
    return title.includes(' ')
      ? title
          .toLowerCase()
          .replace(/['\-\.,]*/g, '')
          .split(' ')
          .join('-')
      : title.toLowerCase()
  }

  async function getLocalConfig(): Promise<LocalConfig | false> {
    const path = `${filesystem.cwd()}/.devto.js`
    return filesystem.exists(path) && filesystem.readAsync(path, 'json')
  }

  function createPost(body: string, frontMatter: FrontMatterInput): Post {
    return {
      article: {
        ...frontMatter,
        title: frontMatter.title,
        tags: (frontMatter.tags || '').split(', ').map((p: string) => p.trim()),
        body_markdown: body
      }
    }
  }

  async function postArticle(
    body: string,
    frontMatter: FrontMatterInput
  ): Promise<AxiosResponse<CreateArticleSuccess>> {
    const post = createPost(body, frontMatter)
    const token = await devto.getApiKey()

    return axios.post('https://dev.to/api/articles', post, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': token
      }
    })
  }

  const devto: DevExtensions = {
    getApiKey,
    readApiKey,
    saveApiKey,
    resetApiKey,
    slugifyTitle,
    getLocalConfig,
    createPost,
    postArticle
  }

  toolbox.devto = devto
}
