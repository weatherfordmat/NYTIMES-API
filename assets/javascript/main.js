$(document).ready(function() {
    $("input").keyup(function(event) {
        
        if (event.keyCode == 13) {
            $(".search").click();
          
        }
    });
    $('.search').click(function() {
        var query = $('.query').val() === "" ? $('.query').html("") && checkInput() : $('.query').val();
        var number = $('.number').val() === "" ? "11" : $('.number').val();
        var start = $('.start').val() === "" ? 1990 : $('.start').val();
        var end = $('.end').val() === "" ? 2016 : $('.end').val();
        pages = Math.ceil(number / 10);
        lastDigit = number.split('').pop();

        function checkInput() {
            var err = $('.err');
            function unblur() {
                  $('input').css('filter', 'blur(0px)')
                  $('.results').css('filter', 'blur(0px)');
              }
            $('input').css('filter', 'blur(5px)');
            $('.results').css('filter', 'blur(5px)');
            if ($('.query').val() === "") {
                err.text('Query must Be Inserted');
                $('.query').css('outline', 'none').css('border-color', '#FF0000').css('box-shadow', '0 0 5px #FF0000');
             setTimeout(unblur, 100);
            } else if (number / 1 != number) {
                err.text("Articles requested must be in numerical format!");
                $('.number').css('outline', 'none').css('border-color', '#FF0000').css('box-shadow', '0 0 5px #FF0000');
              setTimeout(unblur, 100);
            } else if (start / 1 != start) {
                err.text("Start date must be in numerical format!");
                $('.start').css('outline', 'none').css('border-color', '#FF0000').css('box-shadow', '0 0 5px #FF0000');
              setTimeout(unblur, 100);
            } else if (end / 1 != end) {
                err.text("End date must be in numerical format!")
                $('.end').css('outline', 'none').css('border-color', '#FF0000').css('box-shadow', '0 0 5px #FF0000');
              setTimeout(unblur, 100);
            } else {
                if (number < 10) {
                  getResults(0, number)
                }
                else {
                  getResults(0, 9);
                }
                setTimeout(unblur, 500);
                
            }
        }
        if (pages > 1) {
            for (var i = 0; i < pages; i++) {
                var button = $('<button class="btn btn-default numeros">' + i + '</button>');
                $('.here').append(button);
            }
            $('.here').append('<button class="btn btn-default last">Last</button>')
        }
        $('.jumbotron').on('click', '.last', function() {
            $('.results').html('');
            $('.sectional').remove();
            
            getResults(pages, lastDigit);
        })
        $('body').on('click', '.numeros', function() {
            $('.results').html('');
            $('.sectional').remove();
            newpage = ($(this).text());
            place = pages - 1
            if ($(this).text() == place) {
                getResults(newpage, lastDigit);
            } else {
                getResults(newpage, 9);
            }
        })

        function getResults(num, limit) {
            $('.results').html('');
            $('.results').append("<img src='http://bestanimations.com/Science/Gears/loadinggears/loading-gear.gif'>");
            console.log('Fetching. . .');
            //$('.query').css('background-color', 'white').css('color','black');
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
                console.log('Fetched. . .');
                console.log(result);
                //console.log(JSON.stringify(result));
                $('.results').html('');
                $('input').hide();
                $('.err').html('')
                var research = $("<div class='col-md-2 sectional'><p><a class='btn btn-success btn-lg new' href='#' role='button'>New Search</a></p></div></div>")
                $('.actions').append(research);
                for (var i = 0; i < limit; i++) {
                    abstract = result.response.docs[i].abstract === null ? "Click on link to read more" : result.response.docs[i].abstract;
                    year = result.response.docs[i].pub_date.substring(0, 4);     
                    month = result.response.docs[i].pub_date.substring(5, 7);
                    day = result.response.docs[i].pub_date.substring(8, 10);
                    
                    $('.results').append("<a target='_new' href=" + result.response.docs[i].web_url + ">" + result.response.docs[i].headline.main + "</a><ul><li style='font-style: italic'><strong>Abstract: </strong>" + abstract + "</li><li><strong>Lead Paragraph: </strong>" + result.response.docs[i].lead_paragraph + "</li><li><strong>Published: </strong>" + month + "/" + day + "/" + year + "</li><ul><br>");
                    console.log('Patching. . .');
                }
            }).fail(function(err) {
                $('.err2').html("No Results Found");
                $('.results').html('');
                $('.here').html('');
                throw err;
            });
        }
        checkInput();

        $('.jumbotron').on('click', '.new', function() {
          $('input').show();
          $('.new').remove();
        })
    });
    $('.clear').click(function() {
        $('.results').html('');
        $('.here').html('')
    })
});