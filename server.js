var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
    }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/














    console.log('含查询字符串的路径\n' + pathWithQuery)

    if (path === '/') {
        let string = fs.readFileSync('./index.html', 'utf8');
        if (request.headers.cookie) {
            let cookie = request.headers.cookie;
            if (cookie.split('=')[0] === 'sign_in_name') {
                let name = cookie.split('=')[1]
                string = string.replace('__personName___', name);
            }
        }
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(string)
        response.end();
    } else if (path === "/src/main.js") {

        let string = fs.readFileSync('./src/main.js', 'utf8');
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
        response.write(string)
        response.end()

    } else if (path === "/sign_up" && method === "POST") {
        readBody(request).then((body) => { //body:name=1&pass=1&confirmPass=1
            let strings = body.split('&');
            let hash = {}
            strings.forEach((string) => {
                let parts = string.split('=')
                let key = parts[0]
                let value = parts[1]
                hash[key] = decodeURIComponent(value)
            })
            let {
                name,
                pass
            } = hash;
            let users = fs.readFileSync('./db', 'utf8');
            users = JSON.parse(users) || [];
            console.log('users/db', users);


            let inUse = false;
            for (let i = 0; i < users.length; i++) {
                let user = users[i]
                if (user.name === name) {
                    inUse = true
                    break;
                }
            }
            response.setHeader('Content-Type', 'text/json;charset=utf-8')
            if (inUse) {
                console.log("sign up repeat");

                response.statusCode = 400;
                response.write(`{"status":"repeat"}`);
            } else {
                users.push({
                    name,
                    pass
                });
                console.log("add new user");
                fs.writeFileSync('./db', JSON.stringify(users));
                response.statusCode = 200;
                response.write(`{"status":"success"}`)
            }
            response.end()
        });
    } else if (path === "/sign_in" && method === "POST") {
        readBody(request).then((body) => {
            let strings = body.split('&');
            let hash = {}
            strings.forEach((string) => {
                let parts = string.split('=')
                let key = parts[0]
                let value = parts[1]
                hash[key] = decodeURIComponent(value)
            })
            let {
                name,
                pass
            } = hash;
            var flag = false;
            let users = fs.readFileSync('./db', 'utf8');
            users = JSON.parse(users) || [];
            for (let i = 0; i < users.length; i++) {
                if (users[i].name === name && users[i].pass === pass) {
                    flag = true
                    break;
                }
            }
            response.setHeader('Content-Type', 'text/json;charset=utf-8');
            if (flag) {
                console.log('sign in success');
                response.setHeader('Set-Cookie', `sign_in_name=${name}`)
                response.statusCode = 200;
                response.write(`{"status":"success"}`);
            } else {
                console.log('sign in error');
                response.statusCode = 401;
                response.write(`{"status":"fail"}`);
            }
            response.end()
        });
    } else if (path === "/src/main.css") {
        let string = fs.readFileSync('./src/main.css', 'utf8');
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/css;charset=utf-8')
        response.write(string)
        response.end()
    } else if (path === "/src/main.js") {
        let string = fs.readFileSync('./src/main.js', 'utf8');
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
        response.write(string)
        response.end()
    } else if (path === "/src/bg.jpg") {
        let string = fs.readFileSync('./src/bg.jpg');
        response.statusCode = 200
        response.setHeader('Content-Type', 'image/jpeg')
        response.write(string)
        response.end()
    } else if (path === "/src/form-bg.jpg") {
        let string = fs.readFileSync('./src/form-bg.jpg');
        response.statusCode = 200
        response.setHeader('Content-Type', 'image/jpeg')
        response.write(string)
        response.end()
    } else if (path === "/src/dj.mp3") {
        let string = fs.readFileSync('./src/dj.mp3');
        response.statusCode = 200
        response.setHeader('Content-Type', 'audio/mp3')
        response.write(string)
        response.end()
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write('呜呜呜')
        response.end()
    }
















    /******** 代码结束，下面不要看 ************/
})

server.listen(port);
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port);

function readBody(request) {
    return new Promise((resolve, reject) => {
        let body = []
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            resolve(body)
        })
    })
}