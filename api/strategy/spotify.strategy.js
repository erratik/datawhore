const space = 'spotify';
const Utils = require('../lib/utils');
const Setting = require('../models/settingModel');
const passport = require('passport')
    , SpotifyStrategy = require('passport-spotify').Strategy;
const refresh = require('passport-oauth2-refresh');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = function (app) {

    Setting.findSettings(space, (settings) => {

        if (settings.oauth) {
            const strategy = new SpotifyStrategy({
                clientID: settings.oauth.filter(s => s.keyName === 'apiKey')[0].value,
                clientSecret: settings.oauth.filter(s => s.keyName === 'apiSecret')[0].value,
                callbackURL: `http://datawhore.erratik.ca:10010/auth/${space}/callback`
                // callbackURL: settings.oauth.filter(s => s.keyName === 'redirectUrl')[0].value
            },
                (accessToken, refreshToken, profile, done) => Utils.savePassport(space, settings, {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }, profile, done)
            );
            passport.use(strategy);
            refresh.use(strategy);
        }
    });

    app.get('/auth/spotify', passport.authenticate(space, {
        scope: ['user-read-email', 'user-read-private', 'user-read-recently-played']
    }));
    app.get('/auth/spotify/callback', passport.authenticate(space, {
        successRedirect: `http://datawhore.erratik.ca:4200/space/${space}`,
        failureRedirect: 'http://datawhore.erratik.ca:4200'
    }));

};
