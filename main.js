const express = require('express');
const fs = require('fs');
const template = require('./lib/template.js')
const app = express();
const qs = require('querystring')

app.get('/', (req, res) => {
    fs.readdir('./data', function (err, filelist) {
        title = 'Welcome'
        description = 'hello world web'
        
        var list = template.list(filelist)
        var html = template.html(title, list, `<h2>${title}</h2><p>${description}</p>`, '<a href = "/create">create</a>')
        
        res.send(html)
    });
})

app.get('/page/:pageId/', (req, res) => {
    fs.readdir('./data', function (err, filelist) {
        fs.readFile(`data/${req.params.pageId}`, `utf-8`, function (err, description) {
            var title = req.params.pageId
            var list = template.list(filelist)
            var html = template.html(title, list, `<h2>${title}</h2><p>${description}</p>`, `
            <p>
            <a href = "/create">create</a>
            <a href = "/update/${title}">update</a>
            <form action = "/delete_process" method = "post">
                <input type = "hidden" name = "id" value = "${title}">
                <input type = "submit" value = "delete">
            </form>`);
            res.send(html);
        });
    });
});

app.get('/create', (req, res) => {
    fs.readdir('./data', (err, filelist) => {
        var title = 'create';
        var list = template.list(filelist);
        var html = template.html(title, list, `
        <form action = "/process_create" method = "post">
        <p><input type = "text" name = title placeholder = "title"></p>
        <p><textarea name = description placeholder = "description"></textarea></p>
        <p><input type = "submit"></p>
        </form>
        `,'<a href = "/update">update</a>');
        res.send(html)
    })
})

app.post('/process_create', (req, res) => {
    var body = '';
    req.on('data', (data) => {
        body += data;
    });

    req.on('end', () => {
        var post = qs.parse(body)
        var title = post.title;
        var description = post.description;
        fs.writeFile(`./data/${title}`, description, (err) => {
            res.redirect(`/page/${title}`);
        })
    })
})

app.get(`/update/:pageId`, (req, res) => {
    fs.readdir('./data', (err, filelist) => {
        fs.readFile(`./data/${req.params.pageId}`, 'utf-8', (err, description) => {
            var title = "Update";
            var id = req.params.pageId;
            var list = template.list(filelist);
            var html = template.html(title, list, `
            <form action = "/process_update" method = "post">
                <input type = "hidden" name = "id" value = "${id}">
                <p><input type = "text" name = "title" value = "${id}"></p>
                <p><textarea name = "description" >${description}</textarea></p>
                <p><input type = "submit"></p>
            </form>
            `
            , `<a href = "/create">create</a>`)
            res.send(html);
        })
    })
})

app.post(`/process_update`, (req, res) => {
    var body = '';
    req.on('data', (data) => {
        body += data;
    })

    req.on('end', () => {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;

        fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
            fs.writeFile(`./data/${title}`, description, 'utf-8', (err) => {
                res.redirect(`/page/${title}`)
            })
        })
    })
})

app.listen(3000, () => {
    console.log("listening on port 3000");
});

/*var http = require('http');
var url = require('url')
var fs = require('fs'); // 파일 읽기, 쓰기
var qs = require('querystring')
var template = require('./lib/template.js')

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
                
                var list = template.list(filelist)
                var html = template.html(title, list, `<h2>${title}</h2><p>${description}</p>`, '<a href = "/create">create</a>')
                
                response.writeHead(200);
                response.end(html);
            });
        } else {
            fs.readdir('./data', function (err, filelist) {
                fs.readFile(`data/${queryData.id}`, `utf-8`, function (err, description) {
                    var list = template.list(filelist)
                    var html = template.html(title, list, `<h2>${title}</h2><p>${description}</p>`, `
                    <p>
                    <a href = "/create">create</a>
                    <a href = "/update?id=${queryData.id}">update</a>
                    <form action = "/delete_process" method = "post">
                        <input type = "hidden" name = "id" value = "${title}">
                        <input type = "submit" value = "delete">
                    </form>`)  
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (pathname === '/create') {
        fs.readdir(`./data`, function (err, filelist) {
            var title = `Create`
            var list = template.list(filelist);
            var html = template.html(title, list, `
            <form action = "/process_create" method= "post">
            <p><input type = "text" name = "title" placeholder="title"></p>
            <p><textarea name = "description" placeholder="description"></textarea></p>
            <p><input type = "submit"></p>
            </form>
            `,'')
            response.writeHead(200);
            response.end(html)
        })
    } else if (pathname === `/process_create`) {
        var body = '';
        request.on('data', function (data) {
            body += data;

            if (body.length > 1e6)
                request.connection.destroy();
            // 데이터가 너무 클 경우 연결을 끊음
        }); // data가 클경우를 대비 조각조각 내서 콜백함수 실행하여 data를 받아온후 end콜백을 호출

        request.on('end', function () {
            var post = qs.parse(body) // post 객체 생성
            var title = post.title;
            var description = post.description;
            fs.writeFile(`./data/${title}`, description, `utf-8`, function(err){
                response.writeHead(302, {Location:`/?id=${title}`});
                response.end();
            })  
        })  
    } else if (pathname === '/update') {
        fs.readdir(`./data`, function (err, filelist) {
            fs.readFile(`./data/${queryData.id}`, 'utf-8', function (err, description) {
                var title = 'Update';
                var list = template.list(filelist);
                var html = template.html(title, list, `
                <form action = '/process_update' method = "post">
                <p><input type ="hidden" name = "id" value ="${queryData.id}"></p>
                <p><input type ="text" name = "title" value="${queryData.id}"></p>
                <p><textarea name = "description">${description}</textarea></p>
                <p><input type ="submit"></p>
                </form>
                `,'<a href = "/create">create</a>')
                response.writeHead(200);
                response.end(html);
            })
        })
    } else if (pathname === '/process_update') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            
            fs.rename(`./data/${post.id}`, `./data/${title}`, function (err) {
                fs.writeFile(`./data/${title}`, description,'utf-8' ,function (err) {
                    response.writeHead(302, { Location: `/?id=${post.id}` })
                    response.end();
                })
            })
        })
    } else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        })
        request.on('end', function (err) {
            var post = qs.parse(body);
            fs.unlink(`./data/${post.id}`, function (err) {
                response.writeHead(302, { Location: '/' });
                response.end();
            });
        });
    }else {
        response.writeHead(404);
        response.end('not found');
    }
});
app.listen(3000);*/