$(document).ready(function(){
	
	 /*$("select").change(function() {
	    $(this).blur();
	    $(this).focus();
	 });
*/


//Index Page Carousel

$(window).load(function(){

	if ($(window).width() < 768) {
		var wrapWidth = $('.servCar').width();
		var totalMargin = 0;
		var listWidth = $('.servCar ul').outerWidth(true);
		etemWidth = $('.servCar ul li').outerWidth(true);

		if (listWidth > wrapWidth) {
		  $('#rightControl').show();
		}

		$(window).resize(function(){
			wrapWidth = $('.servCar').width();
			listWidth = $('.servCar ul').outerWidth(true);
			etemWidth = $('.servCar ul li').outerWidth(true);

			if (listWidth > wrapWidth) {
			  $('#rightControl').show();
			} else {
				$('#rightControl, #leftControl').hide();
				$('.servCar ul').stop(true, true).animate({'margin-left': '0px'}, 300);
				totalMargin = 0;
				listWidth = $('.servCar ul').outerWidth(true);
			}
		});

		$('#rightControl').click(function(){
			$('#leftControl').show();
			if(listWidth - wrapWidth > etemWidth) {
				$('.servCar ul').stop(true, true).animate({'margin-left': (totalMargin - etemWidth)}, 300, function(){
					totalMargin = totalMargin - etemWidth;
					listWidth = $('.servCar ul').outerWidth(true);
				});		
			} else {
				$('.servCar ul').stop(true, true).animate({'margin-left': (totalMargin - (listWidth - wrapWidth))}, 300, function(){
					totalMargin = totalMargin - (listWidth - wrapWidth);
					listWidth = $('.servCar ul').outerWidth(true);
				});
				$('#rightControl').hide();
			}
		});

		$('#leftControl').click(function(){
			$('#rightControl').show();
			if(totalMargin < (etemWidth * -1)) {
				$('.servCar ul').stop(true, true).animate({'margin-left': (totalMargin + etemWidth)}, 300, function(){
					totalMargin = totalMargin + etemWidth;
					listWidth = $('.servCar ul').outerWidth(true);
				});		
			} else {
				$('.servCar ul').stop(true, true).animate({'margin-left': '0px'}, 300, function(){
					totalMargin = 0;
					listWidth = $('.servCar ul').outerWidth(true);
				});
				$('#leftControl').hide();
			}
		});

		$(".servCar").touchwipe({
		     wipeRight: function() { $('#leftControl:visible').click(); },
		     wipeLeft: function() { $('#rightControl:visible').click(); },
		     min_move_x: 20,
		     min_move_y: 20,
		     preventDefaultEvents: false
		});

	}


	$('.search-serv input').focus(function(){
		if($('.third_level').is(':visible')) {
			$('.search_results td').hover(function(){
				$(this).css('color','#2E8F64');
			}, function(){
				$(this).css('color','#444');
			});
		}

	});

});

//Date of birth input (automatically go to next after previous filled up)

/*$('.input-grouped input').each(function(){
	var maxLength = $('.input-grouped input').attr('maxlength');

	$('body').on('keyup', '.input-grouped input', function(){
		var inpNumber = $('.input-grouped input').index($(this));	
			
		if ($(this).val().length == maxLength){
			$('.input-grouped input').eq(inpNumber + 1).focus();
		}
	});
});*/

});
