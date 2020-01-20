import React from "react";
import App from "next/app";
import { Tina, TinaCMS } from "tinacms";
import { GitClient } from "@tinacms/git-client";
import { useEffect } from "react";

class MyApp extends App {
  constructor() {
    super();
    this.cms = new TinaCMS();
  }

  render() {
    return <_App cms={this.cms} {...this.props} />;
  }
}
export default MyApp;

const _App = props => {
  const options = {
    sidebar: {
      hidden: process.env.NODE_ENV === "production"
    }
  };
  useEffect(() => {
    const { protocol, hostname, port } = window.location;
    const baseUrl = `${protocol}//${hostname}${
      port != "80" ? `:${port}` : ""
    }/___tina`;

    const client = new GitClient(baseUrl);

    props.cms.registerApi("git", client);
  }, []);

  const { Component, pageProps } = props;
  return (
    <Tina cms={props.cms} {...options.sidebar}>
      <Component {...pageProps} />
    </Tina>
  );
};
