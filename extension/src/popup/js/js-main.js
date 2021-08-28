$(function () {
    $('.drawer').drawer();

    $('.noUi-handle').on('click', function() {
        $(this).width(50);
    });

    var nonLinearSlider = document.getElementsByClassName('slider-range');

    var moneyFormat = wNumb({
        decimals: 0,
        thousand: ',',
        prefix: '$'
    });

    $(nonLinearSlider).each(function (i, val) {
        noUiSlider.create(nonLinearSlider[i], {
            start: [500000, 1000000],
            step: 1,
            range: {
              'min': [100000],
              'max': [1000000]
            },
            format: moneyFormat,
            connect: true
        });
    });

    // Set visual min and max values and also update value hidden form inputs
    // rangeSlider.noUiSlider.on('update', function(values, handle) {
    //     document.getElementById('slider-range-value1').innerHTML = values[0];
    //     document.getElementById('slider-range-value2').innerHTML = values[1];
    //     document.getElementsByName('min-value').value = moneyFormat.from(
    //       values[0]);
    //     document.getElementsByName('max-value').value = moneyFormat.from(
    //       values[1]);
    // });
})