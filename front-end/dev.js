require('marko/node-require').install(); //I need this to render the page correctly, don't know why

var fs = require('fs');
var path = require('path');
var lasso = require('lasso');
const http = require('http');
var url = require('url');
var template = require('marko').load(require.resolve('./src/templates/template.marko'));
const { networkInterfaces } = require('os');
const del = require('del');

let PORT = 8080;

lasso.configure('lasso-config.json');

var buildDir = path.join(__dirname, 'dist');

try {
    del.sync([buildDir]);
}
catch(e) {
    console.log(e);
}

try {
    fs.mkdirSync(buildDir);
} catch (e) { }

var outputHtmlFile = path.join(buildDir, 'index.html');

var out = fs.createWriteStream(outputHtmlFile, { encoding: 'utf8' })
.on('close', function () {
    console.log(`HTML page successfully written to "${outputHtmlFile}"!`);
});

template.render({}, out).then(()=>{
    const app = http.createServer((req, res) => {
        let filepath = url.parse(req.url).pathname||"index.html";

        if (filepath === '\\' || filepath === '/' || filepath === '') {
            filepath = "index.html";
        }

        fs.readFile(path.join(buildDir, filepath), (err, data) => {
            res.end(data);
        });
    });

    app.listen(PORT, () => {
        process.send('online');
        console.log("Server listening at:");
        console.log("http://127.0.0.1:"+PORT)
        print_local_ip(PORT);
    });
});

function print_local_ip(port) {
    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                console.log("http://"+net.address + ":" + port);
            }
        }
    }
}