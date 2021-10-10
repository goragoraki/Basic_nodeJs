var http = require('http');
var url = require('url')
var fs = require('fs'); // 파일 읽기
var app = http.createServer(function (request, response) {
    var _url = request.url;

    var queryData = url.parse(_url, true).query; // 쿼리 분석
    var title = queryData.id

    var pathname = url.parse(_url, true).pathname;
    // pathname : 쿼리를 제외한 주소
    
    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function (err, filelist) {
                title = 'Welcome'
                description = 'hello world web'
                var list = '<ul>'
                for (var i = 0; i < filelist.length; i++) {
                    list += `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`
                }
                list += '</ul>'
                var template = `
                <!doctype html>
                <html>
                <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset = "utf-">
                </head>
                <body>
                    <h1><a href = "/">WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    <p>
                    ${description}
                    </p>
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            });
        } else {
            fs.readdir('./data', function (err, filelist) {
                var list = '<ul>'
                for (var i = 0; i < filelist.length; i++) {
                    list += `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`
                }
                list += '</ul>'
                fs.readFile(`data/${queryData.id}`, `utf-8`, function (err, description) {
                    var template = `
                <!doctype html>
                <html>
                <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset = "utf-8">
                </head>
                <body>
                    <h1><a href = "/">WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    <p>
                    ${description}
                    </p>
                </body>
                </html>
                `;
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    } else {
        response.writeHead(404);
        response.end('not found')
    }

});
app.listen(3000);