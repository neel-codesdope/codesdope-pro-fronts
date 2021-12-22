import React, { useState, useEffect, lazy } from 'react';
import { withRouter, Switch, matchPath } from 'react-router-dom';
import { Menu, Button, message } from 'antd';
import {
    PlayCircleOutlined,
    FileTextOutlined,
    CodeOutlined,
    CommentOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    CloseOutlined,
    LockOutlined
} from '@ant-design/icons';
import { postAPI, getAPI, interpolate } from '../../../Utils/ApiCalls';
import {
    UPDATE_WATCHED_STATUS,
    UPDATE_PREFERRED_LANGUAGE,
    FETCH_COURSE_LANGUAGES,
    FETCH_COURSE_PROGRESS
} from '../../../Constants/Urls';
import {
    fetchModules,
    returnStoredModules,
    returnStoredPreferredLanguage,
    isArrayEmpty,
    changeTimeFormat
} from '../../../Utils/HelperFunctions';
import {
    SUBTOPIC_TYPE,
    CONTENT_MENU,
    PRACTICE_LEVELS,
    COURSE_ENROLLMENT_STATUS,
    COURSE_PROGRESS_TO_SHOW_RATING
} from '../../../Constants/Values';
import { CHANGING_AUDIO_LANGUAGE } from '../../../Constants/Messages';
import { getInputSkeleton } from '../../UI Elements/Skeleton/GeneralSkeleton';
import { useStore } from '../../../Stores/SetStore';
import CourseAuthorizedRoute from '../../../HOC/CourseAuthorizedRoute';
import ErrorHandlerWrapper from '../../../HOC/ErrorHandlerWrapper';
import CourseCertificate from '../../UI Elements/CourseCertificate/CourseCertificate';
import CourseLanguage from '../../UI Elements/CourseLanguage/CourseLanguage';
import { Helmet } from 'react-helmet';
import { isEmptyObject } from '../../../Utils/HelperFunctions';
import RegularOfferTopBanner from '../../Offer/RegularOfferTopBanner';
import CourseRatingWrapper from './Components/CourseRatingWrapper';

const CourseVideo = lazy(() => import('./CourseVideo/CourseVideo'));
const CourseSummary = lazy(() => import('./CourseSummary/CourseSummary'));
const CourseDiscussion = lazy(() => import('./CourseDiscussion/CourseDiscussion'));
const CoursePractice = lazy(() => import('./CoursePractice/CoursePractice'));

const { SubMenu } = Menu;

const CourseContent = props => {
    const [AppStore, dispatch] = useStore();
    const [modules, setModules] = useState([]);
    const [menu_collapsed, setMenuCollapsed] = useState(window.innerWidth > 768 ? false : true);
    const [tabs_collapsed, setTabsCollapsed] = useState(true);
    const [isLaptop, setIsLaptop] = useState(window.innerWidth > 768 ? true : false);
    const [selected_key_tab, setSelectedKeyTab] = useState();
    const [selected_subtopic, setSelectedSubtopic] = useState();
    const [selected_protopic, setSelectedProtopic] = useState();
    const [selected_module, setSelectedModule] = useState();
    const [course_enrollment_status, setCourseEnrollmentStatus] = useState();
    const [preferred_language, setPreferredLanguage] = useState();
    const [openKeysArray, setOpenKeysArray] = useState([]);
    const [is_subtopic_watched, setIsSubtopicWatched] = useState(false);
    const [course_progress, setCourseProgress] = useState(0);
    const [loading_modules, setLoadingModules] = useState(false);
    const [error, setError] = useState();

    const subtopic_menus = [];
    const topic_menus = [CONTENT_MENU.SUMMARY, CONTENT_MENU.PRACTICE, CONTENT_MENU.DISCUSSION];

    const course_slug = props.match.params['course_slug'];

    const level =
        !!props.location.search &&
        PRACTICE_LEVELS.includes(parseInt(props.location.search[props.location.search.length - 1], 10))
            ? props.location.search
            : '?level=1';

    // returns subtopic_slug from url
    const returnSubtopicFromUrl = () => {
        const match = matchPath(props.history.location.pathname, {
            path: '/courses/:course_slug/:subtopic_slug',
            exact: true,
            strict: false
        });
        return !!match ? match.params.subtopic_slug : null;
    };

    // returns topic_or_subtopic_slug from url
    const returnTopicOrSubtopicFromUrl = () => {
        const match = matchPath(props.history.location.pathname, {
            path: '/courses/:course_slug/:topic_or_subtopic_slug/:menu',
            exact: true,
            strict: false
        });
        return !!match ? match.params.topic_or_subtopic_slug : null;
    };

    // returns menu from url
    const returnMenuFromUrl = () => {
        const match = matchPath(props.history.location.pathname, {
            path: '/courses/:course_slug/:topic_or_subtopic_slug/:menu',
            exact: true,
            strict: false
        });
        return !!match ? match.params.menu : null;
    };

    /**
     * @name setStatesFromUrl
     * @function
     * @description set states from url path params
     * @param {String} entity (subtopic/protopic) depending on whether url contains subtopic_slug or topic_or_subtopic_slug
     * @param {String} entity_slug subtopic_slug or topic_or_subtopic_slug
     */
    const setStatesFromUrl = (entity, entity_slug) => {
        let module_index, protopic_index, subtopic_index;
        for (module_index = 0; module_index < modules.length; module_index++) {
            let module = modules[module_index];
            if (!isArrayEmpty(module.protopics)) {
                for (protopic_index = 0; protopic_index < module.protopics.length; protopic_index++) {
                    let protopic = module.protopics[protopic_index];
                    if (!isArrayEmpty(protopic.subtopics)) {
                        for (subtopic_index = 0; subtopic_index < protopic.subtopics.length; subtopic_index++) {
                            let subtopic = protopic.subtopics[subtopic_index];
                            if (entity === 'subtopic') {
                                if (subtopic.slug === entity_slug) {
                                    setSelectedProtopic(protopic.slug);
                                    setSelectedModule(module.slug);
                                    setSelectedSubtopicWatchedStatus(subtopic.watched);
                                    setOpenKeys(module.slug, protopic.slug, true);
                                    break;
                                }
                            }
                            if (entity === 'protopic') {
                                if (protopic.slug === entity_slug) {
                                    setSelectedSubtopic(subtopic.slug);
                                    setSelectedModule(module.slug);
                                    setSelectedSubtopicWatchedStatus(subtopic.watched);
                                    setOpenKeys(module.slug, protopic.slug, true);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    /**
     * @name setInitialStatesFromUrl
     * @function
     * @description set states initially (on first loading page and on back/forward browser btn press)
     * @param {String} is_first boolean to store if page is loaded for the first time
     * is_first = true, page is loaded for the first time
     * is_first = false, back/forward browser btn press
     */
    const setInitialStatesFromUrl = (is_first = true) => {
        // if url contains subtopic
        if (!!returnSubtopicFromUrl()) {
            setSelectedSubtopic(returnSubtopicFromUrl());
            setSelectedKeyTab('video');
            if (!is_first) {
                setStatesFromUrl('subtopic', returnSubtopicFromUrl());
            }
        }
        // if url contains topic and menu
        else if (!returnSubtopicFromUrl()) {
            if ([CONTENT_MENU.SUMMARY, CONTENT_MENU.PRACTICE, CONTENT_MENU.DISCUSSION].includes(returnMenuFromUrl())) {
                setSelectedKeyTab(returnMenuFromUrl());
                if (subtopic_menus.includes(returnMenuFromUrl())) {
                    setSelectedSubtopic(returnTopicOrSubtopicFromUrl());
                    if (!is_first) {
                        setStatesFromUrl('subtopic', returnTopicOrSubtopicFromUrl());
                    }
                }
                if (topic_menus.includes(returnMenuFromUrl())) {
                    setSelectedProtopic(returnTopicOrSubtopicFromUrl());
                    if (!is_first) {
                        setStatesFromUrl('protopic', returnTopicOrSubtopicFromUrl());
                    }
                }
            } else if (!error) {
                setError(404);
            }
        }
    };

    // check if page is loaded for the first time
    if (!selected_protopic && !selected_subtopic) {
        setInitialStatesFromUrl();
    }

    // Change states from url on back/forward browser button press
    useEffect(() => {
        window.onpopstate = e => {
            setInitialStatesFromUrl(false);
        };
    }, [window.onpopstate]);

    const callUpdatePreferredLanguageAPI = language => {
        let data = {};
        data.preffered_language = language.id;
        data.preffered_language_name = language.name;
        postAPI(interpolate(UPDATE_PREFERRED_LANGUAGE, [course_slug]), data, 'PATCH')
            .then(response => {})
            .catch(err => {});
    };

    const getPreferredLanguageFromModule = (module_language_preference, enrolled) => {
        return new Promise((resolve, reject) => {
            let language;
            if (!!returnStoredPreferredLanguage(AppStore.course_preferred_languages, course_slug)) {
                language = returnStoredPreferredLanguage(AppStore.course_preferred_languages, course_slug);
                resolve(language);
            } else if (!!module_language_preference && !!module_language_preference.preferred_language) {
                let temp_language = {};
                temp_language.name = module_language_preference.preferred_language_name;
                temp_language.id = module_language_preference.preferred_language;
                language = temp_language;
                resolve(language);
            } else {
                getAPI(interpolate(FETCH_COURSE_LANGUAGES, [course_slug]), {}, AppStore.is_user_logged_in)
                    .then(response => {
                        let temp_language = {};
                        temp_language.name = response[0].name;
                        temp_language.id = response[0].id;
                        language = temp_language;
                        if (AppStore.is_user_logged_in && enrolled === COURSE_ENROLLMENT_STATUS.ENROLLED) {
                            callUpdatePreferredLanguageAPI(language);
                        }
                        resolve(language);
                    })
                    .catch(err => {
                        language = null;
                        reject();
                    });
            }
        });
    };

    // Fetch course module
    useEffect(() => {
        let { course_modules, enrolled, language_preference } = returnStoredModules(
            AppStore.course_modules_list,
            course_slug
        );
        if (!isArrayEmpty(course_modules)) {
            setModules(course_modules);
            setCourseEnrollmentStatus(enrolled);
            getPreferredLanguageFromModule(language_preference, enrolled)
                .then(language => {
                    setPreferredLanguage(language);
                    if (JSON.stringify(language) !== JSON.stringify(AppStore.course_preferred_languages)) {
                        dispatch('setCoursePreferredLanguages', course_slug, language);
                    }
                })
                .catch(err => {});
        } else {
            setLoadingModules(true);
            fetchModules(course_slug, AppStore.is_user_logged_in)
                .then(data => {
                    setModules(data.result);
                    setCourseEnrollmentStatus(data.enrolled);
                    getPreferredLanguageFromModule(data.language_preference, enrolled)
                        .then(language => {
                            setPreferredLanguage(language);
                            if (JSON.stringify(language) !== JSON.stringify(AppStore.course_preferred_languages)) {
                                dispatch('setCoursePreferredLanguages', course_slug, language);
                            }
                        })
                        .catch(err => {});
                    dispatch('setCourseModules', course_slug, data);
                    setError();
                    setLoadingModules(false);
                })
                .catch(err => {
                    setError(err.response.status);
                    setLoadingModules(false);
                });
        }
    }, [AppStore.is_user_logged_in, AppStore.course_modules_list]);

    const changeURLOnModuleOrMenuClick = () => {
        if (selected_key_tab === CONTENT_MENU.VIDEO) {
            if (props.match.url !== '/courses/' + course_slug + '/' + selected_subtopic + '/') {
                props.history.push('/courses/' + course_slug + '/' + selected_subtopic + '/');
            }
        } else if (subtopic_menus.includes(selected_key_tab)) {
            if (props.match.url !== '/courses/' + course_slug + '/' + selected_subtopic + '/' + selected_key_tab) {
                props.history.push('/courses/' + course_slug + '/' + selected_subtopic + '/' + selected_key_tab);
            }
        } else if (topic_menus.includes(selected_key_tab)) {
            if (selected_key_tab === 'practice') {
                if (
                    props.match.url !== '/courses/' + course_slug + '/' + selected_protopic + '/' + selected_key_tab ||
                    props.location.search !== level
                ) {
                    props.history.push(
                        '/courses/' + course_slug + '/' + selected_protopic + '/' + selected_key_tab + level
                    );
                }
            } else if (
                props.match.url !==
                '/courses/' + course_slug + '/' + selected_protopic + '/' + selected_key_tab
            ) {
                props.history.push('/courses/' + course_slug + '/' + selected_protopic + '/' + selected_key_tab);
            }
        }
    };

    // Change url on selecting subtopic or menu
    useEffect(() => {
        changeURLOnModuleOrMenuClick();
    }, [selected_subtopic, selected_protopic, selected_key_tab]);

    const toggleMenuCollapsed = () => {
        setMenuCollapsed(!menu_collapsed);
    };

    const toggleTabsCollapsed = () => {
        setTabsCollapsed(!tabs_collapsed);
    };

    const handleTabClick = e => {
        setSelectedKeyTab(e.key);
    };

    useEffect(() => {
        window.addEventListener('resize', () => {
            setIsLaptop(window.innerWidth > 768);
        });
    });

    const isSubtopicWatched = is_watched => {
        return !(is_watched === false || is_watched === 'locked');
    };

    const setSelectedSubtopicWatchedStatus = is_watched => {
        setIsSubtopicWatched(isSubtopicWatched(is_watched));
    };

    // set selected_subtopic and selected_protopic states on subtopic click
    const handleChapterClick = (subtopic_slug, topic_slug, module_slug, subtopic_is_locked, subtopic_is_watched) => {
        if (!isLaptop) {
            setMenuCollapsed(true);
        }
        setSelectedSubtopic(subtopic_slug);
        setSelectedProtopic(topic_slug);
        setSelectedModule(module_slug);
        setSelectedSubtopicWatchedStatus(subtopic_is_watched);
    };

    const selectNextChapter = () => {
        let change = false;
        let module_index, protopic_index, subtopic_index;
        for (module_index = 0; module_index < modules.length; module_index++) {
            let module = modules[module_index];
            if (!isArrayEmpty(module.protopics)) {
                for (protopic_index = 0; protopic_index < module.protopics.length; protopic_index++) {
                    let protopic = module.protopics[protopic_index];
                    if (!isArrayEmpty(protopic.subtopics)) {
                        for (subtopic_index = 0; subtopic_index < protopic.subtopics.length; subtopic_index++) {
                            let subtopic = protopic.subtopics[subtopic_index];
                            if (change === true) {
                                setSelectedSubtopic(subtopic.slug);
                                setSelectedProtopic(protopic.slug);
                                setSelectedModule(module.slug);
                                setSelectedSubtopicWatchedStatus(subtopic.watched);
                                setOpenKeys(module.slug, protopic.slug, true);
                                change = false;
                                return true;
                            }
                            if (subtopic.slug === selected_subtopic) {
                                change = true;
                            }
                            if (
                                module_index === modules.length - 1 &&
                                protopic_index === module.protopics.length - 1 &&
                                subtopic_index === protopic.subtopics.length - 1
                            ) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    };

    const returnFieldFromModule = (host_entity, entity = null, field = null) => {
        let value;
        modules.forEach(function (module) {
            module.protopics.forEach(function (protopic) {
                if (!!selected_protopic) {
                    if (protopic.slug === selected_protopic) {
                        if (host_entity === 'protopic') {
                            if (entity === 'module') {
                                value = !!field ? module[field] : module;
                            }
                            if (entity === 'protopic') {
                                value = !!field ? protopic[field] : protopic;
                            }
                            if (entity === 'subtopic') {
                                value = !!field ? protopic.subtopics[0][field] : protopic.subtopics[0];
                            }
                        }
                        if (host_entity === 'isValid') {
                            value = true;
                        }
                    }
                }
                if (!!selected_subtopic) {
                    if (!isArrayEmpty(protopic.subtopics)) {
                        protopic.subtopics.forEach(function (subtopic) {
                            if (subtopic.slug === selected_subtopic) {
                                if (host_entity === 'subtopic') {
                                    if (entity === 'module') {
                                        value = !!field ? module[field] : module;
                                    }
                                    if (entity === 'protopic') {
                                        value = !!field ? protopic[field] : protopic;
                                    }
                                    if (entity === 'subtopic') {
                                        value = !!field ? subtopic[field] : subtopic;
                                    }
                                }
                                if (host_entity === 'isValid') {
                                    value = true;
                                }
                            }
                        });
                    }
                }
            });
        });
        return value;
    };

    const getSelectedModule = () => {
        let selected_module = returnFieldFromModule('protopic', 'module', 'slug');
        return selected_module;
    };

    const getSummary = () => {
        let summary = returnFieldFromModule('protopic', 'protopic', 'summary');
        return summary;
    };

    const getVideo = () => {
        let videos = returnFieldFromModule('subtopic', 'subtopic', 'videos');
        let final_video;
        if (!videos || isArrayEmpty(videos) || videos === 'locked') {
            final_video = '';
        } else {
            if (!!preferred_language) {
                videos.forEach(function (video) {
                    if (video.language === preferred_language.id) {
                        final_video = video.video;
                    }
                });
            } else {
                final_video = '';
            }
        }
        return final_video;
    };

    const getVideoDuration = subtopic_videos => {
        let videos = subtopic_videos;
        let duration;
        if (!videos || isArrayEmpty(videos) || videos === 'locked') {
            duration = 0;
        } else {
            if (!!preferred_language) {
                videos.forEach(function (video) {
                    if (video.language === preferred_language.id) {
                        duration = video.duration;
                    }
                });
            } else {
                duration = 0;
            }
        }
        return duration;
    };

    const getProtopicDuration = protopic => {
        let duration = 0;
        protopic.subtopics.forEach(subtopic => {
            let subtopic_duration = getVideoDuration(subtopic.videos);
            if (!!subtopic_duration) {
                duration += subtopic_duration;
            }
        });
        return duration;
    };

    const getModuleDuration = module => {
        let duration = 0;
        module.protopics.forEach(protopic => {
            duration += getProtopicDuration(protopic);
        });
        return duration;
    };

    const getIsTopicLocked = () => {
        let is_topic_locked = returnFieldFromModule('protopic', 'protopic', 'is_locked');
        return is_topic_locked;
    };

    const getIsSubtopicLocked = () => {
        let is_topic_locked = returnFieldFromModule('subtopic', 'subtopic', 'is_locked');
        return is_topic_locked;
    };

    const getIsSummaryLocked = () => {
        let is_summary_locked = returnFieldFromModule('protopic', 'protopic', 'is_summary_locked');
        return is_summary_locked;
    };

    const checkValidUrl = () => {
        if (!isArrayEmpty(modules) && !error) {
            if (!(!!selected_subtopic && !!selected_protopic) || (!selected_subtopic && !selected_protopic)) {
                let is_valid = returnFieldFromModule('isValid');
                if (!is_valid) {
                    setError(404);
                }
            }
        }
    };

    const setInitialStatesFromSelectedProtopic = (protopic, module_slug) => {
        if (!isArrayEmpty(protopic.subtopics) && selected_protopic === protopic.slug && !selected_subtopic) {
            setSelectedSubtopic(protopic.subtopics[0].slug);
            setSelectedModule(module_slug);
            setSelectedSubtopicWatchedStatus(protopic.subtopics[0].watched);
            setOpenKeys(module_slug, protopic.slug);
        }
    };

    const setInitialStatesFromSelectedSubtopic = (protopic_slug, subtopic, module_slug) => {
        if (selected_subtopic === subtopic.slug && !selected_protopic) {
            setSelectedProtopic(protopic_slug);
            setSelectedModule(module_slug);
            setSelectedSubtopicWatchedStatus(subtopic.watched);
            setOpenKeys(module_slug, protopic_slug);
        }
    };

    const setOpenKeys = (module_slug = null, protopic_slug = null, force_update = false) => {
        if (!!module_slug && !protopic_slug) {
            openKeysArray[0] === module_slug ? setOpenKeysArray([]) : setOpenKeysArray([module_slug]);
        }
        if (!!module_slug && !!protopic_slug) {
            force_update
                ? setOpenKeysArray([module_slug, protopic_slug])
                : openKeysArray[1] === protopic_slug
                ? setOpenKeysArray([module_slug])
                : setOpenKeysArray([module_slug, protopic_slug]);
        }
        if (!module_slug && !protopic_slug) {
            if (!!selected_module && !!selected_protopic) {
                setOpenKeysArray([selected_module, selected_protopic]);
            }
        }
    };

    const getCourseProgress = () => {
        if (AppStore.is_user_logged_in) {
            getAPI(interpolate(FETCH_COURSE_PROGRESS, [course_slug]))
                .then(response => {
                    setCourseProgress(response);
                })
                .catch(err => {});
        } else {
            setCourseProgress({ progress: 0, eligible_for_certificate: false });
        }
    };

    useEffect(() => {
        if (
            AppStore.is_user_logged_in &&
            (course_enrollment_status === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                course_enrollment_status === COURSE_ENROLLMENT_STATUS.EXPIRED)
        ) {
            getCourseProgress();
        }
    }, [AppStore.is_user_logged_in, course_enrollment_status]);

    const updateSuptopicWatchedStatus = subtopic_slug => {
        return new Promise((resolve, reject) => {
            postAPI(interpolate(UPDATE_WATCHED_STATUS, [subtopic_slug]))
                .then(response => {
                    setIsSubtopicWatched(isSubtopicWatched(response.watched));
                    fetchModules(course_slug, AppStore.is_user_logged_in)
                        .then(data => {
                            setModules(data.result);
                            setCourseEnrollmentStatus(data.enrolled);
                            dispatch('setCourseModules', course_slug, data);
                            if (
                                course_enrollment_status === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                                course_enrollment_status === COURSE_ENROLLMENT_STATUS.EXPIRED
                            ) {
                                getCourseProgress();
                            }
                            setError();
                            resolve();
                        })
                        .catch(err => {
                            setError(err.response.status);
                            reject();
                        });
                })
                .catch(err => {
                    reject();
                });
        });
    };

    const changeLanguage = data => {
        let new_data = {};
        new_data.preffered_language = data.id;
        let hide = message.loading(CHANGING_AUDIO_LANGUAGE, 0);
        return new Promise((resolve, reject) => {
            if (AppStore.is_user_logged_in && course_enrollment_status === COURSE_ENROLLMENT_STATUS.ENROLLED) {
                postAPI(interpolate(UPDATE_PREFERRED_LANGUAGE, [course_slug]), new_data, 'PATCH')
                    .then(response => {
                        let temp_language = {};
                        temp_language.name = response.preffered_language_name;
                        temp_language.id = response.preffered_language;
                        setPreferredLanguage(temp_language);
                        dispatch('setCoursePreferredLanguages', course_slug, temp_language);
                        hide();
                        resolve(temp_language);
                    })
                    .catch(err => {
                        hide();
                        reject();
                    });
            } else {
                setPreferredLanguage(data);
                dispatch('setCoursePreferredLanguages', course_slug, data);
                hide();
                resolve(data);
            }
        });
    };

    const getModules = () => {
        const modules_list = modules.map((module, module_index) => (
            <SubMenu
                className='course-content-menu-li vertical-padding'
                key={module.slug}
                onTitleClick={() => setOpenKeys(module.slug)}
                title={
                    <>
                        <span className='course-content-menu-title-text course-content-menu-title'>
                            Section {module_index + 1}: {module.name}
                        </span>
                        <span className='course-content-time course-content-menu-title'>
                            {changeTimeFormat(getModuleDuration(module), false)}
                        </span>
                    </>
                }>
                {!isArrayEmpty(module.protopics) &&
                    module.protopics.map((protopic, protopic_index) => {
                        setInitialStatesFromSelectedProtopic(protopic, module.slug);
                        return (
                            <SubMenu
                                className='vertical-padding'
                                key={protopic.slug}
                                onTitleClick={() => setOpenKeys(module.slug, protopic.slug)}
                                title={
                                    <>
                                        <span className='course-content-menu-subtitle-text'>
                                            {protopic_index + 1}. {protopic.name}
                                        </span>
                                        <span className='course-content-time'>
                                            {changeTimeFormat(getProtopicDuration(protopic))}
                                        </span>
                                    </>
                                }>
                                {!isArrayEmpty(protopic.subtopics) &&
                                    protopic.subtopics.map((subtopic, subtopic_index) => {
                                        setInitialStatesFromSelectedSubtopic(protopic.slug, subtopic, module.slug);
                                        return (
                                            <Menu.Item
                                                className='vertical-padding'
                                                key={subtopic.slug}
                                                onClick={() =>
                                                    handleChapterClick(
                                                        subtopic.slug,
                                                        protopic.slug,
                                                        module.slug,
                                                        subtopic.is_locked,
                                                        subtopic.watched
                                                    )
                                                }>
                                                <span className='course-content-menu-item'>
                                                    {isSubtopicWatched(subtopic.watched) ? (
                                                        <i className='fa fa-check-square course-content-watched-icon primary-color mr'></i>
                                                    ) : (
                                                        <i className='fa fa-square-o course-content-watched-icon primary-color mr'></i>
                                                    )}
                                                    {subtopic_index + 1}. {subtopic.name}
                                                </span>
                                                <span className='course-content-time'>
                                                    <span className='course-content-type'>
                                                        {SUBTOPIC_TYPE[subtopic.content_type]}
                                                    </span>
                                                    <span className='ml'>
                                                        {changeTimeFormat(getVideoDuration(subtopic.videos))}
                                                    </span>
                                                    {subtopic.is_locked && <LockOutlined className='float-right' />}
                                                </span>
                                            </Menu.Item>
                                        );
                                    })}
                            </SubMenu>
                        );
                    })}
            </SubMenu>
        ));
        return modules_list;
    };

    const getLanguageButton = (wrapper_class_name = '') => (
        <div className={'mr ' + wrapper_class_name}>
            <CourseLanguage
                preferred_language={preferred_language}
                course_slug={course_slug}
                changeLanguage={changeLanguage}
            />
        </div>
    );

    const getCertificateButton = (wrapper_class_name = '') => (
        <div className={wrapper_class_name}>
            <CourseCertificate
                is_subtopic_watched={is_subtopic_watched}
                course_slug={course_slug}
                progress={!isEmptyObject(course_progress) ? course_progress.progress : 0}
                is_eligible={!isEmptyObject(course_progress) ? course_progress.eligible_for_certificate : false}
            />
        </div>
    );

    const getModuleSkeleton = () => (
        <div className='flex-container justify-center flex-column mt-xl pl-l pr-l' style={{ width: '100%' }}>
            <span className='mt-l ml-l mr-l'>{getInputSkeleton('large', 200)}</span>
            <span className='mt-l ml-l mr-l'>{getInputSkeleton('large', 200)}</span>
            <span className='mt-l ml-l mr-l'>{getInputSkeleton('large', 200)}</span>
        </div>
    );

    const get_selected_protopic = () => {
        let selected_module_dict = modules.find(module => module.slug === selected_module);
        let selected_protopic_dict = selected_module_dict
            ? selected_module_dict.protopics.find(protopic => protopic.slug === selected_protopic)
            : undefined;
        return selected_protopic_dict;
    };

    const get_selected_subtopic = () => {
        let selected_protopic_dict = get_selected_protopic();
        let selected_subtopic_dict = selected_protopic_dict
            ? selected_protopic_dict.subtopics.find(subtopic => subtopic.slug === selected_subtopic)
            : undefined;
        return selected_subtopic_dict;
    };

    const get_selected_subtopic_name = () => {
        let selected_subtopic_dict = get_selected_subtopic();
        return selected_subtopic_dict ? selected_subtopic_dict.name : undefined;
    };

    const get_selected_protopic_name = () => {
        let selected_protopic_dict = get_selected_protopic();
        return selected_protopic_dict ? selected_protopic_dict.name : undefined;
    };

    return (
        <>
            {checkValidUrl()}
            <Helmet>
                <title>Course Content - CodesDope Pro</title>
                <meta
                    name='description'
                    content='Course content including videos, summary, discussion questions and practice questions - CodesDope Pro'
                />
            </Helmet>
            <ErrorHandlerWrapper error={error}>
                {/* Tabs for video, discussion, practice, pdf (Tab, Mobile) */}
                <RegularOfferTopBanner course_slug={course_slug} course_enrollment_status={course_enrollment_status} />
                <div className='course-content-tabs-mob laptop-hide'>
                    <div>
                        <Menu
                            className='display-block center-align default-card-neu'
                            selectedKeys={[selected_key_tab]}
                            mode='horizontal'
                            onClick={handleTabClick}>
                            <Menu.Item key={CONTENT_MENU.VIDEO}>Video</Menu.Item>
                            <Menu.Item key={CONTENT_MENU.SUMMARY}>Summary</Menu.Item>
                            <Menu.Item key={CONTENT_MENU.PRACTICE}>Practice</Menu.Item>
                            <Menu.Item key={CONTENT_MENU.DISCUSSION}>Discussion</Menu.Item>
                        </Menu>
                    </div>
                </div>

                {/* Course Page */}
                <div className='course-content-wrapper flex-container flex-row pt-l'>
                    {/* Course Module */}
                    <div
                        className={
                            menu_collapsed ? 'course-content-menu-wrapper-collapsed' : 'course-content-menu-wrapper'
                        }>
                        {!loading_modules
                            ? !isArrayEmpty(modules) && (
                                  <div>
                                      <Button type='primary' onClick={toggleMenuCollapsed} style={{ borderRadius: 0 }}>
                                          {React.createElement(menu_collapsed ? MenuUnfoldOutlined : CloseOutlined)}
                                      </Button>
                                      <Menu
                                          className={
                                              'course-content-menu pt pb ' +
                                              (menu_collapsed ? 'menu-collapsed ' : 'menu-inline ') +
                                              (isLaptop ? 'default-card-neu' : '')
                                          }
                                          selectedKeys={[selected_subtopic]}
                                          defaultOpenKeys={isLaptop ? [getSelectedModule(), selected_protopic] : []}
                                          openKeys={!menu_collapsed ? openKeysArray : []}
                                          mode='inline'>
                                          {getModules()}
                                      </Menu>
                                  </div>
                              )
                            : isLaptop && getModuleSkeleton()}
                    </div>

                    {/* Content */}
                    <div className='course-content'>
                        {isLaptop && (
                            <div
                                className='flex-container flex-row justify-center float-right mb'
                                style={{ alignItems: 'stretch' }}>
                                {getLanguageButton()}
                                {(course_enrollment_status === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                                    course_enrollment_status === COURSE_ENROLLMENT_STATUS.EXPIRED) &&
                                    AppStore.is_user_logged_in &&
                                    getCertificateButton()}
                            </div>
                        )}
                        <div className='clear-both'>
                            <Switch>
                                <CourseAuthorizedRoute
                                    path='/courses/:course_slug/:subtopic_slug'
                                    component={CourseVideo}
                                    exact={true}
                                    course_slug={course_slug}
                                    is_content_locked={getIsSubtopicLocked()}
                                    is_content_locked_when_logged_out={getIsSubtopicLocked()}
                                    is_user_logged_in={AppStore.is_user_logged_in}
                                    loading_module={isArrayEmpty(modules)}
                                    appProps={{
                                        selectNextChapter: selectNextChapter,
                                        updateSuptopicWatchedStatus: updateSuptopicWatchedStatus,
                                        selected_subtopic: selected_subtopic,
                                        is_subtopic_watched: is_subtopic_watched,
                                        video: getVideo(),
                                        selected_subtopic_name: get_selected_subtopic_name(),
                                        course_enrollment_status: course_enrollment_status,
                                        preferred_language: preferred_language
                                    }}
                                />
                                <CourseAuthorizedRoute
                                    path='/courses/:course_slug/:topic_slug/summary'
                                    component={CourseSummary}
                                    exact={true}
                                    course_slug={course_slug}
                                    is_content_locked={getIsSummaryLocked()}
                                    is_content_locked_when_logged_out={getIsSummaryLocked()}
                                    is_user_logged_in={AppStore.is_user_logged_in}
                                    loading_module={isArrayEmpty(modules)}
                                    appProps={{
                                        summary: getSummary(),
                                        loading: isArrayEmpty(modules),
                                        selected_protopic_name: get_selected_protopic_name()
                                    }}
                                />
                                <CourseAuthorizedRoute
                                    path='/courses/:course_slug/:topic_slug/discussion'
                                    component={CourseDiscussion}
                                    exact={true}
                                    course_slug={course_slug}
                                    is_content_locked={
                                        !(
                                            course_enrollment_status === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                                            course_enrollment_status === COURSE_ENROLLMENT_STATUS.EXPIRED
                                        )
                                    }
                                    is_content_locked_when_logged_out={true}
                                    is_user_logged_in={AppStore.is_user_logged_in}
                                    loading_module={isArrayEmpty(modules)}
                                    appProps={{
                                        course_enrollment_status: course_enrollment_status,
                                        selected_protopic_name: get_selected_protopic_name()
                                    }}
                                />
                                <CourseAuthorizedRoute
                                    path='/courses/:course_slug/:topic_slug/practice'
                                    component={CoursePractice}
                                    exact={true}
                                    course_slug={course_slug}
                                    is_content_locked={
                                        !(
                                            course_enrollment_status === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                                            course_enrollment_status === COURSE_ENROLLMENT_STATUS.EXPIRED
                                        )
                                    }
                                    is_user_logged_in={AppStore.is_user_logged_in}
                                    is_content_locked_when_logged_out={true}
                                    loading_module={isArrayEmpty(modules)}
                                    appProps={{
                                        course_enrollment_status: course_enrollment_status,
                                        selected_protopic: selected_protopic,
                                        selected_protopic_name: get_selected_protopic_name()
                                    }}
                                />
                            </Switch>
                        </div>

                        {!isLaptop && (
                            <div
                                className='flex-container flex-row flex-wrap justify-center float-right mt-l ml mr'
                                style={{ alignItems: 'stretch' }}>
                                {getLanguageButton('mt')}
                                {(course_enrollment_status === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                                    course_enrollment_status === COURSE_ENROLLMENT_STATUS.EXPIRED) &&
                                    AppStore.is_user_logged_in &&
                                    getCertificateButton('mt')}
                            </div>
                        )}
                        {(course_enrollment_status === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                            course_enrollment_status === COURSE_ENROLLMENT_STATUS.EXPIRED) &&
                            AppStore.is_user_logged_in &&
                            course_progress.progress >= COURSE_PROGRESS_TO_SHOW_RATING && (
                                <CourseRatingWrapper course_slug={course_slug} />
                            )}
                    </div>

                    {/* Tabs for video, discussion, practice, pdf (Laptop) */}
                    <div className='course-content-tabs-wrapper pl tab-hide'>
                        <div>
                            <Button
                                type='primary'
                                onClick={toggleTabsCollapsed}
                                style={{ marginBottom: 16, borderRadius: 0 }}>
                                {React.createElement(tabs_collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                            </Button>
                            <Menu
                                className='small-card-neu'
                                selectedKeys={[selected_key_tab]}
                                mode='inline'
                                inlineCollapsed={tabs_collapsed}
                                onClick={handleTabClick}>
                                <Menu.Item key={CONTENT_MENU.VIDEO} icon={<PlayCircleOutlined />}>
                                    Video
                                </Menu.Item>
                                <Menu.Item key={CONTENT_MENU.SUMMARY} icon={<FileTextOutlined />}>
                                    Summary
                                </Menu.Item>
                                <Menu.Item key={CONTENT_MENU.PRACTICE} icon={<CodeOutlined />}>
                                    Practice
                                </Menu.Item>
                                <Menu.Item key={CONTENT_MENU.DISCUSSION} icon={<CommentOutlined />}>
                                    Discussion
                                </Menu.Item>
                            </Menu>
                        </div>
                    </div>
                </div>
            </ErrorHandlerWrapper>
        </>
    );
};

export default withRouter(CourseContent);
