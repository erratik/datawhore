var mongoose = require('mongoose');
var Setting = require('./settingModel');
var Profile = require('./profileModel');
var SpaceSchema = {
    schema: {
        name: String,
        modified: Number,
        avatar: String,
        description: String,
        username: String,
        icon: String,
        docUrl: String,
        apiUrl: String
    },
    self: {
        findByName: function (name, cb) {
            return this.find({ name: name }, cb);
        },
        getAll: function (cb) {
            return this.find({}, cb);
        },
        removeSpace: function (name, cb) {
            // console.log(name)
            Setting.removeSettings(name, function () { });
            Profile.removeProfile(name, function () { });
            this.remove({ name: name }, cb);
        },
        updateSpace: function (spaceName, update, cb) {
            update.modified = Date.now();
            this.findOneAndUpdate({ name: spaceName }, update, { upsert: true, returnNewDocument: true }, function (err, updated) {
                // console.log(updated);
                cb(updated);
            });
        }
    }
};
var Space = require('./createModel')(mongoose, 'Space', SpaceSchema);
module.exports = Space;
//# sourceMappingURL=/Users/erratik/Sites/datawhore/admin/api/models/spaceModel.js.map
