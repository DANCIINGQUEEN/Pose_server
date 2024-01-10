// const  express = require('express');
// const router = express.Router();
// const indexControl = require('../controllers/indexControllers')
import express from 'express'
import indexControl from '../controllers/indexControllers.js'
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/create', indexControl.create)


// module.exports = router;
export default router;
