import { GluegunToolbox } from 'gluegun'
import { AxiosResponse } from 'axios'

interface LocalConfig {
  id: number
  url: string
  path: string
}

interface FrontMatterInput {
  title: string
  description?: string
  published?: boolean
  tags?: string
  series?: string
  published_under_org?: boolean
  main_image?: string
  cannonical_url?: string
}

interface Article {
  body_markdown: string
}

interface Post {
  article: {
    title: string
    description?: string
    published?: boolean
    tags?: string[]
    series?: string
    published_under_org?: boolean
    main_image?: string
    cannonical_url?: string
  } & Article
}

interface User {
  name: string
  username: string
  twitter_username: string | null
  github_username: string | null
  website_url: string | null
  profile_image: string | null
  profile_image_90: string | null
}

interface CreateArticleSuccess {
  type_of: 'article'
  id: number
  title: string
  description: string
  cover_image: string | null
  readable_publish_date: null
  social_image: string
  tag_list: string
  tags: string[]
  slug: string
  path: string
  url: string
  canonical_url: string
  comments_count: number
  positive_reactions_count: number
  created_at: string
  edited_at: string | null
  crossposted_at: string | null
  published_at: string | null
  last_comment_at: string | null
  body_html: string
  ltag_style: []
  ltag_script: []
  user: User
}

interface ResError {
  error: string
  status: number
}

interface DevExtensions {
  getApiKey: () => Promise<string | false>
  readApiKey: () => Promise<string | false>
  saveApiKey: (key: string) => Promise<void>
  resetApiKey: () => Promise<void>
  slugifyTitle: (title: string) => string
  getLocalConfig: () => Promise<LocalConfig | false>
  createPost: (body: string, frontMatter: FrontMatterInput) => Post
  postArticle: (
    body: string,
    frontMatter: FrontMatterInput
  ) => Promise<AxiosResponse<CreateArticleSuccess>>
}

interface DevtoToolbox extends GluegunToolbox {
  devto: DevExtensions
}

export {
  LocalConfig,
  FrontMatterInput,
  Article,
  Post,
  User,
  CreateArticleSuccess,
  DevtoToolbox,
  DevExtensions,
  ResError
}
