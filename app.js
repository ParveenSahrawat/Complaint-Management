const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
// const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
// const ejs = require('ejs');
// const upload = multer({dest : './public/photo-storage'});

require('./passport')(passport)

mongoose.connect('mongodb://elevenx:elevenx18@ds213612.mlab.com:13612/complaint-management', 
  {
    // retry to connect for 60 times
    reconnectTries : 60,
    // wait for 2 second before retrying
    reconnectInterval : 1000
  },
  (error, data) => {
    if (error) {
      console.log('Failed in connecting to database');
      throw error;
    } else {
      console.log('Database connection succesfull');
    }
  }
)

const index = require('./routes/index');
const users = require('./routes/users');
const auth = require('./routes/auth')(passport);
// const complaint = require('./routes/complaints');

var app = express();
// const port = process.env.PORT || 3000;
// app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
// app.use(upload.array());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/configuration', express.static(__dirname + '/config'));
app.use(session({
  secret: 'thesecret',
  saveUninitialized: true,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
// app.use('/complaints', complaint);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(app.get('port'), (error, result) => {
//   if(error){
//     console.log('Failed in creating server');
//   } else {
//     console.log(`Server is running on port ${app.get('port')}`);
//   }
// })
module.exports = app;