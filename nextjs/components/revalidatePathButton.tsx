"use client"

import { revalidateByPathAction } from "@/actions";

interface IProps {
  path: string;
}
const RevalidatePathButton = ({ path }: IProps) => {
  const handeRevalidate = async () => {
    revalidateByPathAction(path);
  }
  return (
    <button className="bg-green-500 p-5" onClick={handeRevalidate}>REVALIDATE</button>
  )
}

export default RevalidatePathButton