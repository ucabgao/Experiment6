/**
 * @module Application
 */
define([
    'application/Bootstrap',
    'application/Mapper',
    'application/PinyinConverter',
    'application/Recognizer',
    'application/Shortstraw'
], function(Bootstrap, Mapper, PinyinConverter, Recognizer, Shortstraw) {
    /**
     * @method addAllObjectAttributes
     * @param {Array} array
     * @param {String} attribute
     * @returns {Number}
     */
    function addAllObjectAttributes(array, attribute) {
        var total = 0;
        for (var i = 0, length = array.length; i < length; i++) {
            if (array[i][attribute]) {
                total += array[i][attribute];
            }
        }
        return total;
    }
    /**
     * @method arrayToJSON
     * @param {Array} array
     * @returns {Array}
     */
    function arrayToJSON(array) {
        return array.map(function(data) {
            return data.toJSON();
        });
    }
    /**
     * @method arrayToInt
     * @param {Array} array
     * @returns {Array}
     */
    function arrayToInt(array) {
        return array.map(function(value) {
            return parseInt(value, 10);
        });
    }
    /**
     * @method calculateInterval
     * @param {Object} item
     * @param {Number} score
     * @param {Object} configs
     * @returns {Number}
     */
    function calculateInterval(item, score, configs) {
        var newInterval = null;
        //return new items with randomized default config values
        if (!item.last) {
            switch (score) {
                case 1:
                    newInterval = configs.initialWrongInterval;
                    break;
                case 2:
                    newInterval = configs.initialRightInterval / 5;
                    break;
                case 3:
                    newInterval = configs.initialRightInterval;
                    break;
                case 4:
                    newInterval = configs.initialRightInterval * 4;
                    break;
            }
            return randomInterval(newInterval);
        }
        //set values for further calculations
        var actualInterval = moment().unix() - item.last;
        var factor = 0.9;
        var pctRight = item.successes / item.reviews;
        var scheduledInterval = item.next - item.last;
        //get the factor
        if (score === 2) {
            factor = 0.9;
        } else if (score === 4) {
            factor = 3.5;
        } else {
            var factorsList = (score === 1) ? configs.wrongFactors : configs.rightFactors;
            var divisions = [2, 1200, 18000, 691200];
            var index;
            for (var i in divisions) {
                if (item.interval > divisions[i]) {
                    index = i;
                }
            }
            factor = factorsList[index];
        }
        //adjust the factor based on readiness
        if (score > 2) {
            factor -= 1;
            factor *= actualInterval / scheduledInterval;
            factor += 1;
        }
        //accelerate new items that appear to be known
        if (item.successes === item.reviews && item.reviews < 5) {
            factor *= 1.5;
        }
        //decelerate hard items consistently marked wrong
        if (item.reviews > 8) {
            if (pctRight < 0.5) {
                factor *= Math.pow(pctRight, 0.7);
            }
        }
        //multiple by the factor and randomize the interval
        newInterval = randomInterval(item.interval * factor);
        //bound the interval
        if (score === 1) {
            if (newInterval > 604800) {
                newInterval = 604800;
            } else if (newInterval < 30) {
                newInterval = 30;
            }
        } else {
            if (newInterval > 315569260) {
                newInterval = 315569260;
            } else if (score === 2 && newInterval < 300) {
                newInterval = 300;
            } else if (newInterval < 30) {
                newInterval = 30;
            }
        }
        return newInterval;
    }
    /**
     * @property bootstrap
     * @type Bootstrap
     */
    var bootstrap = Bootstrap;
    /**
     * @method convertBytesToSize
     * @param {Number} bytes
     * @returns {String}
     */
    function convertBytesToSize(bytes) {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes > 0) {
            var value = parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
            return (bytes / Math.pow(1024, value)).toFixed(2) + ' ' + sizes[value];
        }
        return '0 B';
    }
    /**
     * @method convertTimeToClock
     * @param {Number} time
     */
    function convertTimeToClock(time) {
        var hours = (time / (3600 * 1000)) >> 0;
        time = time % (3600 * 1000);
        var minutes = (time / (60 * 1000)) >> 0;
        time = time % (60 * 1000);
        var seconds = (time / 1000) >> 0;
        if (hours > 0) {
            return hours + ':' + pad(minutes, 0, 2) + ':' + pad(seconds, 0, 2);
        }
        return minutes + ':' + pad(seconds, 0, 2);
    }
    /**
     * @method getAngle
     * @param {Array|createjs.Point|Object} point1
     * @param {createjs.Point|Object} point2
     * @return {Number}
     */
    function getAngle(point1, point2) {
        var p1 = Array.isArray(point1) ? point1[0] : point1;
        var p2 = Array.isArray(point1) ? point1[point1.length - 1] : point2;
        var xDiff = p2.x - p1.x;
        var yDiff = p2.y - p1.y;
        return (Math.atan2(yDiff, xDiff)) * (180 / Math.PI);
    }
    /**
     * @method getBoundingRectangle
     * @param {Array} points
     * @param {Number} areaWidth
     * @param {Number} areaHeight
     * @param {Number} pointRadius
     * @return {Object}
     */
    function getBoundingRectangle(points, areaWidth, areaHeight, pointRadius) {
        var left = areaWidth;
        var top = 0.0;
        var right = 0.0;
        var bottom = areaHeight;
        for (var i = 0, length = points.length; i < length; i++) {
            var x = points[i].x;
            var y = points[i].y;
            if (x - pointRadius < left)
                left = x - pointRadius;
            if (y + pointRadius > top)
                top = y + pointRadius;
            if (x + pointRadius > right)
                right = x + pointRadius;
            if (y - pointRadius < bottom)
                bottom = y - pointRadius;
        }
        var width = right - left;
        var height = top - bottom;
        var center = {x: width / 2 + left, y: height / 2 + bottom};
        return {x: left, y: bottom, width: width, height: height, center: center};
    }
    /**
     * @method getDistance
     * @param {createjs.Point|Object} point1
     * @param {createjs.Point|Object} point2
     * @return {Number}
     */
    function getDistance(point1, point2) {
        var xs = point2.x - point1.x;
        xs = xs * xs;
        var ys = point2.y - point1.y;
        ys = ys * ys;
        return Math.sqrt(xs + ys);
    }
    /**
     * @method getGuid
     * @returns {String}
     */
    function getGuid() {
        return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
    }
    /**
     * @method hasKana
     * @param {String} text
     * @returns {Boolean}
     */
    function hasKana(text) {
        var chars = text.split('');
        if (chars.length > 0) {
            for (var i = 0, length = chars.length; i < length; i++) {
                var charCode = text.charCodeAt(i);
                if ((charCode >= 12353 && charCode <= 12436) ||
                    (charCode >= 12449 && charCode <= 12540) ||
                    charCode === 65374) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * @method isKana
     * @param {String} text
     * @returns {Boolean}
     */
    function isKana(text) {
        var chars = text.split('');
        if (chars.length > 0) {
            for (var i = 0, length = chars.length; i < length; i++) {
                var charCode = text.charCodeAt(i);
                if (!(charCode >= 12353 && charCode <= 12436) &&
                    !(charCode >= 12449 && charCode <= 12540) &&
                    charCode !== 65374) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * @method imageExists
     * @param {String} src
     * @param {Function} callbackSuccess
     * @param {Function} [callbackError]
     */
    function imageExists(src, callbackSuccess, callbackError) {
        var image = new Image();
        image.onload = function() {
            callbackSuccess(image);
        };
        image.onerror = function() {
            if (typeof callbackError === 'function') {
                callbackError();
            }
        };
        image.src = src;
    }
    /**
     * @method isNumber
     * @returns {Boolean}
     */
    function isNumber() {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }
    /**
     * @property mapper
     * @typeof {Mapper}
     */
    var mapper = Mapper;
    /**
     * @method mergeObjectArrays
     * @param {Object} object1
     * @param {Object} object2
     * @returns {Object}
     */
    function mergeObjectArrays(object1, object2) {
        for (var key in object2) {
            if (object1[key]) {
                if (Array.isArray(object1[key])) {
                    object1[key] = object1[key].concat(object2[key]);
                } else {
                    object1[key] = object2[key];
                }
            } else {
                object1[key] = object2[key];
            }
        }
        return object1;
    }
    /**
     * @method pad
     * @param {Number|String}
     * @param {Number|String}
     * @param {Number}
     * @return {String}
     */
    function pad(text, value, size) {
        value = '' + value;
        var string = text + '';
        while (string.length < size) {
            string = value + '' + string;
        }
        return string;
    }
    /**
     * @property pinyin
     * @type {PinyinConverter}
     */
    var pinyin = PinyinConverter;
    /**
     * @method randomDecimal
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    function randomDecimal(min, max) {
        return Math.random() * (max - min) + min;
    }
    /**
     * @method randomInterval
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    function randomInterval(value) {
        return Math.round(value * (0.925 + (Math.random() * 0.15)));
    }
    /**
     * @property recognizer
     * @type {Recognizer}
     */
    var recognizer = new Recognizer();
    /**
     * @method segmentReading
     * @param {String} reading
     * @returns {Array}
     */
    function segmentReading(reading) {
        var segments = [];
        var variations = reading.split(', ');
        for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
            var variation = variations[a];
            segments.push(variation.match(/\s|[a-z|A-Z]+[1-5]+| ... |'/g));
        }
        return segments;
    }
    /**
     * @property shortstraw
     * @type Shortstraw
     */
    var shortstraw = new Shortstraw();
    /**
     * @method textToHTML
     * @param {String} text
     */
    var textToHTML = function(text) {
        if (text) {
            return text.replace(/img:(http:\/\/\S+)/gi, '<img src="$1"/>')
                .replace(/_([^ _][^_]*)_(?!\S{4})/gi, '<em>$1</em>')
                .replace(/\n/gi, '<br/>')
                .replace(/\*([^*]+)\*/gi, '<strong>$1</strong>');
        }
        return '';
    };
    /**
     * @method toLowerCase
     * @param {String} value
     * @returns {String}
     */
    function toLowerCase(value) {
        return value.toLowerCase();
    }
    /**
     * @method toUpperCase
     * @param {String} value
     * @returns {String}
     */
    function toUpperCase(value) {
        return value.toUpperCase();
    }

    return {
        addAllObjectAttributes: addAllObjectAttributes,
        arrayToInt: arrayToInt,
        arrayToJSON: arrayToJSON,
        bootstrap: bootstrap,
        calculateInterval: calculateInterval,
        convertTimeToClock: convertTimeToClock,
        convertBytesToSize: convertBytesToSize,
        getAngle: getAngle,
        getBoundingRectangle: getBoundingRectangle,
        getDistance: getDistance,
        getGuid: getGuid,
        hasKana: hasKana,
        imageExists: imageExists,
        isKana: isKana,
        isNumber: isNumber,
        mapper: mapper,
        mergeObjectArrays: mergeObjectArrays,
        pad: pad,
        pinyin: pinyin,
        randomDecimal: randomDecimal,
        randomInterval: randomInterval,
        recognizer: recognizer,
        segmentReading: segmentReading,
        shortstraw: shortstraw,
        textToHTML: textToHTML,
        toLowerCase: toLowerCase,
        toUpperCase: toUpperCase
    };
});