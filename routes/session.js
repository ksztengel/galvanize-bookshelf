'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt');

router.get('/', function (req,res,next){
  if (req.session.userInfo){
    res.send(true)
  }
  else {
    res.send(false)
  }
})

router.post ('/', function (req,res, next){
  knex('users')
  .where('email', req.body.email)
  .then(function(results){
    if (!results){
      res.send('Bad email or password')
    } else

    {
      var user = results[0]
      var passwordMatch = bcrypt.compareSync(req.body.password, user.hashed_password)
      if(passwordMatch == false){
        res.send('Username or email does not match')
    } else
    {
      delete user.hashed_password
        req.session.userInfo = user
        res.send(humps.camelizeKeys(user))

      }
    }
  })
})

router.delete('/', function(req,res,next) {
  req.session = null
  res.send(true)
})

module.exports = router;
