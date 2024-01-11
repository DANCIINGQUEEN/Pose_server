import express from 'express'
import indexControl from '../controllers/indexControllers.js'
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/create', indexControl.create)


export default router;
