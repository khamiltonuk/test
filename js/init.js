//Share tooltip
(function ($) {
    $.fn.shareTooltip = function (options) {

        var settings = $.extend({
            'element': $(this),
            'duration': 500,
            'direction': 'up'//I probably would extend this an test if tool tip was in the viewport
        }, options);
        popbox = function ($el) {
            $el.show();
        },
        hidebox = function ($el) {
            $el.delay(settings.duration).fadeOut();
            //console.log(settings.duration);
        },
        init = function () {
            var box = settings.element.find('.pop-up');
            settings.element.hover(function () {
                popbox(box);
            }, function () {
                hidebox(box);
            });
        };
        return init();
    };

})(jQuery);

//Carousel 
(function ($) {
    $.fn.slideCarousel = function (options) {
        var settings = $.extend({
            'element': $(this),
            'animationDuration': 500,
            'direction': 'up'
        }, options);

        var count = 0,
            $carousel_elements = settings.element.find('li'),
            item_width = $('#frame').outerWidth(),
            distance = 0,
            amount_slides = $carousel_elements.length,
            slides = $carousel_elements.length - 1,
            inner_width = amount_slides * item_width,
            thumbnails_links = $('#thumbnails li a');

        function movement(count,animate) {
            $('#prev, #next').removeClass('disabled');
            $carousel_elements.removeClass('current');
            thumbnails_links.removeClass('current');
            var distance = item_width * count,
                indie_bar_distance = ((count - 1) * 36 + 3);
            if (animate === false){
                settings.element.css({
                    'left': -distance
                });
            }else{
                settings.element.animate({
                    'left': -distance
                }, settings.animationDuration );
            }
            
            $carousel_elements.eq(count).addClass('current');
            $('#thumbnails li a').eq(count).addClass('current');

            if (count === 0) {
                $('#prev').addClass('disabled');
            }
            if (count == slides) {
                $('#next').addClass('disabled');
            }
        }

        var mainImage = document.getElementById('main-image');
        mainImage.style.width = inner_width + 'px';

        $('.arrow').on('click', function (event) {
            if (event.target.id == "next" && count >= 0 && count < slides) {
                movement(++count);
            }
            if (event.target.id == "prev" && count <= slides && count >= 1) {
                movement(--count);
            }
            event.preventDefault();
        });
        
        $('#thumbnails').on('click', 'a', function (e) {
            var thumbsIndex = $(this).parent().index();
            movement(thumbsIndex, false);
            e.preventDefault();
        });  
    };
})(jQuery);


//getting the images from flickr
(function ($) {
    $.fn.searchFlickr = function (options) {
        var url = 'http://api.flickr.com/services/rest/',
            gallery = $(this);

        var settings = $.extend({
            'api_key': '6eada3f33715e9c7005d6e278e98cb2c'
        }, options);

        getSearchValue = function () {
            $('#search-submit').click(function (event) {
                var searchValue = $('#search').val();
                $('#what-you-want').html(searchValue);
                getImages(searchValue);
                event.preventDefault();
            });
        },
        getImages = function (searchTerm) {
            
        $('#message').html('Please wait...').fadeIn();
            $.getJSON(url, {
                method: 'flickr.photos.search',
                api_key: settings.api_key,
                media: 'photos',
                tags: searchTerm,
                per_page: 15,
                format: 'json',
                extras: 'url_q,url_l,owner_name,',
                nojsoncallback: 1
            }).success(function (state) {
                var list = $('#thumbnails ul'),
                    viewport = $('#main-image');
                list.html('');
                viewport.html(' ');
                $.each(state.photos.photo, function () {
                    viewport.append('<li><img src="' + this.url_l + '" alt="' + this.title + '" data-ownername="' + this.ownername + '"/></li>'); 
                    list.append('<li><a href="' + this.url_l + '"><img src="' + this.url_q + '" ' + 'data-title="' + this.title + '" ' + 'data-url="' + this.url_l + '" /></a></li>');
                });
                $('#message').fadeOut().html(' ');

                $('#main-image').slideCarousel();

                list.find('li:first-child a').addClass('current');
                var firstImage = viewport.find('li:first-child');
                
                firstImage.addClass('current');
                setOwnerText(firstImage);
            }).fail(function (state) {
                $('#message').html('oops something has gone wrong').fadeIn();
            });
        },
        setOwnerText = function(image){
            var ownerName = image.find('img').data("ownername");
            if (ownerName){
                $('#owner-name').html(ownerName);
            }else {
                $('#owner-name').html('Unknown');
            }
            $('#description').fadeIn();
        },
        init = function () {
            oname = document.getElementById('description');
            oname.style.display = 'none';
            getSearchValue();
            getImages('mum');
        };
        return init();

    };

})(jQuery);

document.addEventListener('DOMContentLoaded', function(){
    $('.js-share').shareTooltip();
    $('div#thumbnails').searchFlickr();
});