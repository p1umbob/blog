import Link from "next/link";

function Posts({ posts }: any) {
  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>
          <Link
            href={{
              pathname: "/blog/[slug]",
              query: { slug: post.slug },
            }}
          >
            <a>{post.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Posts;
