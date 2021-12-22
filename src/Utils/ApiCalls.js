import axios from 'axios';
import { message } from 'antd';
import { BASE_URL } from '../Constants/Urls';
import { SOME_ERR } from '../Constants/Messages';

/**
 * @name makeURL
 * @function
 * @description Used to create URL with Base Url
 * @param {String} URL API end point URL
 */
export const makeURL = function (URL) {
    return BASE_URL + URL;
};

/**
 * @name multipartAPI
 * @function
 * @description Used to call API with multipart data
 * @param {String} URL API URL
 * @param {Object} data Source data
 */
export const multipartAPI = function (URL, data, method = 'post') {
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: makeURL(URL),
            data: data,
            headers: {
                Authorization: 'Token ' + getAuthToken(),
                'content-type': 'multipart/form-data'
            }
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
                handleErrorCode(err);
            });
    });
};

/**
 * @name postAPI
 * @function
 * @description Used to call API with post method
 * @param {String} URL API URL
 * @param {Object} data Source data
 */
export var postAPI = function (URL, data = {}, method = 'post') {
    console.log('sending...', URL, data);
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: makeURL(URL),
            data: data,
            headers: {
                Authorization: 'Token ' + getAuthToken()
            }
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
                handleErrorCode(err);
            });
    });
};
/**
 * @name getAPI
 * @function
 * @description Used to call API with post method
 * @param {String} URL API URL
 * @param {Object} data Source data
 */
export var getAPI = function (URL, data = {}, is_logged_in = true) {
    console.log('sending...', URL, data);
    let headers = is_logged_in
        ? {
              Authorization: 'Token ' + getAuthToken()
          }
        : {};
    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: makeURL(URL),
            params: data,
            headers: headers
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
                handleErrorCode(err);
            });
    });
};

/**
 * @name deleteAPI
 * @function
 * @description Used to call API with post method
 * @param {String} URL API URL
 * @param {Object} data Source data
 */
export var deleteAPI = function (URL, data = {}, method = 'delete') {
    console.log('sending...', URL, data);
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: makeURL(URL),
            data: data,
            headers: {
                Authorization: 'Token ' + getAuthToken()
            }
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
                handleErrorCode(err);
            });
    });
};

/**
 * @name getAPINoAuth
 * @function
 * @description Used to call API with get method without header
 * @param {String} URL API URL
 * @param {Object} data  Source dat
 */
export var getAPINoAuth = function (URL, data = {}) {
    console.log('sending...', URL, data);
    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: makeURL(URL),
            params: data
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
                handleErrorCode(err);
            });
    });
};

/**
 * @name postAPINoAuth
 * @function
 * @description Used to call API with post method
 * @param {String} URL API URL
 * @param {Object} data Source data
 */
export var postAPINoAuth = function (URL, data = {}, method = 'post') {
    console.log('sending...', URL, data);
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: makeURL(URL),
            data: data
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
                handleErrorCode(err);
            });
    });
};

/**
 * @name loginAPI
 * @function
 * @description Used to login (Calls API without token)
 * @param {String} URL API URL
 * @param {Object} data Source data
 */
export const loginAPI = function (URL, data, set_cookie = true) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: makeURL(URL),
            data: data
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
                handleErrorCode(err);
            });
    });

    // return response.data;
};

/**
 * @name thirdPartyAPI
 * @function
 * @description Used to call any third party API
 * @param {String} URL API URL
 */
export const thirdPartyAPI = async function (URL) {
    const response = await axios({
        method: 'get',
        url: URL
    });
    return response.data;
};

/**
 * @name interpolate
 * @function
 * @description Replace %s from a string to given number
 * @param {String} theString String with %s
 * @param {Array} argumentArray Array of numbers
 */
export const interpolate = function (theString, argumentArray) {
    var regex = /%s/;
    var _r = function (p, c) {
        return p.replace(regex, c);
    };
    return argumentArray.reduce(_r, theString);
};

/**
 * @name getAuthToken
 * @function
 * @description Returns token from localstorage
 */
export const getAuthToken = function () {
    return localStorage.getItem('token');
};

export const handleErrorCode = function (err) {
    if (err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_profile_id');
        window.location.assign('/');
    } else if (err.response.status === 500) {
        message.error(SOME_ERR);
    } else if (err.response.data.errors) {
        message.error(err.response.data.errors && err.response.data.errors[0].message);
    }
};
