import Link from "next/link";
import React from "react";

export const Layout = ({ children }: any) => (
  <div className="container mx-auto">
    <div
      className=""
      // style={{
      //   margin: "3rem auto",
      //   maxWidth: 650,
      //   padding: "0 1rem",
      // }}
    >
      <header
        className="flex justify-between items-center my-10 h-52 bg-gradient-to-r from-gray-500 to-white-500 bg-no-repeat bg-center"
        // style={{
        //   display: "flex",
        //   flexDirection: "row",
        //   justifyContent: "space-between",
        //   alignItems: "center",
        //   minWidth: "800px",
        //   paddingBottom: "2rem",
        // }}
      >
        <div className="logo">
          <Link href="/">
            <a className="navbar-title font-serif cursor-pointer text-white ml-10 text-xl">
              Πάν
            </a>
          </Link>
          {/* <div className={"navbar-desc"} style={{ color: "#d0d0d0" }}>
            hydroforas
          </div> */}
        </div>
        <ul style={{ listStyle: "none", float: "right", margin: "0" }}>
          <Link href="/" passHref>
            <span
              className="navbar-item"
              style={{ margin: "0 12px", cursor: "pointer" }}
            >
              Home
            </span>
          </Link>
          <Link href="/about/" passHref>
            <span
              className="navbar-item"
              style={{ margin: "0 12px", cursor: "pointer" }}
            >
              About
            </span>
          </Link>
          <Link href="/contact/" passHref>
            <span
              className="navbar-item"
              style={{ margin: "0 12px", cursor: "pointer" }}
            >
              Contact
            </span>
          </Link>
        </ul>
      </header>
      {children}
    </div>
  </div>
);