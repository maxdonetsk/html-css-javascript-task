$(document).ready(function () {
    var loadmore = $('#load-more');
    var switcher = $("#infinite-scroll");
    
    switcher.bootstrapSwitch('state', false, true);

    switcher.bootstrapSwitch({
        size: 'small'
    });

    switcher.on('switchChange.bootstrapSwitch', function (event, state) {
        state ? loadmore.fadeOut('fast') : loadmore.fadeIn('fast');
        
    });
});