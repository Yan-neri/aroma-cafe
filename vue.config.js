const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // Vercel serve o site na RAIZ do domínio -> publicPath '/'.
  // (Se for publicar no GitHub Pages em /<REPO>/, troque para '/<REPO>/' em produção.)
  publicPath: '/'
})
