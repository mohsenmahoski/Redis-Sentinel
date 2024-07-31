
interface IProps {
    params: {
      slug: string[];
    };
}

export default async function IsrPage({ params: { slug } } : IProps) {
    const path = slug.join("/");
    return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <h1>{path}</h1>
    </main>
  );
}
