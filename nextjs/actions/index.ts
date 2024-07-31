'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidateByTagAction(tag: string) {
  revalidateTag(tag)
}

export async function revalidateByPath(path: string) {
  revalidatePath(path)
}