export interface Image {
  id: number
  name: string
  url: string
  created_time: Date
}

export interface Video {
  id: number
  name: string
  url: string
  duration: number
  created_time: Date
  post: Image
}

export interface BaseInfo {
  id: number
  name: string
  start_time: Date
  blogs_count: number
  comments_count: number
  visits_count: number
  last_modified_time: Date
  head_image: Image
}

export interface Root {
  id: number
  account: string
  password: string
  email: string
}

export interface User {
  id: number
  name: string
  email: string
  created_time: Date
  is_banned: boolean
  is_subscribed: boolean
  comments?: Comment[]
  pays?: Pay[]
  chats?: Chat[]
  avatar: Image
}

export interface UserVisit {
  id: number
  ip: string
  user_agent: string
  visit_time: Date
}

export interface Comment {
  id: number
  comment: string
  created_time: Date
  user_id: number
  shuoshuo_id: number
  personal_id: number
  type: string
}

export interface Blog {
  id: number
  title: string
  content: string
  type: string
  created_time: Date
  last_modified_time: Date
  visited_count: number
  comments_count: number
  pays_count: number
  post: Image
  images?: Image[]
  comments?: Comment[]
}

export interface Shuoshuo {
  id: number
  comments?: Comment[]
  images?: Image[]
  video?: Video
  media_type: 'image' | 'video' | 'text'
  content: string
  created_time: Date
  last_modified_time: Date
  visited_count: number
  comments_count: number
}

export interface Pay {
  id: number
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
}

export interface File {
  id: number
  type: string
  size: number
  url: string
  created_time: Date
  download_count: number
}

export interface Github {
  id: number
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
}

export interface Todolist {
  id: number
  title: string
  created_time: Date
  is_Done: boolean
  is_Done_timeL: boolean
}

export interface Personal {
  id: number
  name: string
  sex: string
  birthday: Date
  wechat: string
  qq: string
  github: string
  university: string
  university_end_time: Date
  home: string
  readme: string
}

export interface Experience {
  id: number
  company: string
  duty: string
  description: string
  time_start: Date
  time_end: Date
}

export interface Project {
  id: number
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
  id: number
  ip: string
  location: string
  created_time: Date
  content: string
  image?: Image
  video?: Video
  file?: File
  type: 'text' | 'image' | 'video' | 'file'
}
