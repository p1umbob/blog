import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import img from "../public/qun.png";

export const Layout = ({ children }: any) => (
  <div className="container mx-auto px-[5vw] max-w-screen-xl">
    <Head>
      <meta name="referrer" content="no-referrer" />
    </Head>
    <div
      className="mb-32"
    // style={{
    //   margin: "3rem auto",
    //   maxWidth: 650,
    //   padding: "0 1rem",
    // }}
    >
      <header
        className="flex justify-between items-center my-10 h-52 bg-no-repeat bg-center"
      // style={{
      //   display: "flex",
      //   flexDirection: "row",
      //   justifyContent: "space-between",
      //   alignItems: "center",
      //   minWidth: "800px",
      //   paddingBottom: "2rem",
      // }}
      >
        <div className="logo ml-8 flex justify-start items-center cursor-pointer transition-transform hover:scale-125 hover:skew-y-12 hover:-rotate-12">
          <Link href="/" passHref>
            <Image
              loader={({ src }) => {
                return `https://fulgari.github.io/${src}`;
              }}
              src="fulgari.png"
              alt="Fulgari"
              width={128}
              height={128}
            />
          </Link>
          {/* <Link href="/">
            <a className="navbar-title font-sans cursor-pointer text-black text-xl ml-5">
              Πάν
            </a>
          </Link> */}
          {/* <div className={"navbar-desc"} style={{ color: "#d0d0d0" }}>
            hydroforas
          </div> */}
        </div>
        <ul className="list-none float-right mr-8">
          <Link href="/" passHref>
            <span className="navbar-item mx-8 cursor-pointer text-gray-400 hover:text-black uppercase font-light">
              Home
            </span>
          </Link>
          <Link href="/about/" passHref>
            <span className="navbar-item mx-8 cursor-pointer text-gray-400 hover:text-black uppercase font-light">
              About
            </span>
          </Link>
          <Link href="/contact/" passHref>
            <span className="navbar-item mx-8 cursor-pointer text-gray-400 hover:text-black uppercase font-light">
              Contact
            </span>
          </Link>
        </ul>
      </header>
      {children}
    </div>
  </div>
);
