import { proxy } from 'valtio';
import { H1, Card } from '@blueprintjs/core';
import { BrowserRouter } from 'react-router-dom';

import HornRepApi from './utilities/api';
import Routes from './routes-nav/Routes';
import Nav from './routes-nav/Nav';

import { eraStyleMultiState } from './forms/EraStyleMultiSelect';
import { countryMultiSelectState } from './forms/CountryMultiSelect';
import { countrySelectState } from './forms/CountrySelect';
import { composerSelectState } from './forms/ComposerSelect';
import { eraStyleSelectState } from './forms/EraStyleSelect';

import './App.css';
import useLocalStorage from './utilities/useLocalStorage';


// SHARED/GLOBAL STATE
export const TOKEN_STORAGE_KEY = 'HornRep-LS-key'

export const userState = proxy({ 
  user: {},
  setUser (obj) { this.user = obj },
});

export const navState = proxy({
  isMenuOpen: false,
  setIsMenuOpened(){ this.isMenuOpen = true },
  setIsMenuClosed(){ this.isMenuOpen = false },
});


// TODO, move to Signup component
export const signupState = proxy({
  formFields: {
    fName: '',
    lName: '',
    username: '',
    email: '',
    password: ''
  },
  setSignupFormField(field, val) { this.formFields[field] = val },
  setSignupFields(obj) { this.formFields = obj },

  handleSignupChange(evt) {
		const { name, value } = evt.target;
    signupState.setSignupFormField(name, value);
  },
});

// TODO, move to Profile component
export const profileFormState = proxy({
  userFieldsDisabled: false,
  setUserFieldsDisabledTrue() { this.userFieldsDisabled = true },
  setUserFieldsDisabledFalse() { this.userFieldsDisabled = false },
});

// TODO, move to Works component
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

// TODO, move to Works component?
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
      // add try/catch?
      // if error, send an error toast?
      const addedComment = await HornRepApi.newComment({
        comment: this.newCommentState,
        userId: userState.user.id,
        workId: this.workDetails.id
      });
		})();
	},

  editComment(commentId) {
    (async () => {
      // TODO user must be logged in. 
      // add try/catch?
      // if error, send an error toast?
      const editedComment = await HornRepApi.editComment({
        comment: this.commentEditState,
        userId: userState.user.id,
        commentId
      });
		})();
	},

  deleteComment(commentId) {
    (async () => {
      // TODO user must be logged in or admin
      // add try/catch?
      // if error, send an error toast?

      const addedComment = await HornRepApi.deleteComment({
        commentId,
        userId: userState.user.id,
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
      this.setWorkDetails(resp.work);
		})();
	},
});

// initial maxDuration is pre-set to 20 for convenience.
// most people want works less than 20 minutes.
const initialSearchFormState = {
  title: '',
  lName: '',
  fName:'',
  techniques: '',
};

export const searchFormState = proxy({
  formFields: {...initialSearchFormState},
  setFormField(field, val) { this.formFields[field] = val },
  resetFormFields(){ this.formFields = {...initialSearchFormState} },

  isAdvancedSearch: false,
  setAdvancedSearch() { this.isAdvancedSearch = !this.isAdvancedSearch },

  handleFormChange(evt) {
		const { name, value } = evt.target;
    searchFormState.setFormField(name, value);
  },

  isDataLoaded: false,
  setIsDataLoadedTrue() { this.isDataLoaded = true; },

  loadFormChoicesData () {
    (async () => {
      const resp = await HornRepApi.getFormChoicesData();
      if (resp.eraStyle.length) eraStyleSelectState.erasStyles = resp.eraStyle;
      if (resp.eraStyle.length) resp.eraStyle.forEach(eS => eraStyleMultiState.erasStyles[eS] = false);
      if (resp.countries.length) resp.countries.forEach(c => countryMultiSelectState.countriesState[c] = false);
      if (resp.countries.length) countrySelectState.countries = resp.countries;
      if (resp.composers.length) composerSelectState.composers = resp.composers;
      this.setIsDataLoadedTrue();
		})();
	},
});


function App() {
  useLocalStorage(TOKEN_STORAGE_KEY)
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

