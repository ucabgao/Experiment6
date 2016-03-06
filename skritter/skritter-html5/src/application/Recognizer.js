/**
 * @module Application
 */
define([], function() {
    /**
     * @class Recognizer
     */
    function Recognizer() {
        this.baseAngleThreshold = 30;
        this.baseCornerPenalty = 50;
        this.baseCornerThreshold = 0;
        this.baseDistanceThreshold = 150;
        this.baseSize = 600;
        this.canvasSize = 600;
    }
    /**
     * @method recognize
     * @param {CanvasCharacter} character
     * @param {CanvasStroke} stroke
     * @returns {Boolean|CanvasStroke}
     */
    Recognizer.prototype.recognize = function(character, stroke) {
        var results = this.getResults(character, stroke);
        results = _.filter(results, 'total');
        results = _.sortBy(results, 'total');
        if (results.length) {
            return results[0];
        }
        return false;
    };
    /**
     * @method getResults
     * @param {CanvasCharacter} character
     * @param {CanvasStroke} userStroke
     * @returns {Array}
     */
    Recognizer.prototype.getResults = function(character, userStroke) {
        var results = [];
        var targets = character.getExpectedVariations();
        for (var a = 0, lengthA = targets.length; a < lengthA; a++) {
            var target = targets[a];
            for (var b = 0, lengthB = target.length; b < lengthB; b++) {
                var targetStroke = target.at(b);
                if (targetStroke.get('position') === character.getPosition()) {
                    results = results.concat(this.runChecks(targetStroke, userStroke));
                }
            }
        }
        return results;
    };
    /**
     * @method scaleThreshold
     * @param {Number} value
     * @returns {Number}
     */
    Recognizer.prototype.scaleThreshold = function(value) {
        return value * (this.canvasSize / this.baseSize);
    };
    /**
     * @method runChecks
     * @param {CanvasStroke} targetStroke
     * @param {CanvasStroke} userStroke
     ;;     * @returns {Array}
     */
    Recognizer.prototype.runChecks = function(targetStroke, userStroke) {
        var results = [];
        var params = targetStroke.getParams();
        this.canvasSize = app.get('canvasSize');
        for (var a = 0, lengthA = params.length; a < lengthA; a++) {
            var param = params[a];
            var result = userStroke.clone();
            var skipChecks = param.has('skipChecks') ? param.get('skipChecks') : [];
            var total = 0;
            //skip neutral tone during process
            if (param.get('strokeId') === 387) {
                continue;
            }
            var scores = {
                angle: skipChecks.indexOf('angle') === -1 ? this.checkAngle(param, userStroke) : 0,
                corners: skipChecks.indexOf('corners') === -1 ? this.checkCorners(param, userStroke) : 0,
                distance: skipChecks.indexOf('distance') === -1 ? this.checkDistance(param, userStroke) : 0
            };
            for (var check in scores) {
                var score = scores[check];
                if (score > -1) {
                    total += score;
                } else {
                    total = false;
                    break;
                }
            }
            result.set({
                contains: targetStroke.get('contains'),
                data: targetStroke.get('data'),
                id: targetStroke.id,
                kana: targetStroke.get('kana'),
                position: targetStroke.get('position'),
                shape: targetStroke.get('shape'),
                strokeId: targetStroke.get('strokeId'),
                tone: targetStroke.get('tone')
            });
            result.scores = scores;
            result.total = total;
            results.push(result);
        }
        return results;
    };
    /**
     * @method checkAngle
     * @param {DataParam} targetParam
     * @param {CanvasStroke} userStroke
     * @returns {Number}
     */
    Recognizer.prototype.checkAngle = function(targetParam, userStroke) {
        var angleThreshold = targetParam.has('angleThreshold') ? targetParam.get('angleThreshold') : this.baseAngleThreshold;
        var score = Math.abs(targetParam.getFirstAngle() - userStroke.getFirstAngle());
        if (score <= angleThreshold) {
            return score;
        }
        return -1;
    };
    /**
     * @method checkCorners
     * @param {DataParam} targetParam
     * @param {CanvasStroke} userStroke
     * @returns {Number}
     */
    Recognizer.prototype.checkCorners = function(targetParam, userStroke) {
        var cornerThreshold = targetParam.has('cornerThreshold') ? targetParam.get('cornerThreshold') : this.baseCornerThreshold;
        var score = Math.abs(targetParam.get('corners').length - userStroke.get('corners').length);
        if (score <= cornerThreshold) {
            return score * this.baseCornerPenalty;
        }
        return -1;
    };
    /**
     * @method checkDistance
     * @param {DataParam} targetParam
     * @param {CanvasStroke} userStroke
     * @returns {Number}
     */
    Recognizer.prototype.checkDistance = function(targetParam, userStroke) {
        var score = app.fn.getDistance(targetParam.getRectangle().center, userStroke.getRectangle().center);
        if (score <= this.scaleThreshold(this.baseDistanceThreshold)) {
            return score;
        }
        return -1;
    };

    return Recognizer;
});
