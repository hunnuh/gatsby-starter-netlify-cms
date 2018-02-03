import React from "react";
import Link from "gatsby-link";
import Script from "react-load-script";
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'



class IndexPage extends React.Component {
  handleScriptLoad() {
    if (typeof window !== `undefined` && window.netlifyIdentity) {
      window.netlifyIdentity.on("init", user => {
        if (!user) {
          window.netlifyIdentity.on("login", () => {
            document.location.href = "/admin/";
          });
        }
      });
    }
    window.netlifyIdentity.init();
  }

  componentDidMount(){
    this.props.allPostsQuery.refetch()
  }



  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;
    let queryreturn = false;
    if (typeof(window) !== 'undefined') {
      queryreturn = this.props.allPostsQuery.allPosts ? this.props.allPostsQuery.allPosts : null
    }
    return (
      <section className="section">
        <Script
          url="https://identity.netlify.com/v1/netlify-identity-widget.js"
          onLoad={() => this.handleScriptLoad()}
        />
        <div className="container">
          <div>{queryreturn ? `${queryreturn[0].id}` : "Loading..." }</div>
          <div className="content">
            <h1 className="has-text-weight-bold is-size-2">Latest Stories</h1>
          </div>
          {posts
            .filter(post => post.node.frontmatter.templateKey === "blog-post")
            .map(({ node: post }) => (
              <div
                className="content"
                style={{ border: "1px solid #eaecee", padding: "2em 4em" }}
                key={post.id}
              >
                <p>
                  <Link className="has-text-primary" to={post.frontmatter.path}>
                    {post.frontmatter.title}
                  </Link>
                  <span> &bull; </span>
                  <small>{post.frontmatter.date}</small>
                </p>
                <p>
                  {post.excerpt}
                  <br />
                  <br />
                  <Link className="button is-small" to={post.frontmatter.path}>
                    Keep Reading →
                  </Link>
                </p>
              </div>
            ))}
        </div>
      </section>
    );
  }
}



let exportedIndexPage;

if (typeof(window) === 'undefined') {
  exportedIndexPage = IndexPage;
}
else {
  const ALL_POSTS_QUERY = gql`
    query AllPostsQuery {
      allPosts(orderBy: createdAt_DESC) {
        id
        imageUrl
        description
      }
    }
  `
  const IndexPageWithQuery = graphql(ALL_POSTS_QUERY, {
    name: 'allPostsQuery',
    options: {
      fetchPolicy: 'network-only',
    },
  })(IndexPage)

  exportedIndexPage = IndexPageWithQuery;
}


export default exportedIndexPage;




export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
  }
`;
