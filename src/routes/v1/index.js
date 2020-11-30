const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const taskRoute = require('./task.route');
const portfolioRoute = require('./portfolio.route');
const clientRoute = require('./client.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/docs', docsRoute);
router.use('/tasks', taskRoute);
router.use('/portfolio', portfolioRoute);
router.use('/client', clientRoute);

module.exports = router;
