import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import Model5 from './components/Model5.js';
import Loading from './components/Loading.js'

function App() {

const [loaded, setLoaded] = useState(false)

window.addEventListener("load", function(event) {
  setLoaded(true);
});

  return (
    <div className="App" id="app" >
      {loaded ?
      <Model5 /> : 
      <Loading />
      }
    </div>
  );
}

export default App;
