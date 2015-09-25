/**
 * Created by Eric on 9/24/2015.
 */
(function () {
    Polymer({
        is: 'wire-winding-calculator',
        properties: {
            targetCircularMils: {
                type: Number,
                value: 0,
                observer: '_recalculateSolutions'
            },
            targetGauge: {
                type: Number,
                value: 0,
            },
            solutions: {
                type: Array,
                value: [],
            },
        },
        _recalculateSolutions: function () {
            if (this.solutions) {
                this._clearSolutions();
                calculateSolutions({
                    targetCM: this.targetCircularMils,
                    targetGauge: this.targetGauge,
                    gaugeModel: this.$.gauges,
                    element: this
                });
            }
        },
        _clearSolutions: function () {
            this.splice('solutions', 0, this.solutions.length);
        },
        numberFormat: function (value, decimals, seperator) {
            seperator = (seperator == undefined) ? ',' : seperator;
            if (isNaN(value)) {
                return '';
            } else {
                value = Number(value);
                value = value.toFixed(decimals);
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator)
                return value;
            }
        }
    });

    function calculateSolutions(options) {
        var possibleGauges = options.gaugeModel.getGaugesWithinTwoSteps(options.targetGauge);
        var primaryGauge = options.targetGauge;

        var allSolutions = [];
        possibleGauges.forEach(function (primaryGauge) {
            possibleGauges.forEach(function (secondaryGauge) {
                if (primaryGauge != secondaryGauge) {
                    var solutionsForPair = findAllSolutionsForPair(primaryGauge, secondaryGauge, options.targetCM);
                    allSolutions = allSolutions.concat(solutionsForPair);
                }
            });
        });
        allSolutions.sort(function (s1, s2) {
            if (s1.percentage < s2.percentage) {
                return -1;
            }
            if (s1.percentage > s2.percentage) {
                return 1;
            }
            return 0;
        });

        var maxSize = 50;
        allSolutions.splice(maxSize, allSolutions.length - maxSize);
        options.element.solutions = allSolutions;
    }

    function findAllSolutionsForPair(primaryGauge, secondaryGauge, targetCM) {
        var allSolutions = [];
        var maxCount = Math.round(targetCM / primaryGauge.circularMils);
        for (var primaryCount = 1; primaryCount <= maxCount; primaryCount++) {
            var primaryCircularMils = primaryCount * primaryGauge.circularMils;
            var secondaryCount = Math.round((targetCM - primaryCircularMils) / secondaryGauge.circularMils);
            var secondaryCircularMils = secondaryCount * secondaryGauge.circularMils;

            var totalCircularMils = primaryCircularMils + secondaryCircularMils;
            var percentage = Math.abs((totalCircularMils / targetCM * 100) - 100);

            var newSolution = {
                percentage: percentage,
                wires: [
                    {awg: primaryGauge.awg, count: primaryCount},
                    {awg: secondaryGauge.awg, count: secondaryCount}
                ],
                circularMils: totalCircularMils
            };
            allSolutions.push(newSolution);
        }
        return allSolutions;
    }
})();