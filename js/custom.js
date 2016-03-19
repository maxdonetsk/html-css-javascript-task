$(document).ready(function () {
    var loadmore = $('#load-more');
    var switcher = $("#infinite-scroll");
    var content = $('#content');

    //bootstrap-switch initialization
    switcher.bootstrapSwitch({
        state: false
    });

    //hide loadmore button when switcher is on
    switcher.on('switchChange.bootstrapSwitch', function (event, state) {
        if (state) {
            loadmore.fadeOut('fast');
            lazyLoad();
            infiniteScroll();

        } else {
            loadmore.fadeIn('fast');
            $(window).unbind('scroll'); //this shit works
            return; //this shit doesn't work
        }
    });

    loadmore.on('click', function () {
        lazyLoad();
    });

    function lazyLoad() {
        $.ajax({
            url: '/data/items.json',
            cache: false,
            success: function (data) {
                $.each(data, function (index, value) {
                    $.get('/template/template.html', function (data) {
                        data = $.parseHTML(data);
                        data.filter(function (data) {
                            $(data).find('img').attr('src', value.image);
                            $(data).find('.title').html(value.title);
                            $(data).find('.description').html(value.paragraph);
                            for (var i = 0; i < value.rating; i++) {
                                $(data).find('.rating > span').eq(i).addClass('active');
                            }
                            if ($(data).is('[class^="col-"]')) {
                                //it's better to implemented this feature in css, but i'm lazy
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
                            content.last().append(data);
                        });
                    });
                });
            },
            error: function () {
                alert('Error!');
            }
        });
    }

    function infiniteScroll() {
        $(window).scroll(function () {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                lazyLoad();
            }
        });
    }
});