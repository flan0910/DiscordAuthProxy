$('iframe')
    .on('load', function(){
        re('iframe');
    }
).trigger('load'); 

$(window).resize(function(){
    re('iframe');
});

function re(dat){
    $(dat).height(window.innerHeight - $('nav').innerHeight());
}
