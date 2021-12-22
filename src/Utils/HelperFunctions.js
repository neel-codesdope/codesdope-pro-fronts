import React from 'react';
import { Avatar } from 'antd';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { postAPINoAuth, getAPI, interpolate, postAPI } from '../Utils/ApiCalls';
import { USERNAME_TAKEN, EMAIL_TAKEN, FETCH_COURSE_MODULE, SET_SOURCE_DATA } from '../Constants/Urls';
import { USERNAME_TAKEN_ERROR, INVALID_USERNAME_ERROR, EMAIL_TAKEN_ERROR } from '../Constants/Messages';
import { STRONG_PASSWORD_ERROR } from '../Constants/Messages';
import { COURSE_ENROLLMENT_STATUS } from '../Constants/Values';

/**
 * @name getParameterFromUrl
 * @function
 * @description Get parameter from URL
 * @param {String} url URL
 * @param {String} name Parameter name to be get
 */
export const getParameterFromUrl = name => {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * @name getParameterFromUrl
 * @function
 * @description Remove a query param from url
 * @param {String} name Parameter name to be remove
 */
export const removeURLParameter = parameter => {
    let url = window.location.href;
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {
        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);
        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0; ) {
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }
        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
};
export const isEmptyObject = obj => {
    if (obj === undefined || (Object.keys(obj).length === 0 && obj.constructor === Object)) {
        return true;
    }
    return false;
};

export const isArrayEmpty = arr => {
    if (arr === undefined || arr.length === 0) {
        return true;
    }
    return false;
};

/**
 * @name reverseObj
 * @function
 * @description Use to reverse a Object
 * @param {Object} object Source Object
 */
export const reverseObj = function (object) {
    let new_obj = {};
    let keys = Object.keys(object || {});
    for (let i = keys.length - 1; i >= 0; i--) {
        new_obj[keys[i]] = object[keys[i]];
    }
    return new_obj;
};

/**
 * @name getOS
 * @function
 * @description Use to get the os name
 */
export const getOS = function () {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
};

const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

/**
 * @name ifPresentInArray
 */
export const checkPresentInArray = (element, array) => {
    for (var i of array) {
        if (arraysEqual(element, i)) {
            return true;
        }
    }
    return false;
};

export const checkObjectInArray = (element, array) => {
    for (var i of array) {
        if (isEqual(element, i)) {
            return true;
        }
    }
    return false;
};

export const getUserProfileId = () => {
    return localStorage.getItem('user_profile_id');
};

export const getUserId = () => {
    return localStorage.getItem('user_id');
};

export const getUserDisplayName = (first_name, last_name, username) => {
    if (first_name && !last_name) return first_name;
    else if (!first_name && last_name) return last_name;
    else if (first_name && last_name) return first_name + ' ' + last_name;
    else return username;
};

export const getUserFullName = (first_name, last_name) => {
    if (first_name && !last_name) return first_name;
    else if (!first_name && last_name) return last_name;
    else if (first_name && last_name) return first_name + ' ' + last_name;
    else return '';
};

export const getProfileAvatar = (first_name, last_name, username, profile_pic, size = 35, class_name = '') => {
    return profile_pic ? (
        <Avatar size={size} className={class_name} src={profile_pic} />
    ) : (
        <Avatar size={size} className={class_name + ' avatar-text'}>
            {getUserDisplayName(first_name, last_name, username).charAt(0).toUpperCase()}
        </Avatar>
    );
};

export const getWindowHeight = () => {
    return window.innerHeight;
};

export const getElementBottomToScreenTop = id => {
    let element = document.getElementById(id);
    if (!!element) {
        let spaceBelowElement = element.getBoundingClientRect().bottom;
        return spaceBelowElement;
    }
};

export const getDate = date => {
    let formatted_date = new Date(date).toString();
    return moment(formatted_date).fromNow();
};

export const isIdSameAsUserProfileId = id => {
    return id == getUserProfileId();
};

export const isIdSameAsUserId = id => {
    return id == getUserId();
};

export const isCurrentlyEnrolled = course_enrollment_status =>
    course_enrollment_status === COURSE_ENROLLMENT_STATUS.ENROLLED;

export const emailTakenValidator = (rule, value) => {
    if (value) {
        return new Promise((resolve, reject) => {
            postAPINoAuth(EMAIL_TAKEN, { email: value })
                .then(d => {
                    if (d.taken) {
                        return reject(EMAIL_TAKEN_ERROR);
                    } else {
                        return resolve();
                    }
                })
                .catch();
        });
    }
    return Promise.resolve();
};

export const usernameTakenValidator = (rule, value) => {
    if (value) {
        return new Promise((resolve, reject) => {
            postAPINoAuth(USERNAME_TAKEN, { username: value })
                .then(d => {
                    if (d.taken) {
                        return reject(USERNAME_TAKEN_ERROR);
                    } else {
                        return resolve();
                    }
                })
                .catch();
        });
    }
    return Promise.resolve();
};

export const usernameFormatValidator = (rule, value) => {
    if (value) {
        if (value.match(/^[a-zA-Z0-9\@\.\+\-\_]{3,16}$/)) {
            return Promise.resolve();
        }
        return Promise.reject(INVALID_USERNAME_ERROR);
    }
    return Promise.resolve();
};

export const passwordValidator = (rule, value) => {
    if (value) {
        if (value.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
            return Promise.resolve();
        }
        return Promise.reject(STRONG_PASSWORD_ERROR);
    }
    return Promise.resolve();
};

export function getDateTimeText(timestamp = 0) {
    let time_obj = new Date(timestamp);
    const month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let day = time_obj.getDate() || '';
    let month = month_names[time_obj.getMonth()] || '';
    let time = time_obj.toLocaleTimeString() || '';
    let year = time_obj.getFullYear();
    return (
        <>
            {day} {month} {year}
        </>
    );
}

export const changeTimeFormat = (time, showSec = true) => {
    if (!time) {
        return 0 + ' sec';
    } else {
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time % 3600) / 60);
        let seconds = Math.floor(time % 60);
        let timeStr = showSec
            ? (hours > 0 ? hours + ' hr' : '') +
              (minutes > 0 ? ' ' + minutes + ' min' : '') +
              (seconds > 0 ? ' ' + seconds + ' sec' : '')
            : (hours > 0 ? hours + ' hr' : '') + (minutes > 0 ? ' ' + minutes + ' min' : '');
        return timeStr;
    }
};

export const convertCurrency = amount => {
    return (amount / 100)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const convertToHigherCurrency = amount => {
    return parseFloat((amount / 100).toFixed(2));
};

export const convertToLowerCurrency = amount => {
    return amount * 100;
};

export const copyTextToClipboard = content => {
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

export const downloadFile = file_url => {
    const element = document.createElement('a');
    element.setAttribute('href', file_url);
    element.setAttribute('target', '_blank');
    element.setAttribute('download', '');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

export const returnFloor = number => {
    return Math.ceil(number);
};

export const getAnchorId = () => {
    return window.location.href.slice(window.location.href.indexOf('#') + 1);
};

export const returnStoredModules = (course_modules_list, course_slug) => {
    let course_modules = [];
    let enrolled = '';
    let language_preference = null;
    course_modules_list.forEach(function (module_obj) {
        if (module_obj.course_slug === course_slug) {
            course_modules = module_obj.modules;
            enrolled = module_obj.enrolled;
            language_preference = module_obj.language_preference;
        }
    });
    return { course_modules, enrolled, language_preference };
};

export const fetchModules = (course_slug, is_user_logged_in) => {
    return new Promise((resolve, reject) => {
        getAPI(interpolate(FETCH_COURSE_MODULE, [course_slug]), {}, is_user_logged_in)
            .then(data => {
                return resolve(data);
            })
            .catch(err => {
                return reject(err);
            });
    });
};

export const returnStoredPreferredLanguage = (course_preferred_languages, course_slug) => {
    let language = null;
    if (!!course_preferred_languages) {
        course_preferred_languages.forEach(function (el) {
            if (el.course_slug === course_slug) {
                language = el.language;
            }
        });
    }
    return language;
};

export const getLastNDaysTimestamp = n => {
    const todayDate = new Date();
    const lastNDays = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - n);
    return lastNDays.valueOf();
};

export const areArraysEqual = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
};

export const sleep = ms => new Promise(res => setTimeout(res, ms));

export const setSourceData = user_profile_id => {
    let source_data = localStorage.getItem('source_data');
    if (source_data) {
        postAPI(interpolate(SET_SOURCE_DATA, [user_profile_id]), { source_data: source_data })
            .then(response => {
                localStorage.removeItem('source_data');
            })
            .catch(error => {});
    }
};
