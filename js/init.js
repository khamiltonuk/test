//Share tooltip
(function ($) {
    $.fn.shareTooltip = function (options) {
        
        var settings = $.extend({
            'element': $(this),
            'duration': 500,
            'direction' : 'up'
        }, options);
        popbox = function($el){
            $el.show()
        },
        hidebox = function($el){
            $el.delay(settings.duration).fadeOut()
            //console.log(settings.duration);
        },
        init = function(){
            box = settings.element.find('.pop-up');
            settings.element.hover(function(){
                popbox(box);
            }, function(){
                hidebox(box);
            });
        }
        return init();
    };

})(jQuery);

(function ($) {
    $.fn.slideCarousel = function (options) {
        var rebecca = function () {
            var count = 0,
                $carousel_elements = $('#main-image').find('li'),
                item_width = $carousel_elements.outerWidth(),
                distance = 0,
                amount_slides = $carousel_elements.size(),
                slides = ($carousel_elements.size() - 1),
                inner_width = amount_slides * item_width;
                //console.log(item_width);


            var rebeccasPicks = function () {
                function movement(count) {
                    $('#prev, #next').removeClass('disabled');
                    $carousel_elements.removeClass('current');
                    var distance = item_width * count,
                        indie_bar_distance = ((count - 1) * 36 + 3);
                    $('#main-image').animate({
                        'left': -distance
                    });
                    $carousel_elements.eq(count).addClass('current');

                    if (count === 0) {
                        $('#prev').addClass('disabled');
                    }
                    if (count == slides) {
                        $('#next').addClass('disabled');
                    }
                }

            $$('#main-image').css({
                'width': inner_width
            });

            $('#next').click(function () {
                if (count >= 0 && count < slides) {
                    movement(++count);
                }
            });

            $('#prev').click(function () {
                if (count <= slides && count >= 1) {
                    movement(--count);
                }
            });
            console.log('3');
        };
    };
    return rebecca();
};
})(jQuery);



(function ($) {
    $.fn.searchFlickr = function (options) {
        var url = 'http://api.flickr.com/services/rest/';
        var gallery = $(this);

        var settings = $.extend({
            'api_key': '6591bac6b104953cb9e6944a5b65b509',
            'defaultSearchTerm' : 'dad'
        }, options);
        
        getSearchValue = function(){
            $('#search-submit').click(function(event){
                searchValue = $('#search').val();
                $('#what-you-want').html(searchValue);
                getImages(searchValue);
                event.preventDefault();
            });
        },
        updateMainimage = function(imageSrc){
            newimage = '<li class="active"><img src="' + image_src + '" />';
            $('#main-image').append(newimage);
            $('#main-image').find('.active').siblings().remove();
        },
        updateThumbnailsCurrent = function(newThumb){

        },
        getImages = function(searchTerm){
            $.getJSON(url, {
                method: 'flickr.photos.search',
                api_key: settings.api_key,
                media: 'photos',
                tags: 'dad',//searchTerm,
                per_page: 15,
                format: 'json',
                extras: 'url_q,url_l',
                nojsoncallback: 1,
            }).success(function (state) {
                var list = $('#thumbnails ul'),
                    viewport = $('#main-image');
                list.html('');
                viewport.html(' ');
                $.each(state.photos.photo, function () {
                //(this.isprimary == "1") {
                    viewport.append('<li><img src="' + this.url_l + '" /></li>');//<div class="image-info">' + this.title + '<br />' + this.tags + '</div>');
                    list.append('<li><a href="' + this.url_l + '"><img src="' + this.url_q + '" ' + 'data-title="' + this.title + '" ' + 'data-url="' + this.url_l + '" /></a></li>');
                
                });
                list.find('li:first-child a').addClass('current');
                viewport.find('li:first-child a').addClass('current');
                //gallery.children('h3').html(state.photoset.description._content);
            }).fail(function (state) {
                alert("unable to retrieve photo set information");
            });
        }, 
        thumbnailsEventHandler = function(){
            $('#thumbnails').on('click', 'a', function(event){
                $('#thumbnails li a').removeClass('current');
                event.preventDefault();
                $(this).addClass('current'); 
                image_src = $(this).attr('href');
            });
        },
        nextimage = function(){
            $('#next').on('click', function(e){
                next_image = $('#thumbnails li a').hasClass('.current');//.parent().next().find('a').attr('href');
                alert(next_image);
            });
        }
        init = function(){
            thumbnailsEventHandler();
            getSearchValue();
            //updateMainimage();
            //console.log(settings.defaultSearchTerm);
            getImages();
        }
        return init(); 

    };

})(jQuery);

$(document).on('ready', function () {  
    $('.js-share').shareTooltip();
    $('#main-image').slideCarousel();
    $('div#thumbnails').searchFlickr();
});