import Image from "next/image";
import Link from "next/link";
import React from "react";
import img from "../public/qun.png";

export const Layout = ({ children }: any) => (
  <div className="container mx-auto">
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
        <div className="logo ml-8 flex justify-start items-center cursor-pointer">
          <Link href="/" passHref>
            <Image
              loader={({ src }) => {
                return `https://pzij.github.io/${src}`;
              }}
              src="qun.png"
              alt="Jun"
              width={72}
              height={72}
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
