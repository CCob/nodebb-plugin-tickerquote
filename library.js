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

/* global env:false */

'use strict'

var winston = module.parent.require('winston')

var TickerQuote = {}
var debug
var	quoteMarkdown = /\B\$\[([a-zA-z]{1,4}\.?[a-zA-Z]{1,2}) ([+-]?\d+([\,]\d+)*([\.]\d+)?) ([+-]?([0-9]*[.])?[0-9]+%)]/;
var quoteHTMLGreen = '<span class="stock-quote"><span class="stock-quote-index">$1:</span><span class="stock-quote-price">$2</span><span class="stock-quote-change-up">$5</span></span>';	
var quoteHTMLRed = '<span class="stock-quote"><span class="stock-quote-index">$1:</span><span class="stock-quote-price">$2</span><span class="stock-quote-change-down">$5</span></span>';	


TickerQuote.replaceMarkdown = function(postData){
	
	var captures 
	while(captures = quoteMarkdown.exec(postData)){		
		if(captures[5][0] == '+' || captures[5][0] != '-')
			postData = postData.replace(quoteMarkdown, quoteHTMLGreen);
		else
			postData = postData.replace(quoteMarkdown, quoteHTMLRed);
	}
	
	return postData;
}

TickerQuote.onPostParseRaw = function(data, callback){
	
	if(!data){
		callback(null,data);
		return;
	}	
	data = TickerQuote.replaceMarkdown(data);
	callback(null,data);	
}

TickerQuote.onPostParse = function(data, callback) {
		
	if (!data || !data.postData || !data.postData.content) {
		callback(null, data);
		return
	}
	data.postData.content = TickerQuote.replaceMarkdown(data.postData.content);
	callback(null, data);	
}

TickerQuote.getMetaTags = function(data, callback){
	
	if(!data){
		callback(null,data);
	}
	
	data.tags.push({ name: "referrer", content: "no-referrer"});
	callback(null,data);	
}

module.exports = TickerQuote
