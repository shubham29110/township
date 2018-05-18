const express = require('express')
const router = express.Router()
const building = require('../controller/building')
const middleware = require('../middleware/index')

router.get('/building', middleware.ensureAuthenticated, building.get_method_BuildingDetail);

router.post('/building',middleware.ensureAuthenticated, building.post_method_BuildingDetail);

router.post('/building/:id', middleware.ensureAuthenticated, building.editBuilding );




module.exports = router;