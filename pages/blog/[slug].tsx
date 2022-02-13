import { useRouter } from "next/router";
import React from "react";
import { getAllPosts, getPostBySlug } from "../../lib/api";
import markdownToHtml from "../../lib/markdownToHtml";

const Blogpost: any = ({ post, morePosts, preview }: any) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    // return <ErrorPage statusCode={404} />;
  }
  console.log(post);

  return (
    <div>
      <h1>Blog Post</h1>
      {JSON.stringify(post)}
    </div>
  );
};

export default Blogpost;

export async function getStaticProps({ params }: any) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
  ]);
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post: any) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
