const express = require('express');
const Expense = require('../models/expense');
const router = express.Router();

// Middleware to ensure user is logged in
function isAuthenticated(req, res, next) {
  if (!req.session.userId) return res.redirect('/auth/login');
  next();
}

// Show all expenses
router.get('/', isAuthenticated, async (req, res) => {
  const expenses = await Expense.find({ user: req.session.userId });
  res.render('expenses', { expenses });
});

// Add new expense
router.post('/', isAuthenticated, async (req, res) => {
  const { title, amount } = req.body;
  await Expense.create({ title, amount, user: req.session.userId });
  res.redirect('/expenses');
});

// Edit expense
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  res.render('editExpense', { expense });
});

// Update expense
router.put('/:id', isAuthenticated, async (req, res) => {
  const { title, amount } = req.body;
  await Expense.findByIdAndUpdate(req.params.id, { title, amount });
  res.redirect('/expenses');
});

// Delete expense
router.delete('/:id', isAuthenticated, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect('/expenses');
});

module.exports = router;
