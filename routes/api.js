const express = require('express');
const controller = require('../controller');

const router = express.Router();

router.post('/upload', (req, res, next) => {
  if (req.files) {
    const { path } = req.files.file;
    controller.handleUpload(path, (err, data) => {
      if (err) {
        return next(err);
      }
      return res.json(data);
    });
  }
});

router.get('/list/realms', (req, res, next) => {
  controller.listRealms((err, data) => {
    if (err) {
      return next(err);
    }
    return res.json(data);
  });
});

router.get('/stats/quick', (req, res, next) => {
  controller.getQuickStats(req, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json(data);
  });
});

router.get('/stats/characters', (req, res, next) => {
  controller.getCharacterStats(req, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json(data);
  });
});

router.get('/stats/activity', (req, res, next) => {
  controller.getTimeStats(req, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json(data);
  });
});

// eslint-disable-next-line no-unused-vars
router.get('/test', (req, res, next) => res.json({ test: 'test' }));
// router.get('/stats/times', (req, res, next) => {});

module.exports = router;
