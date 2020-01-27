const log = require('log-timestamp');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router("./db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 5000;

/* 서비스키 인증, 확인 없으면 오류 */
server.use(middlewares);
server.use((req, res, next) => {
    if (req && req.headers && req.headers['authorization'] && req.headers['authorization'].length > 0) {
        console.log(`req.headers['authorization']: ${req.headers['authorization']}`);
        next();
    } else {
        res.jsonp({
            fualt_response: {
                errorCode: 401,
                errorMessage: "Unauthorized",
                timestamp: Date.now(),            
                messageId: "S0001"
            }
        });
        res.sendStatus(401);
    }
});

server.use(jsonServer.rewriter({
    '*': '/users'
}));

// url에 맞는 부분으로 함수로 이동하기
server.use(jsonServer.bodyParser);
server.post('/users', (req, res, next) => {
    console.log(req.query);
    res.jsonp(req.body);
});

/* Use default router */
server.use(router);
server.listen(port, () => {
    console.log('JSON Server is running... (exit:Ctrl + C)');
});