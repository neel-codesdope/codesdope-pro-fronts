import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { message } from 'antd';
import { getAPINoAuth, getAPI, postAPI, postAPINoAuth, interpolate } from './Utils/ApiCalls';
import { getUserProfileId, getParameterFromUrl, fetchModules, setSourceData } from './Utils/HelperFunctions';
import {
    COURSES,
    FETCH_PROFILE_DETAIL,
    FETCH_CREDITS,
    CONFIRM_CHANGE_EMAIL,
    CONFIRM_SIGNUP,
    FREE_ENROLLMENT
} from './Constants/Urls';
import { CHECKING_ELIGIBILITY, REDIRECTING_TO_COURSE } from './Constants/Messages';
import { useStore } from './Stores/SetStore';
import Header from './Components/Header/HeaderContent';
import Footer from './Components/Footer/FooterContent';
import OfferTopBanner from './Components/Offer/OfferTopBanner';
import ConfirmResetPassword from './Components/Header/ConfirmResetPassword';
import LoadingSpinner from './Components/UI Elements/LoadingSpinner';
import AuthorizedRoute from './HOC/AuthorizedRoute';

const HomePage = lazy(() => import('./Components/HomePage/HomePage'));
const TnC = lazy(() => import('./Components/TnC/TnC'));
const About = lazy(() => import('./Components/About/About'));
const PrivacyPolicy = lazy(() => import('./Components/PrivacyPolicy/PrivacyPolicy'));
const CourseContent = lazy(() => import('./Components/Course/CourseContent/CourseContent'));
const CourseOverview = lazy(() => import('./Components/Course/CourseOverview/CourseOverview'));
const DiscussionQuestion = lazy(() => import('./Components/Discussion/DiscussionQuestion/DiscussionQuestion'));
const PracticeQuestion = lazy(() => import('./Components/Practice/PracticeQuestion/PracticeQuestion'));
const Profile = lazy(() => import('./Components/Profile/Profile'));
const BillingHistory = lazy(() => import('./Components/BillingHistory/BillingHistory'));
const NotFound = lazy(() => import('./Components/UI Elements/NotFoundPage/NotFoundPage'));
const Checkout = lazy(() => import('./Components/Payment/Checkout'));
const SummaryUpdate = lazy(() => import('./Components/SummaryUpdate/SummaryUpdate'));

const App = props => {
    const [AppStore, dispatch] = useStore();
    const [reset_password_token, setResetPasswordToken] = useState();
    const [show_reset_password_modal, setShowResetPasswordModal] = useState(false);

    useEffect(() => {
        if (AppStore.is_user_logged_in) {
            getAPI(COURSES)
                .then(data => {
                    dispatch('setCourses', data);
                })
                .catch(err => {});
        } else {
            getAPINoAuth(COURSES)
                .then(data => {
                    dispatch('setCourses', data);
                })
                .catch(err => {});
        }
    }, [AppStore.is_user_logged_in]);

    useEffect(() => {
        let action = getParameterFromUrl('action');
        let token = getParameterFromUrl('token');
        let user_id = getParameterFromUrl('user_id');
        let source_data = getParameterFromUrl('source_data');
        if (action === 'email_change_confirm') {
            let data = {
                token: token,
                user_id: user_id
            };
            postAPINoAuth(CONFIRM_CHANGE_EMAIL, data)
                .then(response => {
                    dispatch('changeProfileCompletion', response.token, response.id, response.user_profile_id);
                })
                .catch(err => {});
        }
        if (action === 'signup') {
            let data = {
                token: token,
                user_id: user_id
            };
            postAPINoAuth(CONFIRM_SIGNUP, data)
                .then(response => {
                    dispatch('changeProfileCompletion', response.token, response.id, response.user_profile_id);
                    setSourceData(response.user_profile_id);
                })
                .catch(err => {});
        }
        if (action === 'reset_password') {
            setResetPasswordToken(token);
            setShowResetPasswordModal(true);
        }
        if (action === 'free_enrollment') {
            if (!AppStore.is_user_logged_in) {
                dispatch('openLoginModal');
            }
        }
        if (source_data) {
            localStorage.setItem('source_data', source_data);
        }
    }, []);

    // reset course modules on login and logout
    useEffect(() => {
        dispatch('resetCourseModules');
    }, [AppStore.is_user_logged_in]);

    // assign credits to global variable if user is logged in
    useEffect(() => {
        if (AppStore.is_user_logged_in && !AppStore.is_user_fetched) {
            getAPI(interpolate(FETCH_CREDITS, [getUserProfileId()]))
                .then(response => {
                    dispatch('setUserCredits', response.credits);
                })
                .catch(err => {});
        }
    }, [AppStore.is_user_logged_in]);

    // assign basic profile details to global variable if user is logged in
    useEffect(() => {
        if (AppStore.is_user_logged_in && !AppStore.is_user_fetched) {
            getAPI(interpolate(FETCH_PROFILE_DETAIL, [getUserProfileId()]))
                .then(data => {
                    dispatch('setUserDetail', data);
                })
                .catch(err => {});
        }
    }, [AppStore.is_user_logged_in]);

    // redirect to redirect path when user logs in
    useEffect(() => {
        let redirect = getParameterFromUrl('redirect');
        if (AppStore.is_user_logged_in && !!redirect) {
            props.history.replace(redirect);
        }
    }, [AppStore.is_user_logged_in]);

    const redirectToCourse = (modules, course_slug) => {
        if (course_slug === 'cpp') {
            props.history.push('/courses/' + course_slug + '/' + modules[0].protopics[2].subtopics[0].slug + '/');
        } else {
            props.history.push('/courses/' + course_slug + '/' + modules[0].protopics[0].subtopics[0].slug + '/');
        }
    };
    const handleRedirectToCourse = course_slug => {
        let hide = message.loading(REDIRECTING_TO_COURSE, 0);
        fetchModules(course_slug, AppStore.is_user_logged_in)
            .then(data => {
                dispatch('setCourseModules', course_slug, data);
                hide();
                redirectToCourse(data.result, course_slug);
            })
            .catch(err => {
                hide();
            });
    };
    // enroll in course if url has action = free_enrollment query param
    useEffect(() => {
        let action = getParameterFromUrl('action');
        let course_slug = getParameterFromUrl('course');
        if (AppStore.is_user_logged_in && action === 'free_enrollment' && !!course_slug) {
            let hide = message.loading(CHECKING_ELIGIBILITY, 0);
            postAPI(interpolate(FREE_ENROLLMENT, [course_slug]))
                .then(response => {
                    hide();
                    handleRedirectToCourse(course_slug);
                })
                .catch(err => {
                    hide();
                });
        }
    }, [AppStore.is_user_logged_in]);

    return (
        <div className='App'>
            <ConfirmResetPassword
                token={reset_password_token}
                visible={show_reset_password_modal}
                onCancel={() => setShowResetPasswordModal(false)}
            />
            <Header />
            <OfferTopBanner />
            <div className='body-height'>
                <Suspense
                    fallback={
                        <div style={{ height: '100vh' }}>
                            <LoadingSpinner />
                        </div>
                    }>
                    <Switch>
                        <Route exact path='/tnc' render={props => <TnC {...props} />} />
                        <Route exact path='/about' render={props => <About {...props} />} />
                        <Route exact path='/privacy-policy' render={props => <PrivacyPolicy {...props} />} />
                        <Route
                            exact
                            path='/courses/:course_slug/:subtopic_slug'
                            render={props => <CourseContent {...props} />}
                        />
                        <Route
                            exact
                            path='/courses/:course_slug/:topic_or_subtopic_slug/:menu'
                            render={props => <CourseContent {...props} />}
                        />
                        <Route
                            exact
                            path='/discussion/questions/:question_id'
                            render={props => <DiscussionQuestion {...props} />}
                        />
                        <Route
                            exact
                            path='/practice/questions/:question_id'
                            render={props => <PracticeQuestion {...props} />}
                        />
                        <Route exact path='/courses/:course_slug' render={props => <CourseOverview {...props} />} />
                        <AuthorizedRoute
                            path='/profile'
                            component={Profile}
                            exact={true}
                            is_logged_in={AppStore.is_user_logged_in}
                        />
                        <AuthorizedRoute
                            path='/profile/:menu'
                            component={Profile}
                            exact={false}
                            is_logged_in={AppStore.is_user_logged_in}
                        />
                        <AuthorizedRoute
                            path='/billing-history'
                            component={BillingHistory}
                            exact={true}
                            is_logged_in={AppStore.is_user_logged_in}
                        />
                        <AuthorizedRoute
                            path='/checkout/:course_slug'
                            component={Checkout}
                            exact={true}
                            is_logged_in={AppStore.is_user_logged_in}
                        />
                        <AuthorizedRoute
                            path='/summary-update/:topic_slug'
                            component={SummaryUpdate}
                            exact={true}
                            is_logged_in={AppStore.is_user_logged_in}
                        />
                        <Route exact path='/' render={props => <HomePage {...props} />} />
                        <Route component={NotFound} />
                    </Switch>
                </Suspense>
            </div>
            <Footer />
        </div>
    );
};

export default withRouter(App);
