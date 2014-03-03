//Share tooltip
(function ($) {
    $.fn.shareTooltip = function (options) {
        var popbox, hidebox, init;

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
            'animationDuration': 400,
            'direction': 'up'
        }, options);

        var count = 0,
            carousel_elements = settings.element.find('li'),
            item_width = $('#frame').outerWidth(),
            distance = 0,
            amount_slides = carousel_elements.length,
            slides = carousel_elements.length - 1,
            inner_width = amount_slides * item_width,
            thumbnails_links = $('#thumbnails li a');
            

        function movement(count,animate) {
            $('#prev, #next').removeClass('disabled');
            carousel_elements.removeClass('current');
            thumbnails_links.removeClass('current');
            
            var distance = item_width * count;

            if(typeof(animate)==='undefined') animate = true;

            if (animate === false){
                settings.element.css({
                    'left': -distance
                });
            }else{
                settings.element.stop(true,true).animate({
                    'left': -distance
                }, settings.animationDuration );
            }
            
            var currentSlide = carousel_elements.eq(count);
            currentSlide.addClass('current');
            $('#thumbnails li').eq(count).find('a').addClass('current');

            setOwnerText(currentSlide);

            if (count === 0) {
                $('#prev').addClass('disabled');
            }
            if (count == slides) {
                $('#next').addClass('disabled');
            }
        }

        var mainImage = document.getElementById('main-image');

        mainImage.style.width = inner_width + 'px';

        $('#next').on('click', function (event) {
            if (count >= 0 && count < slides) {
                movement(++count);
            }
            event.preventDefault();
        });
        $('#prev').on('click', function (event) {
            if (count <= slides && count >= 1) {
                movement(--count);
            }
            event.preventDefault();
        });
        
        $('#thumbnails').on('click', 'a', function (e) {
            count = $(this).parent().index();
            movement(count, false);
            e.preventDefault();
        });  
    };
})(jQuery);

function setOwnerText(image){
    var ownerName = image.find('img').data("ownername"),
        ownerNameElement = $('#owner-name');
    if (ownerName){
        ownerNameElement.html(ownerName);
    }else {
        ownerNameElement.html('Unknown');
    }
    $('#description').fadeIn();
}

//getting the images from flickr
(function ($) {
    $.fn.searchFlickr = function (options) {
        var settings = $.extend({
            'api_key': '6eada3f33715e9c7005d6e278e98cb2c',
            'imagesRequired' : 15, //CSS supports numbers divisable by 5
            'defaultSearchTerm' : "glastonbury" 
        }, options);

        var url = 'http://api.flickr.com/services/rest/',
            gallery = $(this),
            page = 1,
            searchTerm = settings.defaultSearchTerm,
            getSearchValue, getImages,pagnation, init;

        getSearchValue = function () {
            $('#search-submit').click(function (event) {
                var searchTerm = $('#search').val();
                getImages(searchTerm, 1);
                event.preventDefault();
            });
        },
        getImages = function (searchTerm,page) {

            $('#message').html('Please wait...').fadeIn();
                $.getJSON(url, {
                    method: 'flickr.photos.search',
                    api_key: settings.api_key,
                    media: 'photos',
                    tags: searchTerm,
                    per_page: settings.imagesRequired,
                    format: 'json',
                    extras: 'url_q,url_l,owner_name,',
                    nojsoncallback: 1,
                    page : page 
                }).success(function (state) {
                    if (state.photos.photo.length > 0){

                        var list = $('#thumbnails ul'),
                            viewport = $('#main-image');

                        list.html('');
                        viewport.html(' ');

                        $.each(state.photos.photo, function () {
                            this.url_l = this.url_l || 'img/missing-image.jpg';
                            viewport.append('<li><img src="' + this.url_l + '" alt="' + this.title + '" data-ownername="' + this.ownername + '"/></li>'); 
                            list.append('<li><a href="' + this.url_l + '"><img src="' + this.url_q + '" ' + 'data-title="' + this.title + '" ' + 'data-url="' + this.url_l + '" /></a></li>');
                        });

                        $('#message').fadeOut().html(' ');
                        $('#what-you-want').html(searchTerm);
                        $('#main-image').slideCarousel();

                        $('#thumbnails-pagnation a').removeClass('current');

                        list.find('li:first-child a').addClass('current');
                        var firstImage = viewport.find('li:first-child');
                        firstImage.addClass('current');

                        $('#thumbnails-pagnation ul li').eq(page - 1).find('a').addClass('current');
                        
                        setOwnerText(firstImage);
              
                    }else{
                        $('#message').html('no results found for' + searchTerm + ', please try again');
                    }


                }).fail(function (state) {
                    $('#message').html('oops something has gone wrong').fadeIn();
                });
            },
            pagnation = function (searchTerm){
                var MAX_PAGE = $('#thumbnails-pagnation ul li').length;

                $('#thumbnails-pagnation').on('click', 'a', function(event){

                var page = $('#thumbnails-pagnation').find('.current').parent().index();
                    
                    if($(this).parent('li')){
                        page = $(this).parent('li').index() + 1;
                        getImages(searchTerm,page);
                    }
                    if(event.target.parentNode.id == 'first-frame'){
                        page = 1;
                        getImages(searchTerm,1);
                    }
                    if(event.target.parentNode.id == 'last-frame'){
                        page = MAX_PAGE;
                        getImages(searchTerm,MAX_PAGE);
                    }
                    if(event.target.parentNode.id == 'prev-frame' ){
                        getImages(searchTerm,page--);
                    }
                    if(event.target.parentNode.id == 'next-frame'  ){
                        getImages(searchTerm,page++);
                    }
                    
                    event.preventDefault();
                });

            },
            init = function () {
                var oname = document.getElementById('description');

                oname.style.display = 'none';
                getImages(searchTerm,page);
                getSearchValue();
                //pagnation();
            }
        return init();

    };

})(jQuery);

document.addEventListener('DOMContentLoaded', function(){

    document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/g, '') + 'js';

    $('.js-share').shareTooltip();
    $('#thumbnails').searchFlickr();
});
