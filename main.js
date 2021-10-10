var http = require('http');
var url = require('url')
var fs = require('fs'); // 파일 읽기

function templateHTML(title, list, body) {
    return `
    <!doctype html>
    <html>
    <head>
        <title>WEB1 - ${title}</title>
        <meta charset = "utf-">
    </head>
    <body>
        <h1><a href = "/">WEB</a></h1>
        ${list}
        <a href = "/create">create</a>
        ${body}
    </body>
    </html>
    `;
}

function makeLIST(filelist) {
    var list = '<ul>'
    for (var i = 0; i < filelist.length; i++) {
        list += `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`
        }
    list += '</ul>'
    return list
}

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
                
                var list = makeLIST(filelist)
                var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`)
                
                response.writeHead(200);
                response.end(template);
            });
        } else {
            fs.readdir('./data', function (err, filelist) {
                fs.readFile(`data/${queryData.id}`, `utf-8`, function (err, description) {
                    var list = makeLIST(filelist)
                    var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`)
                    
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    } else if (pathname === '/create') {
        fs.readdir(`./data`, function (err, filelist) {
            var title = `Create`
            var description = `create something`

            var list = makeLIST(filelist);
            var template = templateHTML(title, list, `
            <form action = "http://localhost:3000/process_create" method= "post">
            <p><input type = "text" name = "title" placeholder="title"></p>
            <p><textarea name = "description" placeholder="description"></textarea></p>
            <p><input type = "submit"></p>
            </form>
            `)
            response.writeHead(200);
            response.end(template)
        })
    } else {
        response.writeHead(404);
        response.end('not found')
    }

});
app.listen(3000);