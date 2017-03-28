const _ = require('lodash');
const moment = require('moment');

module.exports = {
    DROP_FETCH_EXTRAS: function(space, isFetchingPast = true, data = null) {

        let params;

        switch (space) {
            case 'tumblr':
                params = { limit: 20 };
                if (isFetchingPast) {
                    params.before = _.minBy(data.drops, (o) => o['id'])['content']['timestamp'];
                }
              break;
            case 'spotify':
                params = { limit: 20 };
                if (isFetchingPast) {
                    params.before = _.minBy(data.drops, (o) => o['id'])['content']['played_at'];
                }
              break;
            case 'instagram':
                params = { count: 5 };
                if (isFetchingPast) {
                    params.max_id = _.minBy(data.drops, (o) => o['content']['id'])['content']['id'];
                }
              break;
            case 'swarm':
                params = {
                    limit: 20,
                    v: Date.now()
                };
                if (isFetchingPast) {
                    params.beforeTimestamp = _.minBy(data.drops, (o) => o['content']['id'])['content']['createdAt']/1000;
                }
              break;
            case 'twitter':
                params = {
                    count: 20,
                    screen_name: 'erratiktart',

                };
                if (isFetchingPast) {
                    params.max_id = _.minBy(data.drops, (o) => o['content']['id'])['content']['id'];
                }
              break;
            case 'dribbble':
                params = { per_page: 30 };
                // if (isFetchingPast) {
                //     params.date = moment(_.minBy(data.drops, (o) => o['content']['id'])['content']['created']).unix().format('YYYY-MM-DD');
                // }
              break;
        }

        return params;
    }
};
