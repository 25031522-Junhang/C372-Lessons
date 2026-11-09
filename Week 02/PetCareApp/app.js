// Pet Care Journal System
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const PORT = 3000;

const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const petRoutes = require('./routes/petRoutes');
const journalRoutes = require('./routes/journalRoutes');

app.use(flash());

// View Engine and Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: true
}));

app.use('/', authRoutes);
app.use('/', pageRoutes);
app.use('/admin', adminRoutes);
app.use('/pets', petRoutes);
app.use('/journals', journalRoutes);

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
