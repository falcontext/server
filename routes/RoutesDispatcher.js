/* jslint node es6 */

const express = require('express');
const userRoutes = require('./UserRoutes');
const logger = require('./middleware/LoggingRequestMiddleware');


const router = express.Router();

router.use(logger);
router.get('/', (req, res) => {
	res.send('working');
});

router.use('/user/', userRoutes);

module.exports = router;
