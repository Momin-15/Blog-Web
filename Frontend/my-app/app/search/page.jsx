import SearchForm from "./searchForm";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const initialQuery = params.q || "";
  return <SearchForm key={initialQuery} initialQuery={initialQuery} />;
}
