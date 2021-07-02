// import jwt from 'jsonwebtoken';
import { proxy, useSnapshot } from 'valtio';
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

export const searchFormState = proxy({
  formFields: {},
  setFormFields(fields) { this.formFields = fields },

  isAdvancedSearch: false,
  setAdvancedSearch() { this.isAdvancedSearch = !this.isAdvancedSearch },

  handleChange(evt)  {
		const { name, value } = evt.target;

    this.setFormFields({
      ...this.formFields,
      [name]: value
    });
  },

  worksSearch: (searchFieldsObj = {} ) => {
    (async () => {
      const worksList = await HornRepApi.searchWorks(searchFieldsObj)
			worksState.setWorksList(worksList);
      console.log('worksList--',worksState.worksList)
		})();
	}
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

