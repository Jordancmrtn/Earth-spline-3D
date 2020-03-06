import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import EarthSplineScroll from './components/EarthSplineScroll.js';
import Loading from './components/Loading.js'

function App() {

const [loaded, setLoaded] = useState(false)

window.addEventListener("load", function(event) {
  setLoaded(true);
});

  return (
    <div className="App" id="app" >
      {loaded ?
      <EarthSplineScroll /> : 
      <Loading />
      }
    </div>
  );
}

export default App;
