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
                value: []
            }
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
        numberFormat: function (value, decimals) {
            if (isNaN(value)) {
                return '';
            } else {
                value = Number(value);
                value = value.toFixed(decimals);
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                return value;
            }
        }
    });

    function calculateSolutions(options) {
        var possibleGauges = options.gaugeModel.getGaugesWithinTwoSteps(options.targetGauge);
        var primaryGauge = options.targetGauge;

        possibleGauges.forEach(function (primaryGauge) {
            possibleGauges.forEach(function (secondaryGauge) {
                if (primaryGauge != secondaryGauge) {
                    var solutionsForPair = findAllSolutionsForPair(primaryGauge, secondaryGauge, options.targetCM);
                    solutionsForPair.forEach(function (newSolution) {
                        options.element.push('solutions', newSolution);
                    });
                }
            });
        });
    }

    function findAllSolutionsForPair(primaryGauge, secondaryGauge, targetCM) {
        var allSolutions = [];
        var maxCount = Math.round(targetCM / primaryGauge.circularMils);
        for (var primaryCount = 1; primaryCount <= maxCount; primaryCount++) {
            var primaryCircularMils = primaryCount * primaryGauge.circularMils;
            var secondaryCount = Math.round((targetCM-primaryCircularMils) / secondaryGauge.circularMils);
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