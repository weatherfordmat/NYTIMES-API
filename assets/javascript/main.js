$(document).ready(function() {
	$("input").keyup(function(event){
    if(event.keyCode == 13){
        $(".search").click();
    }
});

$('.search').click(function() {
        var query = $('.query').val() === "" ? $('.query').html("").css('background-color', 'red').css('opacity', '0.5').css('color', 'white') : $('.query').val();
        var number = $('.number').val() === "" ? 09 : $('.number').val();
        var start = $('.start').val() === "" ? 1990 : $('.start').val();
        var end = $('.end').val() === "" ? 2016 : $('.end').val();
        pages = Math.ceil(number / 10);

        lastDigit = number.split('').pop();

        if (pages > 1) {
       	for (var i = 0; i < pages; i++) {
       		var button = $('<button class="btn btn-default numeros">' +i +'</button>');
       		$('.here').append(button);
       		
       	}
       	$('.here').append('<button class="btn btn-default last">Last</button>')
       }

       $('body').on('click', '.last', function() {
       	

       	$('.results').html('');
       		getResults(pages, lastDigit);
       })

       	$('body').on('click', '.numeros',function() {
       		$('.results').html('');
       		newpage = ($(this).text());
       		place = pages- 1
       		if ($(this).text() == place) {
       			getResults(newpage, lastDigit);
       		}
       		else {
       			getResults(newpage, 9);
       	}
       	})



        function getResults(num, limit) {
        	console.log(num, end, start, number, query);
            var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
            url += '?' + $.param({
            	'offset': 2,
                'api-key': '63915b3d1e1648e1be109877b95a8c1e',
                'q': query,
                'begin_date': start + "0101",
                'end_date': end + "0101",
                'page': num
            });
            $.get({
                url: url
                
            }).done(function(result) {
                
                console.log(result);
                //console.log(JSON.stringify(result));
                    for (var i = 0; i < limit; i++) {
                    	abstract = result.response.docs[i].abstract === null ? "Click on link to read more" : result.response.docs[i].abstract;
                    	year = result.response.docs[i].pub_date.substring(0,4);
                    	month = result.response.docs[i].pub_date.substring(5,7);
                    	day = result.response.docs[i].pub_date.substring(8,10);
                       $('.results').append("<a target='_new' href=" + result.response.docs[i].web_url + ">"+ result.response.docs[i].headline.main + "</a><ul><li style='font-style: italic'><strong>Abstract: </strong>"+abstract +"</li><li><strong>Lead Paragraph: </strong>"+result.response.docs[i].lead_paragraph +"</li><li><strong>Published: </strong>"+month +"/" +day +"/" +year +"</li><ul><br>");
                    }
                    
            }).fail(function(err) {
                
                
                throw err;
            });
        }
      getResults(0, 9)
    });

    $('.clear').click(function() {
        $('.results').html('');
        $('.here').html('')
    })
});