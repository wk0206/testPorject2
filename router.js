/**
 * Created by wk on 5/30/16.
 */
function route(handle, pathname, response, request, postData) {
    if(pathname!='/favicon.ico'){
        console.log("About to route a request for " + pathname);
    }

    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, request, postData);
    } else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not found");
        response.end();
    }
}

exports.route = route;