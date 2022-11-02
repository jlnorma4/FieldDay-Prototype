// import logo from './logo.svg';
// import './App.css';
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

function App() {
    return (
        // <div className="App">
        //   <header className="App-header">
        //     <img src={logo} className="App-logo" alt="logo" />
        //     <p>
        //       Edit <code>src/activity3.js</code> and save to reload.
        //     </p>
        //     <a
        //       className="App-link"
        //       href="https://reactjs.org"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Learn React
        //     </a>
        //   </header>
        // </div>
        <div className="App">
          <div className="bs-docs-section" id="examples">
            <div className="row">
              <div className="col-lg-12">
                <div id="breadCrumbs">
                </div>
                <div className="page-header">
                  <h1>SER 421 Lab 6: Activity 3 </h1>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="bs-component">
                  <form className="well form-search" id="search-by-title-form" onSubmit="return false;">
                    <h3>By Title</h3>
                    <div>
                      <label className="control-label" htmlFor="t">Title:</label>
                      <input type="text" id="t" name="t" className="input-small"/>
                      &nbsp;&nbsp;
                      <label className="control-label" htmlFor="y">Year:</label>
                      <input type="text" id="y" name="y" className="input-small" style=
                          {{width: "100px"}}/>
                      &nbsp;&nbsp;
                      <label className="control-label">Plot:</label>
                      <select id="p" name="plot" style=
                          {{width: "100px"}}>
                        <option value="" selected="">Short</option>
                        <option value="full">Full</option>
                      </select>
                      &nbsp;&nbsp;
                      <label className="control-label">Response:</label>
                      <select id="r" name="r" style={{width: "100px"}}>
                        <option value="">JSON</option>
                        <option value="xml">XML</option>
                      </select>
                      &nbsp;&nbsp;
                      <button id="search-by-title-button" type="button" className="btn-sm btn-primary"
                              onClick={searchTitle}>Search
                      </button>
                      <button id="search-by-title-reset" type="reset" className="btn-sm"
                              onClick={titleReset}>Reset
                      </button>
                    </div>
                    <div className="hide" id="search-by-title-request" style={{display: "none"}}>
                      <br/>
                      <p>Request:</p>
                      <pre className="alert alert-box"><a href="javascript:;" target="_blank"></a></pre>
                    </div>
                    <div className="hide" id="search-by-title-response" style={{display: "none"}}>
                      <p>Response:</p>
                      <pre className="alert alert-success" style={{marginBottom: '0px',whiteSpace: "normal"}}></pre>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="bs-component">
                  <form className="well form-search" id="search-by-id-form" onSubmit="return false;">
                    <h3>By ID</h3>
                    <div>
                      <label className="control-label" htmlFor="i">ID:</label>
                      <input type="text" id="i" name="i" className="input-small" placeholder="IMDb ID"/>
                      &nbsp;&nbsp;
                      <label className="control-label">Plot:</label>
                      <select id="p1" name="plot" style={{width: "100px"}}>
                        <option value="" selected="">Short</option>
                        <option value="full">Full</option>
                      </select>
                      &nbsp;&nbsp;
                      <label className="control-label">Response:</label>
                      <select id="r1" name="r" style={{width: "100px"}}>
                        <option value="">JSON</option>
                        <option value="xml">XML</option>
                      </select>
                      &nbsp;&nbsp;
                      <button id="search-by-id-button" type="button" className="btn-sm btn-primary"
                              onClick={searchID}>Search
                      </button>
                      <button id="search-by-id-reset" type="reset" className="btn-sm" onClick={idReset}>Reset</button>
                    </div>
                    <div className="hide" id="search-by-id-request" style={{display: "none"}}>
                      <br/>
                      <h2>Request:</h2>
                      <pre><a href="javascript:;" target="_blank"></a></pre>
                    </div>
                    <div className="hide" id="search-by-id-response" style={{display: "none"}}>
                      <h2>Response:</h2>
                      <pre style={{marginBottom: "12px", whiteSpace: "normal"}}></pre>
                      <label className="control-label">Rating:</label>
                      <select id="rate" name="ratings" style={{width: "100px"}}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <button id="set-rating-button" type="button" className="btn-sm btn-primary"
                              onClick={setRating}>Submit Rating
                      </button>
                    </div>
                  </form>
                  <div id="recommendations" style={{display: "none"}}>
                    <h2>Others you may enjoy:</h2>
                    <table style={{width:"100%"}}>
                      <tr>
                        <td id="movie-rec-1">
                          damn movie goes here
                        </td>
                        <td id="movie-rec-2">
                          damn movie goes here
                        </td>
                        <td id="movie-rec-3">
                          damn movie goes here
                        </td>
                        <td id="movie-rec-4">
                          damn movie goes here
                        </td>
                        <td id="movie-rec-5">
                          damn movie goes here
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">

          </div>

        </div>
    );
}

export default App;
