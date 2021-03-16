const express = require('express');
const router = express.Router();
const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

module.exports = (params) => {
  // function argument lay daata tu speakerservice
  const { speakersService } = params;
  router.get('/', async (req, res, next) => {
    try {
      const artwork = await speakersService.getAllArtwork();
      const topSpeaker = await speakersService.getList();
      // create simple visit counter - lay so luot truy cap vao web
      if (!req.session.visitcount) {
        // neu req ko dc luu trong session
        req.session.visitcount = 0;
      }
      req.session.visitcount += 1;
      console.log(`number of visit :${req.session.visitcount}`);
      //res.sendFile(path.join(__dirname, './static/index.html')); // read and send Html file
      return res.render('layout', { pageTitle: 'by HMH', template: 'index', topSpeaker, artwork });
    } catch (error) {
      return next(error);
    }
  });

  router.use('/speakers', speakersRoute(params)); // giong state - props
  router.use('/feedback', feedbackRoute(params));

  return router;
};
