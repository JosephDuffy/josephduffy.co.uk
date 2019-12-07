const glob = require('glob')
const path = require('path')

module.exports = ({
  webpack: function(config) {
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
      paths[`/posts/${slug}`] = { page: '/posts/post', query: { slug } };
    });

    return paths
  }
});
