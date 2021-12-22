import { initStore } from './SetStore';

const configureStore = () => {
    const actions = {
        setCourses: (state, courses) => {
            localStorage.setItem('courses', courses);
            return { courses: courses };
        },
        setCourseModules: (state, course_slug, modules) => {
            let updated_modules = [];
            let add_modules = true;
            updated_modules = state.course_modules_list.map(el => {
                if (el.course_slug === course_slug) {
                    add_modules = false;
                    return {
                        ...el,
                        modules: modules.result,
                        enrolled: modules.enrolled,
                        language_preference: modules.language_preference
                    };
                } else {
                    return el;
                }
            });
            if (add_modules) {
                updated_modules.push({
                    course_slug: course_slug,
                    modules: modules.result,
                    enrolled: modules.enrolled,
                    language_preference: modules.language_preference
                });
            }
            return { course_modules_list: updated_modules };
        },
        resetCourseModules: state => ({ course_modules_list: [] }),
        setCoursePreferredLanguages: (state, course_slug, language) => {
            let updated_languages = [];
            let add_language = true;
            if (!!state.course_preferred_languages) {
                updated_languages = state.course_preferred_languages.map(el => {
                    if (el.course_slug === course_slug) {
                        add_language = false;
                        return {
                            ...el,
                            language: language
                        };
                    } else {
                        return el;
                    }
                });
            }
            if (add_language) {
                updated_languages.push({
                    course_slug: course_slug,
                    language: language
                });
            }
            localStorage.setItem('course_preferred_languages', JSON.stringify(updated_languages));
            return { course_preferred_languages: updated_languages };
        },
        openLoginModal: state => ({
            show_login_modal: true
        }),
        closeLoginModal: state => ({
            show_login_modal: false
        }),
        openSignupModal: state => ({
            show_signup_modal: true
        }),
        closeSignupModal: state => ({
            show_signup_modal: false
        }),
        showSideMenu: state => ({ show_side_menu: true }),
        closeSideMenu: state => ({ show_side_menu: false }),
        showOfferBanner: (state, show_banner, course) => {
            let result = { ...state.offer_banner, show_offer_banner: show_banner, course_slug: course };
            return { offer_banner: result };
        }
    };

    initStore(actions, {
        courses: [],
        course_modules_list: [],
        course_preferred_languages: JSON.parse(localStorage.getItem('course_preferred_languages') || '[]'),
        show_login_modal: false,
        show_signup_modal: false,
        show_side_menu: false,
        offer_banner: { show_offer_banner: false, course_slug: '' }
    });
};

export default configureStore;
