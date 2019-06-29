const logger = require('./common/logger')('App');

const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const application = require('./config/application.json');
const packageJson = require('../package.json')

// Use body-parser as middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

logger.info('====== NODEJS REST API ======');
console.log('====== NODEJS REST API ======');
let START_TIME = new Date();

// Root page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

// GET -> return json format
app.get('/health', (req, res) => {
    logger.debug('Access /health')

    let health = {
        status: 'Up',
        startTime: START_TIME,
        version: packageJson.version,
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200)
    res.send(JSON.stringify(health, null, '\t'))
})

// POST with request body
app.post('/users/add', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Content-Type', 'application/json');

    let username = '';
    let fullname = '';
    let email = '';
    try {
        username = req.body.username;
        fullname = req.body.fullname;
        email = req.body.email;

        let json = {
            code: 0,
            message: 'Success'
        }
        res.status(200)
        res.send(JSON.stringify(json, null, '\t'))
    } catch (error) {
        logger.error('Add user failed, ' + error)
        let json = {
            code: 500,
            message: 'Server error'
        }
        res.status(500)
        res.send(JSON.stringify(json, null, '\t'))
    }
})


const port = application.port
app.listen(port, function () {
    console.log(`App server is listening on port ${port}`)
    logger.info(`App server is listening on port ${port}`)

}).on('error', function (error) {
    // Express handle listen error
    console.log('Start express server failed, exit process, ' + error)
    logger.error('Start express server failed, exit process, ' + error)
    process.exit(0)
})


