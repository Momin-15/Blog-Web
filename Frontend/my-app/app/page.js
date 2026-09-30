import Feed from "@/components/feed";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const dynamic = "force-dynamic";

async function getInitialFeed() {
  try {
    const response = await fetch(`${API_URL}/posts?page=1&limit=10`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        posts: [],
        hasMore: false,
        error: `The backend returned HTTP ${response.status}.`,
      };
    }

    const data = await response.json();

    return {
      posts: data.posts,
      hasMore: data.hasMore,
      error: null,
    };
  } catch (error) {
    console.error("Failed to load the homepage feed:", error);

    return {
      posts: [],
      hasMore: false,
      error: "Could not connect to the backend. Make sure it is running.",
    };
  }
}

export default async function Home() {
  const { posts, hasMore, error } = await getInitialFeed();

  return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <section className="mb-10 border-b border-line pb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-sage">
            BlogApp
          </p>
          <h1 className="mt-3 font-display text-4xl text-forest">
            Stories worth staying for.
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed text-ink/80">
            Read thoughtful posts from writers in the community.
          </p>
        </section>

        <section aria-labelledby="latest-posts-heading">
          <h2
            id="latest-posts-heading"
            className="mb-6 font-display text-2xl text-forest"
          >
            Latest posts
          </h2>

          {error ? (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              {error}
            </p>
          ) : (
            <Feed initialPosts={posts} initialHasMore={hasMore} />
          )}
        </section>
      </main>
  );
}
