interface IProps {
  params: {
    slug: string[];
  };
}
export const generateStaticParams = async () => {
  return [];
};

export default async function IsrPage({ params: { slug } }: IProps) {
  console.log(slug);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{slug.join("/")}</h1>
    </main>
  );
}
