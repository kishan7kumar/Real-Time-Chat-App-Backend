
// acts like a node module itself
const express = require('express');
const bodyParser = require('body-parser'); // req comes in JSON so converts into object
const cors = require('./cors');
var authenticate = require('../authenticate');
const chatRouter = express.Router();
const Chats = require('../models/chats');
chatRouter.use(bodyParser.json());


chatRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); }) //useful for post operations
//chat already mounted in index file as /chats, here one endpoint all get, put are chained here
chatRouter.route('/')
	.get(authenticate.verifyUser, cors.corsWithOptions, (req, res, next) => {
		Chats.find({})
			.then((chats) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(chats);
			}, (err) => next(err)) //here next error passes to overall error handler
			.catch((err) => next(err));
	})
	.post(authenticate.verifyUser, cors.corsWithOptions, (req, res, next) => {
		Chats.create(req.body)
			.then((chat) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(chat);
			}, (err) => next(err))
			.catch((err) => next(err));
	})

module.exports = chatRouter;

