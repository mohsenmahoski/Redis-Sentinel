"use client"

import { revalidateByTagAction } from "@/actions";

interface IProps {
  tag: string;
}
const RevalidateTagButton = ({ tag }: IProps) => {
  const handeRevalidate = async () => {
    revalidateByTagAction(tag);
  }
  return (
    <button className="bg-blue-500 p-5" onClick={handeRevalidate}>REVALIDATE</button>
  )
}

export default RevalidateTagButton