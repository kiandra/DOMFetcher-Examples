/*global XMLHttpRequest,console,ActiveXObject*/

var DOMFetch = (function () {

    "use strict";

    /*
		params = {
			url: "http://somethingtofetch",
			selector: "#something ul li",
			isCached: false,
			callback: function(data) {
				something();
			}
		}

	*/

    var DOMFetchURL = "http://domfetcher.cloudapp.net";
    var slug = null;
    var hasCORS = (function () {
        if ("withCredentials" in new XMLHttpRequest()) {
            return true;
        } else if (window.XDomainRequest) {
            return true;
        } else {
            return false;
        }
    }());



    // helper - $.AJAX
    if (typeof XMLHttpRequest === "undefined") {
        XMLHttpRequest = function () {
            try {
                return new ActiveXObject('Msxml2.XMLHTTP.6.0');
            } catch (e) { }
            try {
                return new ActiveXObject('Msxml2.XMLHTTP.3.0');
            } catch (e) { }
            try {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }
            catch (e) { }
            throw new Error('This browser does not support XMLHttpRequest.');
        };
    }


    // helper - $.AJAX
    var getCORS = function (url, callback) {
        var xmlresponse;
        var POSTString = "fetchURL=" + url;
        POSTString += (slug !== null) ? "&slug=" + slug : "";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', DOMFetchURL);
        xmlhttp.send("fetchURL=" + url);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                if (xmlhttp.responseXML) {
                    xmlresponse = xmlhttp.responseXML;
                } else if (xmlhttp.responseText) {
                    xmlresponse = xmlhttp.responseText;
                }
                callback(xmlresponse);
            }
        };
    };


    // helper - $.getJSON
    var getJSONP = function (params) {

        var callbackid = Math.floor(Math.random() * 100000);

        DOMFetch["callback" + callbackid] = params.callback;
        DOMFetch["error" + callbackid] = params.error;

        var getURL = DOMFetchURL + "?url=" + encodeURIComponent(params.url);
        getURL += "&selector=" + encodeURIComponent(params.selector);
        getURL += "&uniqueid=" + callbackid;
        if (params.type) {
            getURL += "&type=" + params.type;
        }
        if (params.runon) {
            getURL += "&runon=" + params.runon;
        }
        if (params.timeout) {
            getURL += "&timeout=" + params.timeout;
        }
        console.log(getURL);

        var fileref = document.createElement("script");
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", getURL);
        document.body.appendChild(fileref);

    };


    var get = function (params) {
        //if (hasCORS) {
        // $.get(params.url)
        //getCORS(params.url,params.callback);
        //} else {
        // $.getJSON(params.url)
        getJSONP(params);
        //}
    };

    return {
        get: get,
        hasCORS: hasCORS
    };

}());