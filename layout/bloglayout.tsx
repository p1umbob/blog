import Link from "next/link";
import React from "react";
import { gradientBlack } from "../styles/variables";

export const Layout = ({ children }) => (
  <div
    className="container"
    style={{
      backgroundImage: gradientBlack,
    }}
  >
    <div
      style={{
        margin: "3rem auto",
        maxWidth: 650,
        padding: "0 1rem",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          minWidth: "800px",
          paddingBottom: "2rem",
        }}
      >
        <Link href="/" passHref>
          <h3 className={"navbar-title"}> Hydroforas </h3>
        </Link>
        <ul style={{ listStyle: "none", float: "right", margin: "0" }}>
          <Link href="/" passHref>
            <span className="navbar-item"> Home </span>
          </Link>
          <Link href="/about/" passHref>
            <span className="navbar-item"> About </span>
          </Link>
          <Link href="/contact/" passHref>
            <span className="navbar-item"> Contact </span>
          </Link>
        </ul>
      </header>
      {children}
    </div>
  </div>
);
