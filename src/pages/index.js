import React from "react";
import Link from "gatsby-link";
import Script from "react-load-script";
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import styles from "./index.module.css";


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
    let queryreturn = false;
    if (typeof(window) !== 'undefined') {
      queryreturn = this.props.allPostsQuery.allPosts ? this.props.allPostsQuery.allPosts : null
    }
    return (
      <section className="dib w-100">
        <Script
          url="https://identity.netlify.com/v1/netlify-identity-widget.js"
          onLoad={() => this.handleScriptLoad()}
        />
        <div className="cover bg-left bg-center-l bg-navy dib w-100 flex flex-column justify-center" style={{backgroundImage: `url("../img/wdch_bg.jpg")`}}>
          <div className="w-50-l center pb5 pb6-m pb5-l dib">
            <div className="tc-l mt5 ph3">
              <h1 className= {`f4 f3-l fw2 white-90 mb0 lh-title ${styles.headline}`}>Search Thousands of Union Friendly businesses, products, and services.</h1>
              <div className="bg-navy br3 h3 mv3"/>
            </div>
          </div>
        </div>
        <div>{queryreturn ? `${queryreturn[0].id}` : "Loading..." }</div>
          <div className="content">
            <h1 className="has-text-weight-bold is-size-2 bg-red">Latest Stories</h1>
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
