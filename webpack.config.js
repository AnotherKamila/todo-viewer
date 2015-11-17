require('es6-promise').polyfill();
module.exports = {
	devtool: "source-map",
    entry: "./main.jsx",
    output: {
    	path: __dirname+"/public",
        filename: "bundle.js"
    },
    resolve: {
    	extensions: ["", ".jsx", ".js"],
    	modulesDirectories: ["node_modules"]
  	},
    module: {
        loaders: [
            {test: /\.jsx$/, loader: "jsx-loader?insertPragma=React.DOM"},
            {test: /\.sass$/, loaders: ["style", "css?sourceMap", "sass?indentedSyntax,sourceMap"]},
            {test: /\.(ico|gif|png|jpg|svg)$/, loader: 'url?limit=50000&name=resources/images/[name].[ext]&mimeType=image/[ext]'}
        ]
    }
};
