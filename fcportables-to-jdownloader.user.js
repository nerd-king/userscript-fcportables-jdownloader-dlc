// ==UserScript==
// @name         fcPortables.com: Add jDownloader linkcontainer direct download buttons
// @namespace    nerd-king
// @version      0.3
// @description  When links to certain download sites are detected it will add a Click'n'Load button to send to jDownloader
// @author       P1R9T3 N3RD
// @match        https://www.fcportables.com/*
// @match        https://www.filecatchers.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

'use strict';
/*
* Get the given URL into a separate DOM object
*/
function getSourceAsDOM(url)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",url,false);
    xmlhttp.send();
    var parser = new DOMParser();
    return parser.parseFromString(xmlhttp.responseText,"text/html");
}

// Find all of the links on the current page
var dlLinks = document.getElementsByTagName("A");

// Establish the pattern that matches a download link
var dlLinkPattern = window.location.href+"?xurl=";

for(var d = dlLinks.length -1; d >= 0; --d)
{
    if(dlLinks[d].href.startsWith(dlLinkPattern))
    {
        var dlForm = getDownloadFormObj(dlLinks[d].href);
        var container = dlLinks[d].parentElement;
        var brEl = document.createElement("br");
        container.appendChild(brEl);
        container.appendChild(dlForm);
    }
}

/*
* Build and return the form object that will become the download link
*/
function getDownloadFormObj(url)
{
    var dlDOM = getSourceAsDOM(url);
    var qLinks = dlDOM.querySelectorAll ("script:not([src])");
    for (var J = qLinks.length - 1; J >= 0; --J)
    {
        var scriptText = qLinks[J].innerHTML;
        if (scriptText.includes("FinishMessage ="))
        {
            // Scrape the URL of the download site
            var finishMsgIndex = scriptText.indexOf("FinishMessage");
            var openTagIndex = scriptText.indexOf("<", finishMsgIndex);
            var hrefStartIndex = scriptText.indexOf("href=", openTagIndex) + 6;
            var hrefEndIndex = scriptText.indexOf("\"", hrefStartIndex);
            var dlUrl = scriptText.substring(hrefStartIndex, hrefEndIndex);

            // Build New Form
            var form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", "http://127.0.0.1:9666/flash/add");
            form.setAttribute("target", "hidden");

            var sourceElement = document.createElement("input");
            sourceElement.setAttribute("type", "hidden");
            sourceElement.setAttribute("name", "source");
            sourceElement.setAttribute("value", window.location.href);

            var urlsElement = document.createElement("input");
            urlsElement.setAttribute("type", "hidden");
            urlsElement.setAttribute("name", "urls");
            urlsElement.setAttribute("value", dlUrl);

            var submitElement = document.createElement("input");
            submitElement.setAttribute("type", "submit");
            submitElement.setAttribute("name", "submit");
            submitElement.setAttribute("value", "Add Link To JDownloader");

            form.appendChild(sourceElement);
            form.appendChild(urlsElement);
            form.appendChild(submitElement);
            return form;
        }
    }
}
