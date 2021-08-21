const pkg = require("./package.json");
module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/rpf/vw.scss";`,
      },
      postcss: {
        plugins: [
          require("autoprefixer"),
          require("./src/rpf/postcss-auto-bg-plugin"),
        ],
      },
    },
  },
};
