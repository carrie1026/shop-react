const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config.babel')
const open = require('open')
const fs = require('fs')
const express = require('express')
const os = require('os')
var path = require('path')
const app = new express()
const port = 8888;
const compiler = webpack(config)
const publicPath = config.output.publicPath
app.use(webpackDevMiddleware(compiler, {
    noInfo: true, 
    publicPath: publicPath,
    stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: false,
          chunkModules: false,
          modules: false
        }
}))
app.use(webpackHotMiddleware(compiler))

const mockApiPath = '/mapi/v2/';
const mockApiPath2 = '/api/v1/'
const mockFn = apiPath => (req, res) => {
    const fileName = req.path.replace(apiPath,'').replace(/\//g,'_');

    const ext = path.extname(fileName) || '.json'
    const file = path.join(__dirname, '/mock-api/', /png|jpg|gif/.test(ext) ? '/images/' : '', path.basename(fileName,ext) + ext)
    const fileExists = fs.existsSync(file);
    if(fileExists){
        res.status(200).sendFile(file);  
    }else{
        res.status(404).send(`{"error" : "${file} not found"}`); 
    } 
}
app.all(mockApiPath + '*', mockFn(mockApiPath))
app.all(mockApiPath2 + '*', mockFn(mockApiPath2))

app.get("*", function(req, res) {
  const index = fs.readFileSync(`${__dirname}/src/index.html`)
                .toString()
                .replace('</body>','    <script src="/static/bundle.js"><\/script>\r\n</body>');
  res.send(index);
});

// serve our static stuff like index.css
app.use(express.static(__dirname + publicPath));


const iptable= [],
ifaces = os.networkInterfaces();
Object.keys(ifaces).forEach(dev=>{
    ifaces[dev].forEach(details=>{
        if (details.family=='IPv4') {
            iptable.push(details.address);
        }
    })
});

app.listen(port,function(){
        console.info(`==> Listening on port ${port}. Open up http://localhost:${port} in your browser.`);
        console.info(`==> or http://${iptable[0]}:${port}`);
        console.info(`==> or http://${iptable[1]}:${port}`);
        open(`http://localhost:${port}`)
})