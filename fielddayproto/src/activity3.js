
var apiKey = "apikey=a2abf1ee&";
let mainId = '';
let respSpace = document.getElementById("search-by-id-response");
let reqSpace = document.getElementById("search-by-id-request");
let recomSpace = document.getElementById("recommendations");
let breadCrumbs = [];
let termHist = [];


function getRequestObject() {
    if (window.XMLHttpRequest) {
        return(new XMLHttpRequest());
    } else {
        return(null);
    }
}
function crumbHist(terms){
    var start = terms.indexOf('&');
    if (start > 0){
        terms = terms.substring(start,terms.length);
    }
    termHist.push(terms);
    var html = '';
    var entries = sessionStorage.getItem("entries");
    entries = JSON.parse(entries);

    for (var key in entries){
            html += "<a href =# onclick= breadQuery('"+ encodeURI(entries[key])+
                "')>"+ termHist[key] +"> </a>";
    }

    document.getElementById("breadCrumbs").innerHTML=html;

}

function breadQuery(address){
    sessionStorage.clear();
    breadCrumbs = [];
    termHist = [];
    ajaxResult(decodeURI(address));
}

function ajaxResult(address) {
    var request = getRequestObject();
    // var encAdd = encodeURI(address);
    breadCrumbs.push(address);
    sessionStorage.setItem("entries", JSON.stringify(breadCrumbs));
    let termURL = new URL(address);
    let params = termURL.searchParams.toString();

    crumbHist(params);
    request.onreadystatechange =
        function() { showResponseText(request); };
    request.open("GET", address, true);
    request.send(null);

    ajaxRecs(address);
}

function ajaxRecs(address, mainId){

    var request = getRequestObject();

    request.onreadystatechange =
        function(){showRecs(request, mainId);
        };
    request.open("GET",address,true);
    request.send(null);
}

function showRecs(request, mainId){
    if ((request.readyState == 4) &&
        (request.status == 200)) {
        var json = JSON.parse(request.response);
        var html = '';
        let recs = [];
        let i = 0;
        let count =0;

        for (i ; count< 5; i++) {
            // if(rating !== null){ html += '<li><b>Star Rating: '+ rating+ '</b></li>'}
            if(mainId !== json.Search[i].imdbID) {

                html = '<ul style = "list-style-type: none">';
                if(localStorage.getItem(json.Search[i].imdbID) !== null){
                    html += '<li><b>Star Rating: '+localStorage.getItem(json.Search[i].imdbID)+'</b></li>'
                }
                html+=
                    '<li><b> Title: ' + json.Search[i].Title + '</b></li>' +
                    '<li><b>Year: ' + json.Search[i].Year + '</b></li>' +
                    '<li><b>Type: ' + json.Search[i].Type + '</b></li>' +
                    '<li><b> imdbID: ' + json.Search[i].imdbID + ' </b></li>' +
                    '<li><img src=' + json.Search[i].Poster + '></li></ul>';
                recs.push(html);
                count++;
            }
        }
        var movieRec1 = document.getElementById("movie-rec-1");
        var movieRec2 = document.getElementById("movie-rec-2");
        var movieRec3 = document.getElementById("movie-rec-3");
        var movieRec4 = document.getElementById("movie-rec-4");
        var movieRec5 = document.getElementById("movie-rec-5");

        movieRec1.innerHTML = recs[0];
        movieRec2.innerHTML = recs[1];
        movieRec3.innerHTML = recs[2];
        movieRec4.innerHTML = recs[3];
        movieRec5.innerHTML = recs[4];
        recomSpace.setAttribute('style', "display: table");
    }
}

function showResponseText(request) {
    if ((request.readyState == 4) &&
        (request.status == 200)) {

        let keyURL = new URL(request.responseURL);
        let params = keyURL.searchParams;
        let title = params.get('t');
        let year = params.get('y');
        let idParam = params.get('i');
        let plot = params.get('plot');
        let resp = params.get('r');
        let rating = '';



        let searchTerm = "";

        let safeURL = "http://www.omdbapi.com/?";
        let recURL = "http://www.omdbapi.com/?";

        if(title !== null){
            safeURL = safeURL + "t=" + title;
        }
        if(year !== null){
            safeURL = safeURL + "&y=" + year;
        }
        if(idParam !== null){
            safeURL = safeURL + "i=" + idParam;
        }
        if(plot !== null){
            safeURL = safeURL + "&plot=" + plot;
        }
        if(resp !== null){
            safeURL = safeURL + "&r=" + resp;
        }

        if(request.responseXML !== null){
            var movie = request.responseXML.getElementsByTagName("movie")[0];

            mainId = movie.attributes[17].textContent;
            rating = localStorage.getItem(mainId);
            if(title !== null) {
                searchTerm = 's=' + title;
            }else{
                const queryArr = movie.attributes[0].textContent.split(" ");
                if(queryArr.length > 1) {
                    searchTerm = 's=' + queryArr[0] + " " + queryArr[1];
                }else{
                    searchTerm = 's=' + queryArr[0]
                }
            }

            var html = '<ul style = "list-style-type: none">';
            html += "<img src = " + movie.attributes[13].textContent + "></a>";
            if(rating !== null){
                html += '<li><b>Star Rating: '+rating+'</b></li>';
            }
            for (var i = 0; i < movie.attributes.length; i++){

                if(movie.attributes[i].name === "poster"){
                    html += '<li><b>' + movie.attributes[i].name + '</b>' + ': ' + "<a href=" + movie.attributes[i].textContent +">Poster</a></li>";
                }else {
                    html += '<li><b>' + movie.attributes[i].name + '</b>' + ': ' + movie.attributes[i].textContent + '</li>'
                }
            }
                        html += '</ul>';
            respSpace.querySelector('pre').innerHTML = html;
        }else{
            var json = JSON.parse(request.response);


            if(title !== null) {
                searchTerm = 's=' + title;
            }else{
                const queryArr = json["Title"].split(" ");
                if(queryArr.length > 1) {
                    searchTerm = 's=' + queryArr[0] + " " + queryArr[1];
                }else{
                    searchTerm = 's=' + queryArr[0]
                }
            }

            mainId = json["imdbID"];
            rating = localStorage.getItem(mainId);
            var html = '<ul style = "list-style-type: none">';
            html += "<img src = " + json["Poster"] + ">";
            if(rating !== null){
                html += "<li><b>Star Rating: "+ rating+ "</b></li>";
            }
            for(var key in json){

                if(key === "Poster"){
                    html += '<li><b>' + key + '</b>' + ': ' + "<a href=" + JSON.stringify(json[key]) +">Poster</a></li>";
                }else {
                    html += '<li><b>' + key + '</b>' + ': ' + JSON.stringify(json[key]) + '</li>'
                }
            }
            html += '</ul>';
            respSpace.querySelector('pre').innerHTML = html;
        }

        reqSpace.querySelector('a').setAttribute('href',request.responseURL);
        reqSpace.querySelector('a').innerHTML = safeURL;
        reqSpace.setAttribute('style',"display: inherit");
        respSpace.setAttribute('style', "display: table");

        recURL += apiKey + searchTerm;

        ajaxRecs(recURL, mainId);

    }
}

function titleReset(){
    reqSpace.setAttribute('style', "display: none");

    respSpace.setAttribute('style', 'display: none');

    recomSpace.setAttribute('style', 'display: none');
}

function idReset(){
    reqSpace.setAttribute('style', "display: none");

    respSpace.setAttribute('style', 'display: none');

    recomSpace.setAttribute('style', 'display: none');

}

function searchTitle(){

    var apiAddy = "http://www.omdbapi.com/?";
    apiAddy = apiAddy + apiKey;

    let title = document.getElementById("t").value;
    let year  = document.getElementById('y').value;
    let plot = document.getElementById('p').value;
    let respType = document.getElementById('r').value;

    apiAddy = apiAddy + "t=" + title;

    if (year !== ""){
        apiAddy = apiAddy +"&y=" + year;
    }
    if (plot !== ""){
        apiAddy = apiAddy + "&plot=" + plot;
    }
    if (respType !== ""){
        apiAddy = apiAddy + "&r=" + respType;
    }
    ajaxResult(apiAddy)

}

function searchID(){
    var apiAddy = "http://www.omdbapi.com/?";
    apiAddy = apiAddy + apiKey;

    let id = document.getElementById("i").value;
    let plot = document.getElementById('p1').value;
    let respType = document.getElementById('r1').value;

    apiAddy = apiAddy + "i=" + id;

    if (plot !== ""){
        apiAddy = apiAddy + "&plot=" + plot;
    }
    if (respType !== ""){
        apiAddy = apiAddy + "&r=" + respType;
    }

    ajaxResult(apiAddy)
}

function setRating(){
    let rating = document.getElementById("rate").value;
    // localStorage.setItem(mainId, rating);
    localStorage.setItem(mainId, rating);
}


