const express = require('express');
const path = require('path');
const FeedbackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');
const CookieSession = require('cookie-session'); // su dung cookie: luu tru dem, session: phien lam viec
const bodyParser = require('body-parser');
const feedbackService = new FeedbackService('./provided/data/feedback.json'); // create data from constructor json
const speakersService = new SpeakerService('./provided/data/speakers.json');

const app = express();
const port = 5000;
const routes = require('./routes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.set('trust proxy', 1); // use nginx to  proxy and save cookie,session

app.use(
  CookieSession({
    name: 'session',
    keys: ['Andfakjdksamds', 'sakdsbfjJSDJSN'],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.locals.siteName = 'Best Manager EPL'; // init local varriable

app.use(async (request, response, next) => {
  const names = await speakersService.getNames();
  response.locals.speakerNames = names;
  return next();
});
//handle error exp
app.get('/throw', (req, res, next) => {
  setTimeout(() => {
    throw new Error('Something did throw');
  }, 3000);
});
app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);
app.use(express.static(__dirname + '/static')); // import css
app.listen(port, () => {
  console.log(`Sever is running at: ${port}`);
});
