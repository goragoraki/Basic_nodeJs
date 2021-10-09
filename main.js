var http = require('http');
var url = require('url')
var fs = require('fs');
var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query; // 쿼리 분석
    var title = queryData.id
    console.log(queryData)
    if (_url == '/') {
        title = 'Welcome';
    }
    if (_url == '/favicon.ico') {
        return response.writeHead(404);
    }
    response.writeHead(200);
    var template = `
    <!doctype html>
    <html>
    <head>
        <title>WEB1 - ${title}</title>
        <meta charset = "utf-8">
    </head>
    <body>
        <h1><a href = "/">WEB</a></h1>
        <ol>
            <li><a href = "/?id=html">html</a></li>
            <li><a href = "/?id=css">css</a></li>
            <li><a href = "/?id=javascript">javascript</a></li>
        </ol>
        <h2>${title}</h2>
        <p>
        welcome website
        </p>
    </body>
    </html>`
    response.end(template)
});
app.listen(3000);