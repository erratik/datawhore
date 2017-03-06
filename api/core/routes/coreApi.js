var multer = require('multer');
var fs = require('fs');
var mkdirp = require('mkdirp');
var request = require('request');
var https = require('https');
var Space = require('../models/spaceModel');
var Setting = require('../models/settingModel');
var Schema = require('../models/schemaModel');
var endpoints = require('./endpoints');
var objectPath = require('object-path');
// my own endpoints, read/write in mongo docs
var getEndpoint = function (data, cb) {
    console.log("[getEndpoint] " + data.action + " -> ", data);
    return objectPath.get(endpoints, data.action)(data.space, data.type, function (resp) {
        cb(resp);
    });
};
var postEndpoint = function (data, content, cb) {
    console.log("[postEndpoint] " + data.action + " -> ", data);
    var endpointAction = objectPath.get(endpoints, data.action);
    return endpointAction(data.space, content, data.type, function (resp) {
        cb(resp);
    });
};
module.exports = function (app) {
    // SPACES
    app.get('/api/spaces', function (req, res) {
        Space.getAll(function (err, data) {
            res.json(data);
        });
    });
    app.get('/api/space/:space', function (req, res) {
        Space.findByName(req.params.space, function (err, data) {
            res.json(data[0]);
        });
    });
    // SPACES: SETTINGS (MOSTLY OAUTH, FOR NOW)
    app.get('/api/space/settings/:space', function (req, res) {
        Setting.findSettings(req.params.space, function (err, data) {
            res.json(data);
        });
    });
    app.put('/api/space/update/:space', function (req, res) {
        var space = new Space({ name: req.params.space }); // instantiated Space
        req.body.data.modified = Date.now();
        console.log(req.body);
        space.updateSpace(req.body.data, function () {
            Space.findByName(req.params.space, function (error, _space) {
                res.json(_space[0]);
            });
        });
    });
    // todo: this should be deprecated to merge with the lower endpoint
    app.put('/api/space/update/settings/:space', function (req, res) {
        var setting = new Setting(req.body); // instantiated Space
        Setting.updateSettings(req.body, function () {
            Setting.findSettings(req.params.space, function (err, space) {
                // console.log('space -> ', space);
                res.json(space);
            });
        });
    });
    // SPACES: ENDPOINTS TO GET DATA FROM SPACES (TWITTER, INSTAGRAM, ETC)
    app.post('/api/endpoint/space', function (req, res) {
        console.log('data', req.body.data);
        var data = req.body.data;
        var options;
        // requests to apis that need spaceOauthSettings shit
        if (data.apiEndpointUrl) {
            switch (data.space) {
                case 'twitter':
                    options = {
                        hostname: data.apiUrl,
                        path: data.apiEndpointUrl,
                        headers: {
                            Authorization: 'Bearer ' + data.accessToken
                        }
                    };
                    https.get(options, function (result) {
                        var buffer = '';
                        result.setEncoding('utf8');
                        result.on('data', function (dataReceived) {
                            buffer += dataReceived;
                        });
                        result.on('end', function () {
                            var response = JSON.parse(buffer);
                            var endpointAction = objectPath.get(endpoints, data.action);
                            endpointAction(data.space, response, data.type, function (updatedResponse) {
                                res.json(updatedResponse);
                            });
                        });
                    });
                    break;
                default:
                    options = {
                        uri: "https://" + data.apiUrl + data.apiEndpointUrl + "?access_token=" + data.accessToken + "&oauth_token=" + data.accessToken + "&v=" + Date.now() + "&m=swarm",
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    };
                    request(options, function (error, response, body) {
                        if (error) {
                            res.send(error);
                        }
                        if (data.action.includes('.write')) {
                            postEndpoint(req.body.data, body, function (resp) { return res.json(resp); });
                        }
                    });
            }
        }
        else {
            // fallbacks when there are not specific routes set for the action
            if (data.action.includes('.write')) {
                console.log('[ALERT: THIS NEED TO BE SHITCANNED]');
                postEndpoint(req.body.data, req.body.data.content, function (resp) { return res.json(resp); });
            }
            else {
                console.log('[ALERT: THIS NEED TO BE SHITCANNED]');
                getEndpoint(req.body.data, function (resp) { return res.json(resp); });
            }
        }
    });
    // SPACES: ENDPOINTS TO GET DATA FROM DATAWHORE API
    app.get('/api/get/:endpoint/:space', function (req, res) {
        var data = {
            space: req.params.space,
            type: req.query.type ? req.query.type : req.params.endpoint,
            action: req.params.endpoint + ".get"
        };
        getEndpoint(data, function (resp) {
            console.log("[endpoints." + data.action + " response]", resp);
            res.json(resp);
        });
    });
    app.put('/api/update/:endpoint/:space', function (req, res) {
        var data = {
            space: req.params.space,
            type: req.body.type ? req.body.type : req.params.endpoint,
            action: req.params.endpoint + ".write"
        };
        postEndpoint(data, req.body.data, function (resp) {
            console.log("[endpoints." + data.action + " response]", resp);
            res.json(resp);
        });
    });
    // UPLOADS
    // todo: see if i can change this to a put?
    app.post('/api/upload/:space/:folder/:filename', function (req, res) {
        var storage = multer.diskStorage({
            destination: function (_req, file, cb) {
                var folderName = '../public/uploads/' + _req.params.space + '/' + _req.params.folder;
                mkdirp(folderName, function (err) {
                    cb(null, folderName);
                });
            },
            filename: function (_req, file, cb) {
                cb(null, _req.params.space + '-' + _req.params.filename + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
            }
        });
        var upload = multer({
            storage: storage
        }).single('file');
        upload(req, res, function (err) {
            if (err) {
                res.json({ error_code: 1, err_desc: err });
                return;
            }
            // todo: return base64 string for the icon
            Space.updateSpace(req.params.space, { icon: req.file.path, modified: Date.now() }, function (space) { return res.json(space); });
            // res.json(req.file);
        });
    });
};
