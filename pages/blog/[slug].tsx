import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Layout } from "../../layout/layout";
import { getAllPosts, getPostBySlug } from "../../lib/api";
import markdownToHtml from "../../lib/markdownToHtml";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
const Blogpost: any = ({ post, morePosts, preview }: any) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    // return <ErrorPage statusCode={404} />;
  }
  console.log(post);
  useEffect(() => {
    hljs.initHighlighting();
  }, []);
  return (
    <Layout>
      <h1
        className="text-3xl flex justify-center items-center underline"
        style={{
          textDecorationColor:
            "#" + Math.floor(Math.random() * 16777215).toString(16),
        }}
      >
        {post.title}
      </h1>
      {/* <BlockContent blocks={post.content} /> */}
      <div
        className="blog-post-container"
        dangerouslySetInnerHTML={{
          __html: post.content,
        }}
      ></div>
    </Layout>
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
