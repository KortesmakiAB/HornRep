// import jwt from 'jsonwebtoken';
import { proxy } from 'valtio';
import { H1 } from '@blueprintjs/core';
import { BrowserRouter } from "react-router-dom";

import HornRepApi from './tools/api';
import Routes from './routes-nav/Routes';
import './App.css';
// import hornBg from '../src/media/HornBg2.jpg';



// SHARED STATE

export const userState = proxy({ 
  token: '', 
  setToken: token => userState.token = token,

  user: {},
  setUser: (obj) => userState.user = obj,
});

export const worksState = proxy({
  worksList: [],
  setWorksList: worksArr => worksState.worksList = worksArr,
});

export const workDetailsState = proxy({
  workDetails: {},
  setWorkDetails(worksObj) { this.workDetails = worksObj },


  loadWorkDeets(id) {
    (async () => {
      const resp = await HornRepApi.getWorkDetails(id);
      console.log(resp.work)
      this.setWorkDetails(resp.work);
		})();
	},
});

// initial maxDuration is pre-set to 20 for convenience.
// most people want works less than 20 minutes.
export const searchFormState = proxy({
  formFields: {
    title: '',
    lName: '',
    fName:'',
    minDuration: '00:00:00', 
    maxDuration: '00:20:00',
    techniques: '',
    // highestNote: '',  // property will be set as used. integer
    // lowestNote: '', // property will be set as used. integer
    difficulty: [],
    eraStyle: [],
    countries: [],
    accompType: [],
    accompDifficulty: [],
  },
  setFormField(field, val) { this.formFields[field] = val },

  isAdvancedSearch: false,
  setAdvancedSearch() { this.isAdvancedSearch = !this.isAdvancedSearch },

  handleFormChange(evt) {
		const { name, value } = evt.target;
    searchFormState.setFormField(name, value);
  },

  isDataLoaded: false,
  setIsDataLoadedTrue() { this.isDataLoaded = true; },

  checkboxData: {},
  setCheckboxData (dataObj) { this.checkboxData = dataObj },

  eraStyleCheckboxState: {},
  setEraStyleCheckboxState(key) { this.eraStyleCheckboxState[key] = !this.eraStyleCheckboxState[key] },

  countriesState: {},
  setCountriesState(key) { this.countriesState[key] = !this.countriesState[key] },

  countriesQuery: '',
  setCountriesQuery(qString) { searchFormState.countriesQuery = qString },

  loadCheckboxData () {
    (async () => {
      const resp = await HornRepApi.getCheckBoxData();
      this.setCheckboxData(resp.checkboxData);
      if (this.checkboxData.eraStyle) this.checkboxData.eraStyle.forEach(eS => this.eraStyleCheckboxState[eS] = false);
      if (this.checkboxData.countries) this.checkboxData.countries.forEach(c => this.countriesState[c] = false);
      this.setIsDataLoadedTrue();
		})();
	},
  
  worksSearch(searchFieldsObj = {}) {
    (async () => {
      const worksList = await HornRepApi.searchWorks(searchFieldsObj);
			worksState.setWorksList(worksList);
		})();
	},
});


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <H1 className='App-title'>HornRep</H1>
        </header>
        <Routes></Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

