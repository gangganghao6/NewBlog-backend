export interface Md5CheckRequest {
    originalName: string
    fileType: string
    fileSuffix: string
    size: number
    mediaType: string
}
export interface Md5CheckReturn {
    name:string
    originalName: string
    fileType: string
    fileSuffix: string
    size: number
    url: string
    mediaType: string
    duration?: number
}

export interface FilesChunkRequest {
    totalSlicesNum: number
    currentSlicesNum: number
}
export interface FilesChunkReturn {
    totalSlicesNum: number
    currentSlicesNum: number
}
export interface FilesMergeRequest {
    fileType: string
    mediaType: string
    originalName: string
    fileSuffix: string
    size: number
}
export interface FilesMergeReturn {
    name: string
    fileType: string
    mediaType: string
    originalName: string
    fileSuffix: string
    size: number
    url: string
    duration?: number
}