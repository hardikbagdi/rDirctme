var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var newrelic = require('newrelic');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var routes = require('./routes/index');
var favicon = require('serve-favicon');
var app = express();

// view engine setup - NOT USED CURRENTLY
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//route to handle index.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


//restApi route
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(err,req, res, next) {
  // var err = new Error('Not Found');
  // err.status = 404;
  if(err.status!==404){
    next(err);
  }
  res.sendFile(__dirname + '/public/error.html');
});

// error handlers

// development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res) {
//     // res.status(err.status || 500);
//     // res.render('error', {
//     //   message: err.message,
//     //   error: err
//     // });
//   console.log('error occured')
// //  res.sendFile(__dirname + '/public/error.html');
// //   });
// // }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res) {
//   console.log('error occuered')
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;