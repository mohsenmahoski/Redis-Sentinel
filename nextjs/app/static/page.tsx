import RevalidatePathButton from "@/components/revalidatePathButton";

export default function StaticPage() {
  const time = +Date.now();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-44 h-44 flex flex-col items-center">
      <h1>{time}</h1>
      <RevalidatePathButton path="/static" />
      </div>
    </main>
  );
}
