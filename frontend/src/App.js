// import jwt from 'jsonwebtoken';
import { proxy } from 'valtio';
import { BrowserRouter } from "react-router-dom";

import HornRepApi from './tools/api';
import Routes from './routes-nav/Routes';
import './App.css';

// SHARED STATE
export const userState = proxy({ 
  token: '', 
  setToken: token => userState.token = token,

  user: {},
  // Note: I could re-write this to have a separate setter method for each of the properties on the user object
  setUser: (obj) => userState.user = obj,
});

export const worksState = proxy({
  worksList: [],
  setWorksList: worksArr => worksState.worksList = worksArr,
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
    difficulty: [],
    eraStyle: [],
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

  loadCheckboxData () {
    (async () => {
      const resp = await HornRepApi.getCheckBoxData();
      this.setCheckboxData(resp.checkboxData);
      this.checkboxData.eraStyle.forEach(eS => this.eraStyleCheckboxState[eS] = false);
      this.setIsDataLoadedTrue();
		})();
	},
  
  worksSearch(searchFieldsObj = {}) {
    (async () => {
      const worksList = await HornRepApi.searchWorks(searchFieldsObj);
			worksState.setWorksList(worksList);
      console.log('worksList--',worksState.worksList);
		})();
	},
});


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          
        </header>
        <Routes></Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

