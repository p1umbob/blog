import React from "react";
import { Link } from "gatsby";
import { gradientBlack } from "../styles/variables";

const ListLink = (props) => (
  <li style={{ display: `inline-block`, marginRight: `1rem` }}>
    <Link to={props.to}>{props.children}</Link>
  </li>
);

export default ({ children }) => (
  <div
    className="container"
    style={{
      display: `flex`,
      width: `100%`,
      height: `100vh`,
      backgroundImage: gradientBlack,
      color: "#d0d0d0",
    }}
  >
    <div
      style={{
        margin: `3rem auto`,
        maxWidth: 650,
        padding: `0 1rem`,
      }}
    >
      <header style={{ marginBottom: `1.5rem` }}>
        <Link to="/" style={{ textShadow: `none`, backgroundImage: `none` }}>
          <h3
            style={{
              display: `inline`,
              fontFamily: "Lobster",
              color: "#d0d0d0",
            }}
          >
            Johan Pan
          </h3>
        </Link>
        <ul style={{ listStyle: `none`, float: `right` }}>
          <ListLink to="/">Home</ListLink>
          <ListLink to="/about/">About</ListLink>
          <ListLink to="/contact/">Contact</ListLink>
        </ul>
      </header>
      {children}
    </div>
  </div>
);
