"use strict";

var config = require('./config');

const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

let auth = (req, res, next) =>
   config.acceptedTokens[req.body.token] ? next() : res.sendStatus(401);

let slackCommandCheck = (req, res, next) =>
  req.body.command ? next() : res.send('No Slack Command');

let slackTextCheck = (req, res, next) => 
  req.body.text ? next() : res.send('No Slack Text');

let approveCommandToken = (module) => config.acceptedTokens[module.getToken()] = 1;

let arrTextNotNeeded = [];
let arrTextNeeded = [];

let slashcmdsonos = require('slashcmd-sonos')(app, arrTextNotNeeded, arrTextNeeded);
approveCommandToken(slashcmdsonos);

app.post('/', auth,
              slackCommandCheck,
              arrTextNotNeeded,
              slackTextCheck,
              arrTextNeeded,
              (req, res) => res.send("Move along, nothing to see..."));

app.listen(config.port, () => console.log('Server listening on port '+config.port+'!'));