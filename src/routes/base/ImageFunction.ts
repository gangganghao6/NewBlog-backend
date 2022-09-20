import { Image } from '../../types/model'

export async function createImage(
  image: any,
  { type, data, id }: { type: string; data: any; id: number }
): Promise<Image> {
  return image.create({
    data: {
      name: data.name,
      url: data.url,
      [`${type}_id`]: id
    }
  })
}

export async function getImage(
  image: any,
  { type, id }: { type: string; id: number }
): Promise<Image> {
  return image.findFirst({
    where: {
      [`${type}_id`]: id
    },
    select: {
      id: true,
      name: true,
      url: true,
      created_time: true
    }
  })
}

export async function getImages(
  image: any,
  { type, id }: { type: string; id: number }
): Promise<Image> {
  return image.findMany({
    where: {
      [`${type}_id`]: id
    }
  })
}

export async function deleteImage(
  image: any,
  {
    type,
    id
  }: {
    type: string
    id: number
  }
): Promise<boolean> {
  const temp = await image.deleteMany({
    where: {
      [`${type}_id`]: id
    }
  })
  return temp.count > 0
}
