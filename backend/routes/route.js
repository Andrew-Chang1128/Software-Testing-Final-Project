const express = require("express");
const router = express.Router();

const controller = require("../controllers/routeController");
const authentication = require("../utils/authentication")
const routeController = new controller()
//define jwt auth middleware for /allRoutes
//apply middleware authentication.auth to route
router.get('/allRoutes',authentication.auth, routeController.allRoutes)

module.exports = router