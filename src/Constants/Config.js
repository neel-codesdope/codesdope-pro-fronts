/**
 *  Connection URLs
 * */
let BASE_SERVER_URL;
if (process.env.REACT_APP_ENV === 'stage') {
    BASE_SERVER_URL = 'https://stage.codesdope.com';
} else if (process.env.REACT_APP_ENV === 'prod') {
    BASE_SERVER_URL = 'https://www.codesdope.com';
} else if (process.env.REACT_APP_ENV === 'dev') {
    BASE_SERVER_URL = 'https://stage.codesdope.com';
} else {
    BASE_SERVER_URL = 'http://127.0.0.1:8000';
}
export const BASE_SERVER = BASE_SERVER_URL;
