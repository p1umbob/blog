import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "../layout/layout";
import styles from "../styles/Home.module.css";
import { getAllPosts } from "../lib/api";

const Home: any = ({ allPosts }: any) => {
  console.log(allPosts);

  return (
    <Layout>
      <section className="my-5">
        <p>
          Personal blog by <a href={"https://github.com/pzij"}>Johnny Pan</a>.
        </p>
        <p>I learn and share.</p>
      </section>
      <h4 className="text-slate-300 my-5">{allPosts.length} Posts</h4>
      {allPosts.map((post: any) => (
        <div className="blogpost-wrap my-5 text-xl" key={post.slug}>
          <Link href={`blog/${post.slug}`}>
            <a className="underline decoration-solid decoration-pink-500/50">
              {post.title} <span>— {post.date}</span>
            </a>
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
