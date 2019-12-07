import React from 'react';
import App, { AppContext, AppInitialProps } from 'next/app';
import postsLoader from '../data/loaders/PostsLoader'

class MyApp extends App {

  static async getInitialProps(context: AppContext): Promise<AppInitialProps> {
    let pageProps = {}

    if (context.Component.getInitialProps) {
        pageProps = await context.Component.getInitialProps(context.ctx)
    }

    const blogPosts = await postsLoader.getPosts()

    const propsObj = Object.assign(
        {},
        { blogPosts, ...pageProps }
    )

    return { pageProps: propsObj }
  }

}

export default MyApp;
