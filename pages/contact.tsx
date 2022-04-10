import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "../layout/layout";

const Contact: any = ({ allPosts }: any) => {
  return (
    <Layout>
      <title>Contact | J.P.</title>

      <section className="my-5">
        <p>
          Github: <a href={"https://github.com/pzij"}>Johnny Pan</a>
        </p>
      </section>
    </Layout>
  );
};

export default Contact;
