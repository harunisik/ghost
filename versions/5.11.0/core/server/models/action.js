const _ = require('lodash');
const ghostBookshelf = require('./base');

const candidates = [];

const Action = ghostBookshelf.Model.extend({
    tableName: 'actions',

    initialize: function initialize() {
        _.each(ghostBookshelf.registry.models, (model) => {
            candidates.push([model, model.prototype.tableName.replace(/s$/, '')]);
        });
        this.constructor.__super__.initialize.apply(this, arguments);
    },

    actor() {
        return this.morphTo('actor', ['actor_type', 'actor_id'], ...candidates);
    },

    resource() {
        return this.morphTo('resource', ['resource_type', 'resource_id'], ...candidates);
    }
}, {
    orderDefaultOptions: function orderDefaultOptions() {
        return {
            created_at: 'DESC'
        };
    },

    add(data, unfilteredOptions = {}) {
        const options = this.filterOptions(unfilteredOptions, 'add');
        return ghostBookshelf.Model.add.call(this, data, options);
    }
});

module.exports = {
    Action: ghostBookshelf.model('Action', Action)
};
