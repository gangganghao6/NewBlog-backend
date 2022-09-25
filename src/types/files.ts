export interface Files_chunk {
  uuid: string
  total_slices: number
  current_slices: number
  file_type: string
  media_class: string
  file_slices: Buffer
}
