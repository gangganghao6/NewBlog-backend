export interface Image {
  id: string
  name: string
  url: string
  size: bigint
  createdTime: Date
  videoId?: string
  blogPostId?: string
  blogImagesId?: string
  projectId?: string
  // baseinfo_id?: string
  experienceId?: string
  chatId?: string
  shuoshuoId?: string
  shareFileId?: string
}

export interface Video {
  id: string
  name: string
  url: string
  size: number
  duration: number
  createdTime: Date
  post?: Image
  chatId?: string
  shuoshuoId?: string
  shareFileId?: string
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
  createdTime: Date
  isBanned: boolean
  isSubscribed: boolean
  userVisits: UserVisit[]
  comments?: Comment[]
  chats?: Chat[]
  pays?: Pay[]
}

export interface BaseInfo {
  name: string
  startTime: Date
  blogsCount: number
  commentsCount: number
  visitsCount: number
  lastModifiedTime: Date
  headImage: Image
}

export interface UserVisit {
  id: string
  ip: string
  country?: string
  province?: string
  city?: string
  isp?: string
  url: string
  userAgent: string
  browserName?: string
  browserVersion?: string
  browserMajor?: string
  engineName?: string
  engineVersion?: string
  osName?: string
  osVersion?: string
  deviceVendor?: string
  deviceModel?: string
  deviceType?: string
  cpuArchitecture?: string
  visitTtime: string
  userId?: string
}

export interface Comment {
  id: string
  comment: string
  createdTime: Date
  userId: string
  blogId?: string
  shuoshuoId?: string
  personalId?: string
}

export interface Blog {
  id: string
  title: string
  content: string
  type: string
  createdTime: Date
  lastModifiedTime: Date
  visitedCount: number
  commentsCount: number
  paysCount: number
  post?: Image
  images?: Image[]
  comments?: Comment[]
  pays?: Pay[]
}

export interface Shuoshuo {
  id: string
  // media_class: 'images' | 'video' | 'text'
  content?: string
  createdTime: Date
  lastModifiedTime: Date
  visitedCount: number
  commentsCount: number
  images?: Image[]
  videos?: Video[]
  comments?: Comment[]
}

export interface Pay {
  id: string
  // type: 'blog' | 'personal'
  pay_type: 'alipay' | 'wechat'
  money: number
  orderId: string
  orderUrl: string
  createdTime: Date
  closeTime: Date
  paySuccess: boolean
  isClose: boolean
  user?: User
  userId?: string
  blog?: Blog
  blogId?: string
  personal?: Personal
  personalId?: string
}

export interface File {
  id: string
  name: string
  // type: string
  size: number
  url: string
  createdTime: Date
  chatId?: string
  chat?: Chat
  sharefileId?: string
  shareFile?: ShareFile
}

export interface ShareFile {
  id: string
  type: string
  // media_class: 'images' | 'videos' | 'files'
  createdTime: Date
  downloadCount: number
  files?: File[]
  videos?: Video[]
  images?: Image[]
}

export interface Github {
  id: string
  // readme?: string
  pageUrl: string
  title: string
  description: string
  createdTime: Date
  lastModifiedTime: Date
  languages: string
  starsCount: number
  forksCount: number
  watchersCount: number
  visitedCount: number
}

export interface Todolist {
  id: string
  title: string
  createdTime: Date
  isDone: boolean
  isDoneTime: boolean
}

export interface Personal {
  id: string
  name: string
  sex: string
  birthday: Date
  wechat: string
  qq: string
  githubName: string
  githubUrl: string
  university: string
  universityEndTime?: Date
  home: string
  readme: string
  visitedCount: number
  pays: Pay[]
  commonts: Comment[]
  // experience: Experience[]
  // projects: Project[]
}

export interface Experience {
  id: string
  company: string
  duty: string
  description: string
  timeStart: Date
  timeEnd: Date
  images: Image[]
}

export interface Project {
  id: string
  name: string
  duty: string
  description: string
  timeStart: Date
  timeEnd: Date
  githubUrl: string
  demoUrl: string
  images: Image[]
}

export interface Chat {
  id: string
  ip: string
  location: string
  userId: string
  // user: User
  createdTime: Date
  content?: string
  image?: Image
  video?: Video
  file?: File
  // type: 'text' | 'image' | 'video' | 'file'
}
