import logo from './logo.svg';
import './App.css';

function App() {
  render()
  {
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
        <div className="container">
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
                      <input type="text" id="y" name="y" className="input-small" style="width: 100px;"/>
                      &nbsp;&nbsp;
                      <label className="control-label">Plot:</label>
                      <select id="p" name="plot" style="width: 100px;">
                        <option value="" selected="">Short</option>
                        <option value="full">Full</option>
                      </select>
                      &nbsp;&nbsp;
                      <label className="control-label">Response:</label>
                      <select id="r" name="r" style="width: 100px;">
                        <option value="">JSON</option>
                        <option value="xml">XML</option>
                      </select>
                      &nbsp;&nbsp;
                      <button id="search-by-title-button" type="button" className="btn-sm btn-primary"
                              onClick="searchTitle()">Search
                      </button>
                      <button id="search-by-title-reset" type="reset" className="btn-sm"
                              onClick="titleReset()">Reset
                      </button>
                    </div>
                    <div className="hide" id="search-by-title-request" style="display: none;">
                      <br/>
                      <p>Request:</p>
                      <pre className="alert alert-box"><a href="javascript:;" target="_blank"></a></pre>
                    </div>
                    <div className="hide" id="search-by-title-response" style="display: none;">
                      <p>Response:</p>
                      <pre className="alert alert-success" style="margin-bottom: 0px; white-space: normal;"></pre>
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
                      <select id="p1" name="plot" style="width: 100px;">
                        <option value="" selected="">Short</option>
                        <option value="full">Full</option>
                      </select>
                      &nbsp;&nbsp;
                      <label className="control-label">Response:</label>
                      <select id="r1" name="r" style="width: 100px;">
                        <option value="">JSON</option>
                        <option value="xml">XML</option>
                      </select>
                      &nbsp;&nbsp;
                      <button id="search-by-id-button" type="button" className="btn-sm btn-primary"
                              onClick="searchID()">Search
                      </button>
                      <button id="search-by-id-reset" type="reset" className="btn-sm" onClick="idReset()">Reset</button>
                    </div>
                    <div className="hide" id="search-by-id-request" style="display: none;">
                      <br/>
                      <h2>Request:</h2>
                      <pre><a href="javascript:;" target="_blank"></a></pre>
                    </div>
                    <div className="hide" id="search-by-id-response" style="display: none;">
                      <h2>Response:</h2>
                      <pre style="margin-bottom: 12px; white-space: normal;"></pre>
                      <label className="control-label">Rating:</label>
                      <select id="rate" name="ratings" style="width: 100px;">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <button id="set-rating-button" type="button" className="btn-sm btn-primary"
                              onClick="setRating()">Submit Rating
                      </button>
                    </div>
                  </form>
                  <div id="recommendations" style="display: none">
                    <h2>Others you may enjoy:</h2>
                    <table style="width:100%">
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
}

export default App;
