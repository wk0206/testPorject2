/**
 * Created by wk on 5/30/16.
 */
var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var postData = "";
        if(pathname!='/favicon.ico'){
            console.log("Request for " + pathname + " received.");
        }
        //console.log("Request for " + pathname + " received.");
        route(handle, pathname, response, request, postData);
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;