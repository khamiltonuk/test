Flickr app
==========

My solution calls on the flikr api using javascript, return some json file which is used to populate the page

structure
---------

The application has been divied into three hand coded extendable plugins

**shareTooltip()**
This is simply for the share tooltip, I've divided out the function for maximum reusabilty.Breaking simple interaction down allows for particial reuse. If I was to spend more time on this functionality I insure the tool tip could be fired in multiple directions eg: left, right up or down, even furthe development would detect the tool tip would appear in the viewport and adjusting accordinly. 

**searchFlickr()**
This fires of the json request and populates the DOM with the relivant content;
I requires a few elemewnts to be present on the page.

**slideCarousel()**
Once the json has succesfully been retrieved I fire the slideCarousel(); which adds event listeners and behaviours to the newly applied content.

Apologies about my naming conventions, I'm currently reading the book maintainable javascript by nicholas c. zakas.

thing to extend
* animate when page loaging on pagnation
* auto generate pagnation elements depending on variable