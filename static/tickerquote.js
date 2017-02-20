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

String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

$(document).ready(function () {
  $(window).on('composer:autocomplete:init', function (ev, data) {
    var strategy = {
      match: /\B\$([^\s\n\[]+[^\n]+)$/,
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
			
			var limit = 5;	
			var stocks = [];			
			data.ResultSet.Result.some(function (stock) {
				stocks.push(stock.symbol);
				limit--;
				if(limit==0)
					return true;
			});	

			var stockURI = "http://finance.google.com/finance/info?client=ig&q={0}".format(encodeURI(stocks.join(',')));			
			var results = ['No results'];
						
			$.ajax({
				url: stockURI,
				type: 'GET',	
				dataType: 'jsonp'
			}).then(function (data){
				
				stocks = [];
				if(data != null && Array.isArray(data)){
					data.map(function(stock){
						var stockMarkdown = "$[{0} {1} {2}%]"
							.format(stock.t,stock.l,stock.cp != null ? stock.cp : 0);
						stocks.push("<span data-symbol='" + stockMarkdown + "'>" + stock.e + ":" + stock.t + "</span>");					
					});
				}

				callback(stocks);
			});			
								
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
		return $(ele).attr('data-symbol');	;
      },
      cache: false
    }

    data.strategies.push(strategy)
    data.options.debounce = 300
	
  })
})
