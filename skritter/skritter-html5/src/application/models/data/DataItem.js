/**
 * @module Application
 */
define([
    'framework/BaseModel',
    'models/data/DataReview'
], function(BaseModel, DataReview) {
    /**
     * @class DataItem
     * @extends BaseModel
     */
    var DataItem = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method cache
         * @param {Function} [callback]
         */
        cache: function(callback) {
            app.storage.putItems('items', this.updateSchedule().toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method createReview
         * @returns {DataReview}
         */
        createReview: function() {
            var review = new DataReview();
            var items = [this].concat(this.getContainedItems());
            var now = moment().unix();
            var timestamp = new Date().getTime();
            var part = this.get('part');
            var reviews = [];
            var wordGroup =  timestamp + '_' + this.id;
            for (var a = 0, lengthA = items.length; a < lengthA; a++) {
                var item = items[a];
                reviews.push({
                    itemId: item.id,
                    score: 3,
                    bearTime: a === 0 ? true : false,
                    submitTime: now,
                    reviewTime: 0,
                    thinkingTime: 0,
                    currentInterval: 0,
                    actualInterval: 0,
                    newInterval: undefined,
                    wordGroup: wordGroup,
                    previousInterval: 0,
                    previousSuccess: false
                });
            }
            return review.set({
                id: wordGroup,
                itemId: this.id,
                originalItems: app.fn.arrayToJSON(_.uniq(items, 'cid')),
                part: part,
                reviews: reviews,
                timestamp: timestamp
            });
        },
        /**
         * @method getAllVocabIds
         * @return {Array}
         */
        getAllVocabIds: function() {
            var vocabIds = [];
            var vocabs = this.getVocabs();
            for (var i = 0, length = vocabs.length; i < length; i++) {
                var vocab = vocabs[i];
                vocabIds = vocabIds.concat([vocab.id].concat(vocab.get('containedVocabIds')));
            }
            return _.uniq(vocabIds);
        },
        /**
         * @method getCanvasCharacters
         * @returns {Array}
         */
        getCanvasCharacters: function() {
            var characters = [];
            var containedVocabs = this.getVocab().getContainedVocabs();
            for (var i = 0, length = containedVocabs.length; i < length; i++) {
                if (this.get('part') === 'rune') {
                    characters.push(containedVocabs[i].getCanvasCharacter());
                } else if (this.get('part') === 'tone') {
                    characters.push(app.user.data.strokes.getCanvasTones());
                }
            }
            return characters;
        },
        /**
         * @method getContainedItems
         * @returns {Array}
         */
        getContainedItems: function() {
            var items = [];
            var part = this.get('part');
            if (['rune', 'tone'].indexOf(part) !== -1) {
                var containedIds = this.getVocab().getContainedItemIds(part);
                for (var i = 0, length = containedIds.length; i < length; i++) {
                    var containedItem = app.user.data.items.get(containedIds[i]);
                    if (containedItem) {
                        items.push(app.user.data.items.get(containedIds[i]));
                    } else {
                        //create a placeholder item
                        items.push(new DataItem());
                    }
                }
            }
            return items;
        },
        /**
         * @method getRTD
         * @returns {Number}
         */
        getRTD: function() {
            return this.attributes.next - this.attributes.last;
        },
        /**
         * @method getVocab
         * @returns {DataVocab}
         */
        getVocab: function() {
            var vocabs = this.getVocabs();
            if (app.user.isChinese()) {
                return vocabs[this.get('reviews') % vocabs.length];
            }
            return vocabs[0];
        },
        /**
         * @method getVocabs
         * @returns {Array}
         */
        getVocabs: function() {
            var vocabs = [];
            var activeStyles = app.user.settings.getActiveStyles();
            for (var i = 0, length = this.get('vocabIds').length; i < length; i++) {
                var vocab = app.user.data.vocabs.get(this.get('vocabIds')[i]);
                if (vocab) {
                    if (app.user.isChinese() && activeStyles.indexOf(vocab.attributes.style) !== -1) {
                        vocabs.push(vocab);
                    } else if (app.user.isJapanese()) {
                        vocabs.push(vocab);
                    }
                }
            }
            return vocabs;
        },
        /**
         * @method isNew
         * @returns {Boolean}
         */
        isNew: function() {
            return this.attributes.reviews === 0;
        },
        /**
         * @method space
         * @param {Number} [time]
         * @returns {DataItem}
         */
        space: function(time) {
            var now = time || moment().unix();
            var minSpace = 600;
            var maxSpace = 43200;
            var spaced = 0;
            if (this.isNew()) {
                spaced = now + maxSpace;
            } else {
                spaced = now + Math.max(minSpace, this.getRTD() * 0.2);
            }
            if (spaced > this.get('next')) {
                this.set('next', spaced);
            }
            return this;
        },
        /**
         * @method updateSchedule
         * @returns {DataItem}
         */
        updateSchedule: function() {
            app.user.schedule.insert(this.toJSON());
            return this;
        }
    });

    return DataItem;
});
