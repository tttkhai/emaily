const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
require('./db/db')(mongoose);
require('./models/User');
require('./models/Survey');
require('./services/passport');

const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
      maxAge: 30*24*60*60*1000,
      keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) =>{
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index'));
    });
}

const environment = process.env.NODE_ENV || 'developement';
app.listen(PORT,
  console.log(`Server is running on port ${PORT} and ${environment}`)
);
