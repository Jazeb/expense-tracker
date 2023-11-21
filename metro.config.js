const path = require("path");

module.exports = {
  resolver: {
    extraNodeModules: {
      assets: path.resolve(__dirname, "assets"),
    },
  },
  watchFolders: [path.resolve(__dirname, "assets")],
};
