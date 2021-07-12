// import jwt from 'jsonwebtoken';
import { proxy } from 'valtio';
import { H1, Card } from '@blueprintjs/core';
import { BrowserRouter } from "react-router-dom";

import HornRepApi from './tools/api';
import Routes from './routes-nav/Routes';
import Nav from './routes-nav/Nav';

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
  setWorksList(worksArr){ this.worksList = worksArr},

  worksSearch(searchFieldsObj = {}, byTitles = true ) {
    (async () => {
      const worksList = await HornRepApi.searchWorks(searchFieldsObj, byTitles);
			this.setWorksList(worksList);
		})();
	},
});

export const workDetailsState = proxy({
  workDetails: {},
  setWorkDetails(worksObj) { this.workDetails = worksObj },
  setComments(commentsArr) { this.workDetails.comments = commentsArr },
  
  hideCommentForm: true,
  toggleHideCommentForm() {this.hideCommentForm = !this.hideCommentForm},
  
  hideEditForm: true,
  toggleHideEditForm() {this.hideEditForm = !this.hideEditForm},
  
  newCommentState: '',
  setNewCommentState(comment) {this.newCommentState = comment},
  
  commentEditState: '',
  setCommentEditState(comment) {this.commentEditState = comment},
  
  commentEditId: '',
  setCommentEditId(id) {this.commentEditId = id},

  addNewComment() {
    (async () => {
      // TODO user must be logged in. 
      // TODO try/catch
      // if error, send an error toast?

      const addedComment = await HornRepApi.newComment({
        comment: this.newCommentState,
        // TODO remove hard coded id and add userId from proxy state
        userId: 2,
        workId: this.workDetails.id
      });
		})();
	},

  editComment(commentId) {
    (async () => {
      // TODO user must be logged in. 
      // TODO try/catch
      // if error, send an error toast?
      const editedComment = await HornRepApi.editComment({
        comment: this.commentEditState,
        // TODO remove hard coded id and add userId from proxy state
        userId: 2,
        commentId
      });
		})();
	},

  deleteComment(commentId) {
    (async () => {
      // TODO user must be logged in or admin
      // TODO try/catch
      // if error, send an error toast?

      const addedComment = await HornRepApi.deleteComment({
        commentId,
        // TODO remove hard coded id and add userId from proxy state
        userId: 2,
      });
		})();
	},
  
  setWorkComments(workId) {
    (async () => {
      const workComments = await HornRepApi.getWorkComments(workId);
      this.setComments(workComments.comments);
		})();
	},
  
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
    gender: ''
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
});


function App() {
  return (
    <BrowserRouter>
      <Card className="App">
        <header className="App-header">
          <Nav />
          <H1 className='App-title'>HornRep</H1>
        </header>
        <Routes></Routes>
      </Card>
    </BrowserRouter>
  );
}

export default App;

