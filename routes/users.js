const express = require('express');
const router = express.Router();
const Users = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/* Create new Users. */
router.post('/add', (req, res, next) => {
  let user = new Users({'username':req.body.username, 'password':req.body.password, 'role':req.body.role});
  user.save()
  .then(result => {
    res.json({data: null, message: 'User added successfully', status: 'success'});
  })
  .catch(error => {
    res.status(400).json({data: null, message: 'Failed to add user', status: 'fail'});
  });
});

router.post('/login', (req, res, next) => {
  Users.findOne({'username': req.body.username})
  .then(user => {
    const userData = {
      id: user._id,
      role: user.role
    }
    if(!(user && bcrypt.compareSync(req.body.password, user.password))) {
      return res.status(400).json({data: null, message: 'Login Failed, Please enter correct username/password', status: 'fail'});
    }
    const token = jwt.sign({id: user._id, role: user.role}, config.secret, { 
      expiresIn: '24h' // expires in 24 hours
    });
    res.json({data: userData, message: 'Login successful', status: 'success', token: token});
  })
  .catch(error => {
    res.status(400).json({data: null, message: 'Login Failed', status: 'fail'});
  });
});

module.exports = router;
