// import jwt from 'jsonwebtoken';
import { proxy } from 'valtio';
import { H1, Card } from '@blueprintjs/core';
import { BrowserRouter } from 'react-router-dom';
import jwt from 'jsonwebtoken';

import HornRepApi from './utilities/api';
import Routes from './routes-nav/Routes';
import Nav from './routes-nav/Nav';

import { eraStyleState } from './forms/EraStyle';
import './App.css';
import { countryMultiSelectState } from './forms/CountryMultiSelect';
import { countrySelectState } from './forms/CountrySelect';
// import hornBg from '../src/media/HornBg2.jpg';


// SHARED/GLOBAL STATE

export const userState = proxy({ 
  token: '', 
  setToken(token) {this.token = token},

  user: {},
  setUser (obj) { this.user = obj },

  isLoggedIn: false,
  setIsLoggedIn() { this.isLoggedIn = true },
  setIsNotLoggedIn() { this.isLoggedIn = false },
});

export const navState = proxy({
  isMenuOpen: false,
  setIsMenuOpened(){ this.isMenuOpen = true },
  setIsMenuClosed(){ this.isMenuOpen = false },
})

export const loginState = proxy({
   unPw: {
		email: '',
		password: '',
	},
  setUnPw (name, value) { this.unPw[name] = value },

  handleLoginFormChange(evt) {
    const { name, value } = evt.target;
    loginState.setUnPw(name, value);
  },

  loginGetUser() {
    // try/catch and handle invalid combos
    (async () => {
      const respToken = await HornRepApi.login(this.unPw);

      if (respToken){
        HornRepApi.token = respToken;
        userState.setToken(respToken);
        // HornRepApi.login() returns token with { id(userId), isAdmin }
        const decodedToken = jwt.decode(respToken);
        const user = await HornRepApi.getUser(decodedToken.id);
        delete user.password
        userState.setUser(user);
        userState.setIsLoggedIn();
      }
    })();
  },

  loginIsOpen: false,
  setLoginIsOpen() { this.loginIsOpen = true },
  setLoginIsNotOpen() { this.loginIsOpen = false },
});

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

export const profileFormState = proxy({
  userFieldsDisabled: false,
  setUserFieldsDisabledTrue() { this.userFieldsDisabled = true },
  setUserFieldsDisabledFalse() { this.userFieldsDisabled = false },
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
      console.log(resp.work)
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
  minDuration: '', 
  maxDuration: '',
  techniques: '',
  gender: '',
  highestNote: '',      // type: int
  lowestNote: '',       // type: int
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
      if (resp.formChoicesData.eraStyle.length) resp.formChoicesData.eraStyle.forEach(eS => eraStyleState.erasStyles[eS] = false);
      if (resp.formChoicesData.countries.length) resp.formChoicesData.countries.forEach(c => countryMultiSelectState.countriesState[c] = false);
      // if (resp.formChoicesData.countries.length) resp.formChoicesData.countries.forEach(c => countrySelectState.countriesState[c] = false);
      if (resp.formChoicesData.countries.length) countrySelectState.countries = resp.formChoicesData.countries;
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

