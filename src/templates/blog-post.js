import React from "react";
import Layout from "../components/layout";

export default function BlogPost(props) {
  console.log(props);
  console.log(props.pageContext.excerpt);
  return (
    <Layout>
      <div
        className="blog-post-container"
        dangerouslySetInnerHTML={{
          __html: props.pageContext.excerpt,
        }}
      ></div>
    </Layout>
  );
}
