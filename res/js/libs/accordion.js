jQuery.fn.initMenu = function() {
    return this.each(function(){
        var theMenu = $(this).get(0);
        //$('.storiesToldContent', this).hide();
        $('li.expand > .accountbox', this).show();
        $('li.expand > .accountbox', this).prev().addClass('active');
        $('li .link', this).click(
            function(e) {
                e.stopImmediatePropagation();
                var theElement = $(this).next();
                var parent = this.parentNode.parentNode;
                if($(parent).hasClass('noaccordion')) {
                    if(theElement[0] === undefined) {
                        window.location.href = this.href;
                    }
                    $(theElement).slideToggle('normal', function() {
                        if ($(this).is(':visible')) {
                            $(this).prev().addClass('active');
                        }
                        else {
                            $(this).prev().removeClass('active');
                        }
                    });
                    return false;
                }
                else {
                    if(theElement.hasClass('accountbox') && theElement.is(':visible')) {
                        if($(parent).hasClass('collapsible')) {
                            $('.accountbox:visible', parent).first().slideUp('normal',
                            function() {
                                $(this).prev().removeClass('active');
                            }
                        );
                        return false;
                    }
                    return false;
                }
                if(theElement.hasClass('accountbox') && !theElement.is(':visible')) {
                    $('.accountbox:visible', parent).first().slideUp('normal', function() {
                        $(this).parent('li:eq(0)').removeClass('active');
                    });
                    theElement.slideDown('fast', function() {
                        $(this).parent('li:eq(0)').addClass('active');
                    });
                    return false;
                }
            }
        }
    );
});
};

$(document).ready(function() {$('.importuser').initMenu();});