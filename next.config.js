const glob = require('glob')
const path = require('path')

module.exports = ({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
  exportPathMap: async function() {
    const paths = {
      '/': { page : '/'},
    }

    const posts = glob.sync('data/posts/*.md')

    const postSlugs = posts.map(post => path.basename(post, path.extname(post)))

    postSlugs.forEach(slug => {
      paths[`/posts/${slug}`] = { page: '/posts/[slug]', query: { slug } };
    });

    return paths
  },
  useFileSystemPublicRoutes: false,
});
