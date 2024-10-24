'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidateByTagAction(tag: string) {
  revalidateTag(tag)
}

export async function revalidateByPathAction(path: string) {
  revalidatePath(path)
}