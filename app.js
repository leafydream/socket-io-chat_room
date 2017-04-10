var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var socketIO = require('socket.io');

var handlebars = require('express3-handlebars').create({
    defaultLayout:"main",
    extname: '.html'
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));

//设置handlebars模板引擎
app.engine("html",handlebars.engine);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var server = app.listen(7000,function () {
   console.log('Listen port: 7000');
});

var io = socketIO(server);
io.on('connection',function (socket) {
    console.log("已经建立连接...");
    socket.on('disconnect',function () {
        console.log('已经断开连接...');
    });
    socket.on('message',function (message) {
        console.log(message);
        io.emit('message',message)
    });
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
