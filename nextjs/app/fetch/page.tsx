import RevalidateTagButton from "@/components/revalidateTagButton";

const tag = "user-tag";
declare interface IUser {
  username: string;
  job: string;
  bio: string;
}

export default async function SsrPage() {
  const response = await fetch("http://localhost:5000", {
    next: { tags: [tag] },
  });
  const user = (await response.json()) as IUser;
  const timestamp = +new Date();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-96  flex flex-col gap-4 bg-slate-400 p-5 rounded-md">
        <span>
          <b>username</b>: {user.username}
        </span>
        <span>
          <b>job</b>: {user.job}
        </span>
        <span>
          <b>bio</b>: {user.bio}
        </span>
        <span>time: {timestamp}</span>
        <RevalidateTagButton tag={tag} />
      </div>
    </main>
  );
}
