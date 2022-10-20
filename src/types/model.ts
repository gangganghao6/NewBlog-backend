export interface Image {
  size: number
  id: string
  name: string
  url: string
  created_time: Date
  video_id?: string
  baseinfo_id?: string
  blogpost_id?: string
  project_id?: string
  experience_id?: string
  chat_id?: string
  shuoshuo_id?: string
  blogimages_id?: string
  sharefile_id?: string
}

export interface Video {
  id: string
  name: string
  url: string
  size: number
  duration: number
  created_time: Date
  post: Image
}

export interface BaseInfo {
  id: string
  name: string
  start_time: Date
  blogs_count: number
  comments_count: number
  visits_count: number
  last_modified_time: Date
  head_image: Image
}

export interface Root {
  id: string
  account: string
  password: string
  email: string
}

export interface User {
  id: string
  name: string
  email: string
  created_time: Date
  is_banned: boolean
  is_subscribed: boolean
  comments?: Comment[]
  pays?: Pay[]
  chats?: Chat[]
  user_visit: UserVisit[]
}

export interface UserVisit {
  id: string
  ip: string
  country?: string
  province?: string
  city?: string
  isp?: string
  url: string
  user_agent: string
  browser_name?: string
  browser_version?: string
  browser_major?: string
  engine_name?: string
  engine_version?: string
  os_name?: string
  os_version?: string
  device_vendor?: string
  device_model?: string
  device_type?: string
  cpu_architecture?: string
  visit_time: string
  user_id?: string
}

export interface Comment {
  id: string
  comment: string
  created_time: Date
  user_id: string
  shuoshuo_id?: string
  personal_id?: string
  blog_id?: string
}

export interface Blog {
  id: string
  title: string
  content: string
  type: string
  created_time: Date
  last_modified_time: Date
  visited_count: number
  comments_count: number
  pays_count: number
  post?: Image
  images?: Image[]
  comments?: Comment[]
}

export interface Shuoshuo {
  id: string
  comments?: Comment[]
  images?: Image[]
  video?: Video
  media_class: 'images' | 'video' | 'text'
  content?: string
  created_time: Date
  last_modified_time: Date
  visited_count: number
  comments_count: number
}

export interface Pay {
  id: string
  pay_type: 'alipay' | 'wechat'
  money: number
  order_id: string
  order_url: string
  created_time: Date
  close_time: Date
  pay_success: boolean
  is_close: boolean
  type: 'blog' | 'personal'
  user: User
  user_id?: string
  blog_id?: string
}

export interface File {
  id: string
  type: string
  size: number
  url: string
  created_time: Date
  chat_id: string
  sharefile_id: string
}

export interface ShareFile {
  id: string
  type: string
  media_class: 'images' | 'videos' | 'files'
  created_time: Date
  download_count: number
}

export interface Github {
  id: string
  readme: string
  page_url: string
  title: string
  description: string
  created_time: Date
  last_modified_time: Date
  languages: string
  stars_count: number
  forks_count: number
  watchers_count: number
  visited_count: number
}

export interface Todolist {
  id: string
  title: string
  created_time: Date
  is_done: boolean
  is_done_time: boolean
}

export interface Personal {
  id: string
  name: string
  sex: string
  birthday: Date
  wechat: string
  qq: string
  github: string
  university: string
  university_end_time?: Date
  home: string
  readme: string
  pays: Pay[]
  experience: Experience[]
  projects: Project[]
}

export interface Experience {
  id: string
  company: string
  duty: string
  description: string
  time_start: Date
  time_end: Date
  image: Image
}

export interface Project {
  id: string
  name: string
  duty: string
  description: string
  time_start: Date
  time_end: Date
  github_url: string
  demo_url: string
  image: Image
}

export interface Chat {
  id: string
  user_id: string
  ip: string
  location: string
  created_time: Date
  content?: string
  image?: Image
  video?: Video
  file?: File
  type: 'text' | 'image' | 'video' | 'file'
}
