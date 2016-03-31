var webpack = require('webpack');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
var webpack_config = require('./webpack.config.dev');
var express = new require("express");
var config = require("config");
var host = config.get("host");
var port = config.get("port");
var app = new express;

app.use(webpackDevMiddleware(webpack(webpack_config),{
  noInfo: true,
  publicPath: webpack_config.output.publicPath
}));
app.use(webpackHotMiddleware(webpack(webpack_config)));

app.listen(port,"0.0.0.0",function(err){
  if (err) {
    console.error(err);
    return;
  } else {
    console.info("host: %s",this.address().address);
    console.info("listening on port %s", port);
    return;
  }
})

app.get("/",function(req,res) {
  return res.sendFile(__dirname+'/index.html')
})
