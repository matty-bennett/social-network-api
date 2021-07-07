const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

//add prefix all user routes with '/users'
router.use('/users', userRoutes);
//add prefix all thought routes with '/thoughts'
router.use('/thoughts', thoughtRoutes);

module.exports = router;