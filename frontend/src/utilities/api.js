import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

/** API Class.
 * Static class tying together methods used to get/send to to the API.
 */

class HornRepApi {
  // the token for interacting with the API
  static token;

  static async request(endpoint, data = {}, method = 'get') {
    console.debug('API Call:', endpoint, data, method);

    // pass an authorization token in the header.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = HornRepApi.token ? { Authorization: `Bearer ${HornRepApi.token}` } : {};
    const params = (method === 'get')
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error('API Error:', err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  static async searchWorks(formData) {
    let res = await this.request(`works`, formData);
    return res.works;
  }

  static async getWorkDetails(id) {
    return await this.request(`works/${id}`);
  }
  
  /* returns => { 
    "formChoicesData": {
        "eraStyle": [ eg, "romantic", "modern"],
        "countries": [ eg, "Germany", United States" ]
      }
    } 
  */
  static async getFormChoicesData() {
    return await this.request(`works/formData`);
  }
  
  static async newComment(commentObj) {
    const method = 'POST';
    return await this.request(`comments`, commentObj, method);
  }
  
  static async editComment({ comment, commentId, userId }) {
    const method = 'PATCH';
    return await this.request(`comments/${commentId}/${userId}`, {comment}, method);
  }
  
  static async deleteComment({ commentId, userId }) {
    const method = 'DELETE';
    return await this.request(`comments/${commentId}/${userId}`, null, method);
  }

  static async getWorkComments(workId) {
    return await this.request(`comments/work/${workId}`);
  }

  static async login(unPw) {
    const method = 'POST';
    let res = await this.request(`users/token`, unPw, method);
    return res.token;
  }

  static async getUser(userId) {
    let res = await this.request(`users/${userId}`);
    return res.user;
  }

  static async register(formData) {
    const method = 'POST';
    let res = await this.request(`users`, formData, method);
    return res.token;
  }

  static async updateProfile(userId, formData) {
    const method = 'PATCH';
    let res = await this.request(`users/${userId}`, formData, method);
    return res.updatedUser;
  }

  static async newComposer(formData) {
    const method = 'POST';
    let res = await this.request(`composers`, formData, method)
    return res;
  }

  static async newWork(userId, formData) {
    const method = 'POST';
    let res = await this.request(`works/${userId}`, formData, method)
    return res;
  }


  // TODO keep?
//   // {username, password} => true/false
//   static async validate(unPw) {
//     return await this.request('auth/validate', unPw);
//   }  

}


export default HornRepApi;