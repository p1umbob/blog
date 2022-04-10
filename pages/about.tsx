import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "../layout/layout";

const About: any = ({ allPosts }: any) => {
  return (
    <Layout>
      <section className="my-5">
        <p>
          Hi, I am <a href={"https://github.com/pzij"}>Johnny Pan</a> from
          China, currently (2022) working as a web developer at Trip.com.
        </p>
        <br />
        <p>
          I am interested in design and web development, rich-text editor and
          web graphics.
        </p>
        <br />
        <p>
          I also enjoy spending my time with my guitar, my skateboard and my
          PS4.
        </p>
      </section>
    </Layout>
  );
};

export default About;
