import { PlayCircleFilled, ProjectFilled, QuestionCircleFilled, FilePdfFilled } from '@ant-design/icons';
import { VIDEO_GENERAL_ERROR, VIDEO_NULL_ERROR } from './Messages';

let RAZORPAY_VALUES;
if (process.env.REACT_APP_ENV === 'prod') {
    RAZORPAY_VALUES = { KEY: 'rzp_live_caDw27qW3lmINB' };
} else {
    RAZORPAY_VALUES = { KEY: 'rzp_test_zfuYSaUDgUBBFs' };
}
export const RAZORPAY_PAYMENT_KEY = RAZORPAY_VALUES.KEY;

export const VIDEO_COMPLETION_THRESHOLD = 0.8;

export const COURSE_PROGRESS_TO_SHOW_RATING = 4;

export const FILE_SIZE_LIMIT = 5;

export const COURSE_ENROLLMENT_STATUS = {
    PENDING: 'PENDING', // when payment status is pending
    ENROLLED: 'ENROLLED', // when user is enrolled and course is valid
    NOT_ENROLLED: 'NOT_ENROLLED', // when user is not enrolled/when user is not logged in
    EXPIRED: 'EXPIRED' // when user is enrolled and course is invalid
};

export const CONTENT_MENU = {
    VIDEO: 'video',
    SUMMARY: 'summary',
    PRACTICE: 'practice',
    DISCUSSION: 'discussion'
};

export const SUBTOPIC_TYPE_ENUM = {
    VIDEO: 0,
    PROJECT: 1,
    QUIZ: 2
};

export const SUBTOPIC_TYPE = {
    [SUBTOPIC_TYPE_ENUM.VIDEO]: <PlayCircleFilled />,
    [SUBTOPIC_TYPE_ENUM.PROJECT]: <ProjectFilled />,
    [SUBTOPIC_TYPE_ENUM.QUIZ]: <QuestionCircleFilled />
};

export const PRACTICE_LEVELS = [1, 2, 3];

export const VIDEO_ERROR_ENUM = {
    GENERAL: 1,
    VIDEO_ID_NULL: 2
};

export const VIDEO_ERROR_MESSAGE = {
    [VIDEO_ERROR_ENUM.GENERAL]: VIDEO_GENERAL_ERROR,
    [VIDEO_ERROR_ENUM.VIDEO_ID_NULL]: VIDEO_NULL_ERROR
};

export const PROFILE_MENU = {
    BASIC_DETAILS: 'basic-details',
    CHANGE_PASSWORD: 'change-password',
    CHANGE_EMAIL: 'change-email',
    ENROLLED_COURSES: 'enrolled-courses',
    QUESTIONS_ASKED: 'questions-asked',
    QUESTIONS_FOLLOWED: 'questions-followed',
    QUESTIONS_ANSWERED: 'questions-answered',
    REWARDS_AND_REFERRAL_CODE: 'rewards-referral-code'
};

export const NOTIF_BADGE_MAX_COUNT = 10;

export const PAYMENT_STATUS_ENUM = {
    PENDING: 0,
    SUCCESS: 1,
    FAILED: 2
};

export const PAYMENT_STATUS_TEXT = {
    [PAYMENT_STATUS_ENUM.PENDING]: 'Pending',
    [PAYMENT_STATUS_ENUM.SUCCESS]: 'Success',
    [PAYMENT_STATUS_ENUM.FAILED]: 'Failed'
};

export const PAYMENT_ALERT_MESSAGE = {
    [PAYMENT_STATUS_ENUM.PENDING]: 'Payment capture is in process.',
    [PAYMENT_STATUS_ENUM.SUCCESS]: 'Payment successfully captured',
    [PAYMENT_STATUS_ENUM.FAILED]: 'Oops! Payment failed. Please try again.'
};

export const INITIAL_PAYMENT_ALERT_MESSAGE = {
    [COURSE_ENROLLMENT_STATUS.PENDING]: 'Payment processing is in progress.',
    [COURSE_ENROLLMENT_STATUS.ENROLLED]: 'You are already enrolled in this course.'
};

export const LANGUAGES_LIST = [
    { name: 'CSS', value: 'css' },
    { name: 'HTML/XML', value: 'html' },
    { name: 'PHP', value: 'php' },
    { name: 'Java', value: 'java' },
    { name: 'JavaScript', value: 'javascript' },
    { name: 'SQL', value: 'sql' },
    { name: 'Python', value: 'python' },
    { name: 'Ruby', value: 'ruby' },
    { name: 'C/C++', value: 'c' },
    { name: 'C#', value: 'csharp' },
    { name: 'Perl', value: 'perl' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'SQL', value: 'sql' },
    { name: 'Scala', value: 'scala' },
    { name: 'Bash (Shell)', value: 'bash' },
    { name: 'Plain (Text)', value: '' },
    { name: 'JSON', value: 'json' },
    { name: 'R', value: 'r' }
].sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? (a.value > b.value ? 1 : -1) : -1));

export const AUTOSAVE_STATUS = {
    IDLE: '',
    SAVING_CHANGES: 'Saving changes...',
    CHANGES_NOT_SAVED: 'Changes not saved!',
    CHANGES_SAVED: 'Changes saved.'
};

let GOOGLE_LOGIN_CLIENT_ID_VALE;
let FIREBASE_CONFIG_VALUE;

if (process.env.REACT_APP_ENV === 'prod') {
    GOOGLE_LOGIN_CLIENT_ID_VALE = '1082198103821-215o7lrimm2l3ca6gr7j0okgpmg86jd8.apps.googleusercontent.com';
    FIREBASE_CONFIG_VALUE = {
        apiKey: 'AIzaSyBQuxi2Uc2z3xFt6g5LR4f853bD6r4UNLY',
        authDomain: 'codesdope-310707.firebaseapp.com',
        databaseURL: 'https://codesdope-310707-default-rtdb.firebaseio.com',
        projectId: 'codesdope-310707',
        storageBucket: 'codesdope-310707.appspot.com',
        messagingSenderId: '1082198103821',
        appId: '1:1082198103821:web:1f406c73986e9c7bc0c244',
        measurementId: 'G-2ZZX7R476T'
    };
} else {
    GOOGLE_LOGIN_CLIENT_ID_VALE = '46258923354-56gmj16fq9io49iptb9n2i2kubvqprrj.apps.googleusercontent.com';
    FIREBASE_CONFIG_VALUE = {
        apiKey: 'AIzaSyCeOGXCn7uJzk5sEHfoBYzhbAJJG4E45Ws',
        authDomain: 'codesdope-stage.firebaseapp.com',
        databaseURL: 'https://codesdope-stage-default-rtdb.firebaseio.com',
        projectId: 'codesdope-stage',
        storageBucket: 'codesdope-stage.appspot.com',
        messagingSenderId: '79556537006',
        appId: '1:79556537006:web:938695de870faf3a9e1b3f',
        measurementId: 'G-NPK5NK8P54'
    };
}

export const GOOGLE_LOGIN_CLIENT_ID = GOOGLE_LOGIN_CLIENT_ID_VALE;
export const FIREBASE_CONFIG = FIREBASE_CONFIG_VALUE;

let MONGODB_APP_ID_VALUE;
let MONGODB_CONFIG_VALUE;

if (process.env.REACT_APP_ENV === 'prod') {
    MONGODB_APP_ID_VALUE = 'codesdope-pro-website-fhilx';
    MONGODB_CONFIG_VALUE = {
        apiKey: 'zNdYuFTNUhX8Oxv22zpjPncFuQ4EXySr0vxBgHaQYsYGK8ja52C4GxKs02HGxbQF',
        client: 'mongodb-atlas',
        databaseName: 'CodesDope-DB',
        collection: 'CodesDope-DB-Collection'
    };
} else {
    MONGODB_APP_ID_VALUE = 'codesdope-pro-stage-website-xvlen';
    MONGODB_CONFIG_VALUE = {
        apiKey: 'MeftkaQyja57NH0teTHayUIHwOjfdStixy54UgpjV2c2kNhXEEfZWeEJ4SNMHJd8',
        client: 'mongodb-atlas',
        databaseName: 'CodesDope-Stage-DB',
        collection: 'CodesDope-Stage-Collection'
    };
}

export const MONGODB_APP_ID = MONGODB_APP_ID_VALUE;
export const MONGODB_CONFIG = MONGODB_CONFIG_VALUE;
export const MONGODB_DATABASE_OFFER = 'codesdope-pro-offer-banner-data';

export const SUMMARY_AUTOSAVE_DURATION = 3000;

export const PRACTICE_QUESTION_TYPE = {
    MCQ: 0,
    CODING: 1,
    FILL_BLANK: 2
};

export const testimonials = [
    {
        testimonial:
            "A big big big thank you for such an extraordinary way of yours. I am completely satisfied with the way of your explanation. I'm being moved. I was infact going to a nearby classroom coaching which I quit the moment I realised the quality of CodesDope.",
        author: 'Akshay Bijapur',
        author_info: ''
    },
    {
        testimonial: 'CodesDope really helped me to learn programming from beginner to advance level.',
        author: 'Syed Irtiza',
        author_info: ''
    },
    {
        testimonial:
            'It has been a spectacular experience practice programming with CodesDope, Looking forward for more fun. 10/10',
        author: 'Prathamesh Walunj',
        author_info: ''
    },
    {
        testimonial:
            'If I speak frankly, CodesDope has changed my life, it gives me guts to learn programming language myself.',
        author: 'Nisha Dhull',
        author_info: ''
    },
    {
        testimonial:
            'Codesdope is fantastic. I love it. It has helped me a lot to understand simple things. I have also recommended the site to a friend of mine and she loves it too 😊',
        author: 'Aliyah Hussein',
        author_info: ''
    },
    {
        testimonial: 'Codesdope is a wonderful platform for me and I am learning really well. Thanks for your effort.',
        author: 'Sudeep Pradeep',
        author_info: ''
    }
];

export const editor_array = [
    { constant_text: 'codesdope$', variable_text: 'g++ hello.cpp -o hello' },
    { constant_text: 'codesdope$', variable_text: './hello' },
    { constant_text: 'Hello World', variable_text: '' },
    { constant_text: 'codesdope$', variable_text: 'python3 welcome.py' },
    { constant_text: 'Welcome to CodesDope!', variable_text: '' },
    { constant_text: 'codesdope$', variable_text: 'python3' },
    { constant_text: '>>>', variable_text: 'print("Welcome to CodesDope!")' },
    { constant_text: 'Welcome to CodesDope!', variable_text: '' },
    { constant_text: '>>>', variable_text: '' }
];

export const feedback_array = [
    'Course is too fast',
    'Course is too slow',
    'Insufficient practice questions',
    'Explanation is difficult to understand',
    'Insufficient topics are covered'
];
