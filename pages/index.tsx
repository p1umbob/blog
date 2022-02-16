import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "../layout/bloglayout";
import styles from "../styles/Home.module.css";
import { getAllPosts } from "../lib/api";

const Home: any = ({ allPosts }) => {
  return (
    <Layout>
      <p>
        Personal blog by <a href={"https://github.com/pzij"}>Johan Pan</a>.
      </p>
      <p>I learn and share.</p>
      <h4 style={{ color: "#d0d0d0" }}>{allPosts.length} Posts</h4>
      {allPosts.map((post: any) => (
        <div className="blogpost-wrap" key={post.slug}>
          <Link href={`/blog/${post.slug}`} passHref>
            <div>
              <h3
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                  textDecorationColor: "#e97d8c",
                }}
              >
                {post.title} <span>— {post.date}</span>
              </h3>
              <p style={{ fontWeight: "normal", fontSize: "14px" }}>
                {post.excerpt}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </Layout>
  );
};

export default Home;

export async function getStaticProps() {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);

  return {
    props: { allPosts },
  };
}
