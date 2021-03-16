const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const validations = [
  // validate and checking name,email....
  check('name').trim().isLength({ min: 3 }).escape().withMessage('A name is required'),
  check('email')
    .trim()
    .isEmail({ min: 3 })
    .normalizeEmail()
    .withMessage('A vailid email is required'),
  check('title').trim().isLength({ min: 3 }).escape().withMessage('A title is required'),
  check('message').trim().isLength({ min: 5 }).escape().withMessage('A message is required'),
];

module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const feedback = await feedbackService.getList();
      const errors = req.session.feedback ? req.session.feedback.errors : false; // errors dc gan neu errors = false
      const successMessage = req.session.feedback ? req.session.feedback.message : false;
      req.session.feedback = {};
      return res.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
        errors,
        successMessage,
      });
    } catch (error) {
      return next(error);
    }
  });
  router.post('/', validations, async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.session.feedback = {
          errors: errors.array(),
        };
        return res.redirect('/feedback'); // load lai trang post ban dau
      }
      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      req.session.feedback = {
        message: 'Cảm ơn bạn đã phản hồi',
      };

      return res.redirect('/feedback');
    } catch (error) {
      next(error);
    }
  });
  router.post('/api', validations, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
      }
      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      const feedback = await feedbackService.getList();
      return res.json({ feedback });
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
