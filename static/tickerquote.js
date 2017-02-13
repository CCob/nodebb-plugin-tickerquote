/*
	This file is part of nodebb-plugin-tickerquote.

    nodebb-plugin-tickerquote is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    nodebb-plugin-tickerquote is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with nodebb-plugin-tickerquote.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'

$(document).ready(function () {
  $(window).on('composer:autocomplete:init', function (ev, data) {
    var strategy = {
      match: /\B\$([^\s\n]+[^\n]+)$/,
      search: function (term, callback) {
        if (!term || term.length < 2) {
          return callback([])
        }
		
		$.ajax({
			url: "http://d.yimg.com/aq/autoc?query=" + term + "&region=GB&lang=en-GB",
			type: 'GET',	
			dataType: 'jsonp',
		}).then(function(data) {	
			
			if(data.ResultSet.Result.length == 0){
				callback(['No results']);
			}
			
			var qty = 0;
			var stocks = [];
			
			data.ResultSet.Result.map(function(stock) {
				stocks.push("<span data-symbol='" + stock.symbol + "'>" + stock.name + " (" + stock.exchDisp +  ")<span>");
			});
					
			callback(stocks);				
								
		}, function(data){
			callback(['No results']);
		});		
      },
      index: 1,
      replace: function (selected) {
        if (selected === 'No results') {
          return ''
        }
		
        var ele = $.parseHTML(selected);
        var symbol = $(ele).attr('data-symbol');
		var result = "";
		var successFunction = function(data){
			data = JSON.parse(data.substr(3));
			result = '$[' + symbol + ' ' + data[0].l + ' ' + data[0].cp + '%]'; 			
		};
		
		$.ajax({
			url: 'http://finance.google.com/finance/info?client=ig&q=' + symbol,
			type: 'GET',	
			async: false,
			beforeSend: function(xhr){
			   xhr.withCredentials = true;
			},
			success: successFunction,
			error: function () {
				result = '$[' + symbol + ' Na Na]'; 
			}
		})
		
		return result;
      },
      cache: false
    }

    data.strategies.push(strategy)
    data.options.debounce = 300
	
  })
})
