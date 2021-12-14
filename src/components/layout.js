import React from "react";
import { Link } from "gatsby";
import { gradientBlack } from "../styles/variables";
import "../styles/components/layout.scss";

const ListLink = (props) => (
  <li style={{ display: "inline-block", margin: "0 1rem 0 0" }}>
    <Link to={props.to}>{props.children}</Link>
  </li>
);

export default ({ children }) => (
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
        <Link to="/" style={{ textShadow: "none", backgroundImage: "none" }}>
          <h3 className={"navbar-title"}>Hydroforas</h3>
        </Link>
        <ul style={{ listStyle: "none", float: "right", margin: "0" }}>
          <ListLink to="/">
            <span className="navbar-item">Home</span>
          </ListLink>
          <ListLink to="/about/">
            <span className="navbar-item">About</span>
          </ListLink>
          <ListLink to="/contact/">
            <span className="navbar-item">Contact</span>
          </ListLink>
        </ul>
      </header>
      {children}
    </div>
  </div>
);
