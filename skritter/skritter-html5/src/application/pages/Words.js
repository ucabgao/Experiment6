/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/words.html',
    'components/VocabTable'
], function(BasePage, TemplateMobile, VocabTable) {
    /**
     * @class PageWords
     * @extends BasePage
     */
    var PageWords = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Words';
            this.table = new VocabTable();
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {PageWords}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.table.setElement(this.$('.table-container')).render();
            this.resize();
            return this;
        },
        /**
         * @method loadBanned
         * @returns {PageWords}
         */
        loadBanned: function() {
            var self = this;
            app.storage.getBanned(function(vocabs) {
                app.user.data.vocabs.set(vocabs, {merge: true});
                self.table.set({
                    writing: 'Writing',
                    reading: 'Reading',
                    banned: ''
                }, vocabs);
                self.$('.words-button').removeClass('active');
                self.$('#button-words-banned').addClass('active');
                self.table.renderTable();
                self.$('.content-box').addClass('hidden');
                self.$('#banned').removeClass('hidden');
            });
            return this;
        },
        /**
         * @method loadStarred
         * @returns {PageWords}
         */
        loadStarred: function() {
            var self = this;
            app.storage.getStarred(function(vocabs) {
                app.user.data.vocabs.set(vocabs, {merge: true});
                self.table.set({
                    writing: 'Writing',
                    reading: 'Reading',
                    starred: ''
                }, vocabs);
                self.$('.words-button').removeClass('active');
                self.$('#button-words-starred').addClass('active');
                self.table.renderTable();
                self.$('.content-box').addClass('hidden');
                self.$('#starred').removeClass('hidden');
            });
            return this;
        },
        /**
         * @method resize
         * @returns {PageWords}
         */
        resize: function() {
            this.$('.content-box').css({
                height: this.getHeight() - 80,
                'overflow-y': 'auto'
            });
            return this;
        },
        /**
         * @method set
         * @returns {PageWords}
         */
        set: function(filter) {
            if (filter === 'banned') {
                this.loadBanned();
            } else {
                this.loadStarred();
            }
            return this;
        }
    });

    return PageWords;
});
