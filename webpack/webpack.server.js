const path = require('path');

const CURRENT_WORKING_DIR = process.cwd();

module.exports = {
  target: 'node',
  mode: 'none',
  optimization: {
    minimize: false
  },
  entry: path.join(CURRENT_WORKING_DIR, 'app/server-renderer.js'),
  output: {
    path: path.join(CURRENT_WORKING_DIR, 'dist'),
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss|sass)$/,
        use: 'null-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)(\?.*)?$/,
        use: 'null-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.html'],
    alias: {
      app: path.join(CURRENT_WORKING_DIR, 'app')
    }
  }
};
