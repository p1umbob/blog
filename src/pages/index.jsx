import { Link, graphql } from "gatsby";
import React from "react";
import { css } from "@emotion/react";
import "../styles/components/index.css";
import Layout from "../components/layout";

export default ({ data }) => {
  console.log(data);
  return (
    <Layout>
      <p>
        Personal blog by <a href={"https://github.com/pzij"}>Johan Pan</a>.
      </p>
      <p>I learn and share.</p>
      <h4 style={{ color: "#d0d0d0" }}>
        {data.allMarkdownRemark.totalCount} Posts
      </h4>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div className="blogpost-wrap" key={node.id}>
          <Link
            className="blogpost-link"
            to={node.fields.slug}
            css={css`
              text-decoration: none;
              color: inherit;
            `}
          >
            <h3>
              {node.frontmatter.title} <span>— {node.frontmatter.date}</span>
            </h3>
          </Link>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`;
