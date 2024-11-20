const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

const app = express();
mongoose.connect('mongodb+srv://Saumyajain16:Saumyajain16@cluster0.khpkz.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/expense_manager' }),
  })
);
app.set('view engine', 'ejs');

// Root Route
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/expenses'); // Redirect to the dashboard if logged in
  } else {
    res.redirect('/auth/login'); // Redirect to login if not logged in
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
