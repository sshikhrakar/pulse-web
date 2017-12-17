$(document).ready(function(d) {
    var url = getUrlVar('url');
    $("#pulse-content").append('<iframe id="pulse-content-frame" frameborder="0" width="100%" height="100%" src="https://mercury.postlight.com/amp?url='+ url +'" />');
}(document));

function getUrlVar(key){
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search); 
	return result && unescape(result[1]) || ""; 
}
