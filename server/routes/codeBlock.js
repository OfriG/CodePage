const express = require('express');
const router = express.Router();
//import controller func
const {getAllBlocks, getBlock}= require('../controllers/codeBlockController');
router.route('/')
  .get(getAllBlocks)

router.route('/:id')
  .get(getBlock)
 

module.exports =router;