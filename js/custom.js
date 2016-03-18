$(document).ready(function () {
    var loadmore = $('#load-more');
    var switcher = $("#infinite-scroll");
    var content = $('#content');

    //stop lazy load if true
    var stopLazyLoad = false;

    //bootstrap-switch initialization
    switcher.bootstrapSwitch('state', false, true);

    //making switcher small-sized
    switcher.bootstrapSwitch({
        size: 'small'
    });

    //hide loadmore button if switcher is turned on
    switcher.on('switchChange.bootstrapSwitch', function (event, state) {
        state ? loadmore.fadeOut('fast') : loadmore.fadeIn('fast');
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() === $(document).height() - $(window).height()) {
            runLazyLoad();
        }
    });

    loadmore.on('click', function () {
        runLazyLoad();
    });

    function lazyLoad() {
        $.ajax({
            url: '/data/items.json',
            cache: false,
            success: function (data) {
                $.each(data, function (index, value) {
                    if ((index + 1) === data.length) {
                        stopLazyLoad = true;
                    }
                    $.get('/template/template.html', function (data) {
                        data = $.parseHTML(data);
                        data.filter(function (data) {
                            $(data).find('img').attr('src', value.image);
                            $(data).find('.title').html(value.title);
                            $(data).find('.description').html(value.paragraph);
                            if ($(data).is('[class^="col-"]')) {
                                var n = 3; //each nth element; equals to column number
                                if (index % n === 0) {
                                    data.className = data.className + ' text-center text-md-right';
                                }
                                if ((index + 1) % n === 0) {
                                    data.className = data.className + ' text-center text-md-left';
                                }
                                if ((index + 2) % n === 0) {
                                    data.className = data.className + ' text-center';
                                }
                            }
                        });
                        content.last().append(data);
                    });
                });
            },
            error: function () {
                alert('Error!');
            },
            complete: function () {
                console.log('complete');
            }
        });
    }

    function runLazyLoad() {
        if (stopLazyLoad) {
            loadmore.remove();
            return;
        }
        lazyLoad();
    }
});