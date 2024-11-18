const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('../models/user');
const router = express.Router();

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register User
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  await User.create({ username, email, password });
  res.redirect('/auth/login');
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.send('Invalid credentials');
  }
  req.session.userId = user._id;
  res.redirect('/expenses');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

module.exports = router;
