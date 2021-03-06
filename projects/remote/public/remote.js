$(document).ready(function(){

	$('form.commands').submit(function (data) {
		var query = $('input.query').val();
		$('p.result').text(query);
		$('input.query').val("").data("query", query);;
		$.getJSON('getz/'+query, function(data) {
			$('p.result').html(data.result);
		});
		return false;
	});

	$('input.query').keydown(function(event){
		if(event.which == 38) {
			$('input.query').val($('input.query').data("query"));
		}
	});

	function port_pin () {
		var port = $('[name=port]:checked').attr('value');
		var pin = $('[name=pin]:checked').attr('value');
		return "/"+port+"/"+pin;
	};

	$('[name=port],[name=pin]').click(function(obj){
		$('[name=direction],[name=state]').removeAttr('checked') });

	$('[name=state]').click(function(obj){
		$('[name=direction][value=O]').click();
		$.ajax({ type: 'PUT', url: port_pin() , data: "state="+this.value });
	});

	$('[name=direction][value=I]').click(function(obj){
		$.getJSON(port_pin(), function(data) {
			$('[name=state][value='+data.bit+']').attr('checked',true);
		});
	});

	$('[name=channel]').click(function(obj){
		var ch = obj.currentTarget.value;
		function plot () {
			$.getJSON('ch/'+ch, function (data) {
				$.plot($(".plot"), [data], {});
			});
		}
		plot();
		$(".plot").unbind('click').click(plot);
	});

	$('[name=fft]').click(function(obj){
		var ch = obj.currentTarget.value;
		function plot () {
			$.getJSON('fft/'+ch, function (data) {
				$.plot($(".fft"), [data], {});
			});
		}
		plot();
		$(".fft").unbind('click').click(plot);
	});

	$('#slider').slider({
		min: 660,
		max: 2140,
		value: 1400,
		step: 20,
		animate: true,
		slide: function(event, ui) {
			$.ajax({ type: 'PUT', url: 'slide' , data: "state="+ui.value });
		}
	});

});
