import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Collapse, Button } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { getAPI, interpolate } from '../../../Utils/ApiCalls';
import { FETCH_COURSE_OVERVIEW } from '../../../Constants/Urls';
import { fetchModules, returnStoredModules, isArrayEmpty, convertCurrency } from '../../../Utils/HelperFunctions';
import { SUBTOPIC_TYPE, COURSE_ENROLLMENT_STATUS } from '../../../Constants/Values';
import { useStore } from '../../../Stores/SetStore';
import {
    getParagraphSkeleton,
    getInputSkeleton,
    getAvatarSkeleton,
    getButtonSkeleton
} from '../../UI Elements/Skeleton/GeneralSkeleton';
import LanguageTag from '../../UI Elements/LanguageTag/LanguageTag';
import ErrorHandlerWrapper from '../../../HOC/ErrorHandlerWrapper';
import { Helmet } from 'react-helmet';

const { Panel } = Collapse;

const CourseOverview = props => {
    const [AppStore, dispatch] = useStore();
    const { course_slug } = useParams();
    const [course, setCourse] = useState({});
    const [modules, setModules] = useState([]);
    const [loading_course, setLoadingCourse] = useState(false);
    const [loading_modules, setLoadingModules] = useState(false);
    const [error, setError] = useState();

    // Fetch course detail from api
    useEffect(() => {
        setLoadingCourse(true);
        getAPI(interpolate(FETCH_COURSE_OVERVIEW, [course_slug]), {}, AppStore.is_user_logged_in)
            .then(data => {
                setCourse(data);
                setError();
                setLoadingCourse(false);
            })
            .catch(err => {
                setError(err.response.status);
                setLoadingCourse(false);
            });
    }, [course_slug, AppStore.is_user_logged_in]);

    // Fetch course module from api
    useEffect(() => {
        let { course_modules, _ } = returnStoredModules(AppStore.course_modules_list, course_slug);
        if (!isArrayEmpty(course_modules)) {
            setModules(course_modules);
        } else {
            setLoadingModules(true);
            fetchModules(course_slug, AppStore.is_user_logged_in)
                .then(data => {
                    setModules(data.result);
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

    const getCertificate = () => (
        <div className='course-overview-head-feature'>
            <span className='course-overview-head-features-icon center-align extra-small-shadow-neu pt-s pl-s pr-s'>
                <TrophyOutlined />
            </span>
            <span className='course-overview-head-features-detail ml'>Certificate of Completion</span>
        </div>
    );

    const getFeatures = () => {
        const features_list = course.features
            .sort((a, b) => a.order - b.order)
            .map(
                feature =>
                    !!feature.available && (
                        <div key={feature.id} className='course-overview-feature mt-l pl-l pr-l'>
                            <div className='course-overview-feature-icon-wrapper'>
                                <div className='course-overview-feature-icon-container small-shadow-neu flex-container place-center justify-center align-center'>
                                    <img
                                        src={feature.image}
                                        className='course-overview-feature-icon'
                                        alt={feature.name}
                                    />
                                </div>
                            </div>
                            <div className='course-overview-feature-detail-wrapper mt-l'>
                                <h3 className='course-overview-feature-title'>{feature.name}</h3>
                            </div>
                        </div>
                    )
            );
        return features_list;
    };

    const getModule = () => {
        const module_list = modules.map(module => (
            <Panel header={module.name} key={module.id}>
                <Collapse className='course-overview-subtopic' bordered={false}>
                    {!isArrayEmpty(module.protopics) &&
                        module.protopics.map(protopic => (
                            <Panel header={protopic.name} key={protopic.id}>
                                <ul>
                                    {!isArrayEmpty(protopic.subtopics) &&
                                        protopic.subtopics.map(subtopic => (
                                            <li key={subtopic.id}>
                                                <span
                                                    className={
                                                        'course-subtopic-type ' +
                                                        (subtopic.is_locked ? 'course-subtopic-type-disabled' : '')
                                                    }>
                                                    {SUBTOPIC_TYPE[subtopic.content_type]}
                                                </span>
                                                {!subtopic.is_locked ? (
                                                    <Link to={'/courses/' + course_slug + '/' + subtopic.slug + '/'}>
                                                        {subtopic.name}
                                                    </Link>
                                                ) : (
                                                    <span>
                                                        <span className='disabled-color'>{subtopic.name}</span>
                                                        <span className='float-right wrap-width disabled-color'>
                                                            <i className='fa fa-lock'></i>
                                                        </span>
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                </ul>
                            </Panel>
                        ))}
                </Collapse>
            </Panel>
        ));
        return module_list;
    };

    const getFaq = () => {
        const faq_list = course.faqs
            .sort((a, b) => a.order - b.order)
            .map(faq => (
                <Panel header={faq.question} key={faq.id}>
                    <p>{faq.answer}</p>
                </Panel>
            ));
        return faq_list;
    };

    const getFeatureSkeleton = () => (
        <div className='flex-container justify-center mt-xl pl-l pr-l' style={{ width: '100%' }}>
            <span className='mt-l ml-l mr-l'>{getAvatarSkeleton('circle', 80, 80)}</span>
            <span className='mt-l ml-l mr-l'>{getAvatarSkeleton('circle', 80, 80)}</span>
            <span className='mt-l ml-l mr-l'>{getAvatarSkeleton('circle', 80, 80)}</span>
        </div>
    );

    const getCourseFeaturesSkeleton = () => (
        <div className='flex-container flex-wrap mt-l'>
            <span className='mr-xl'>{getInputSkeleton('small', 80)}</span>
            <span>{getInputSkeleton('small', 100)}</span>
        </div>
    );

    const getCourseOverview = () => {
        if (!!course.course_details) {
            return Object.keys(course.course_details).map((course_detail_key, index) => (
                <div className='course-overview-head-info large-shadow-float center-align mt-l ml mr pt-l pl-l pb-l pr-l'>
                    <div
                        key={index}
                        className='course-overview-head-info-value flex-container justify-center align-center'>
                        {course.course_details[course_detail_key]}
                    </div>
                    <div className='course-overview-head-info-key pt'>{course_detail_key}</div>{' '}
                </div>
            ));
        }
    };

    return (
        <>
            {course.name ? (
                <Helmet>
                    <title>{course.name} Course Overview</title>
                    <meta
                        name='description'
                        content={`Course detail of ${course.name}. Course cirriculum, features and more.`}
                    />
                </Helmet>
            ) : (
                <></>
            )}

            <ErrorHandlerWrapper error={error}>
                {/* Heading */}
                <div className='course-overview-head-wrapper place-center mt-xxl pr-xl pl-xl'>
                    <h1 className='course-overview-main-heading'>{course.name}</h1>
                    {loading_course && getParagraphSkeleton()}
                    <p className='course-overview-head-subtitle mt-l'>{course.brief_intro}</p>
                    {!loading_course
                        ? !isArrayEmpty(course.language) && (
                              <div className='course-overview-head-features flex-container flex-wrap mt-l'>
                                  <div className='course-overview-head-feature mr-xl'>
                                      <span className='course-overview-head-features-icon center-align extra-small-shadow-neu pt-s pl-s pr-s'>
                                          <i className='fa fa-language'></i>
                                      </span>
                                      <span className='course-overview-head-features-detail ml'>
                                          {course.language.map(language_item => (
                                              <LanguageTag
                                                  className='mr'
                                                  key={language_item.id}
                                                  color='purple'
                                                  style={{ padding: '3px 7px' }}>
                                                  {language_item.name}
                                              </LanguageTag>
                                          ))}{' '}
                                          {course.language.length > 1 ? '(Multiple Languages)' : ''}
                                      </span>
                                  </div>
                                  {!!course.certificate_of_completion && getCertificate()}
                              </div>
                          )
                        : getCourseFeaturesSkeleton()}
                    {!loading_course ? (
                        !(
                            course.enrolled === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                            course.enrolled === COURSE_ENROLLMENT_STATUS.EXPIRED
                        ) && (
                            <div className='course-overview-price'>
                                <div className='flex-container align-center mt-l'>
                                    <span>
                                        <span className='course-overview-price-label'>Price:</span>
                                        <span className='course-overview-price-currency primary-color ml'>
                                            <i className='fa fa-inr'></i>
                                        </span>
                                        <span className='ml-s'>
                                            <span className='course-overview-price-money primary-color'>
                                                {convertCurrency(course.total_amount)}
                                            </span>
                                        </span>
                                    </span>
                                    <span>
                                        {!!course.discount && (
                                            <span className='course-overview-original-price ml pl'>
                                                <i className='fa fa-inr'></i>
                                                <span>{convertCurrency(course.course_fee)}</span>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className='course-overview-price mt-xl'>{getInputSkeleton('large', 180)}</div>
                    )}

                    {/* <div className='course-overview-offer-text error-color mt'>
                        Offer valid till{' '}
                        <span className='course-overview-offer-deadline font-weight-500'>18 Aug 2021</span>
                    </div>
                    <div id='countdown'>
                        <ul>
                            <li>
                                <span id='days'></span>Days
                            </li>
                            <li>
                                <span id='hours'></span>Hours
                            </li>
                            <li>
                                <span id='minutes'></span>Min
                            </li>
                            <li>
                                <span id='seconds'></span>Sec
                            </li>
                        </ul>
                    </div> */}
                    <div className='course-overview-head-buttons mt-l'>
                        {!(loading_course || loading_modules) ? (
                            <>
                                {course.enrolled === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                                course.enrolled === COURSE_ENROLLMENT_STATUS.EXPIRED ? (
                                    !isArrayEmpty(modules) && (
                                        <Button type='primary' className='mt'>
                                            <Link
                                                to={
                                                    '/courses/' +
                                                    course_slug +
                                                    '/' +
                                                    (course_slug === 'cpp'
                                                        ? modules[0].protopics[2].subtopics[0].slug
                                                        : modules[0].protopics[0].subtopics[0].slug) +
                                                    '/'
                                                }>
                                                Go to course
                                            </Link>
                                        </Button>
                                    )
                                ) : (
                                    <>
                                        {!isArrayEmpty(modules) && (
                                            <Button type='default' className='mt mr'>
                                                <Link
                                                    to={
                                                        '/courses/' +
                                                        course_slug +
                                                        '/' +
                                                        (course_slug === 'cpp'
                                                            ? modules[0].protopics[2].subtopics[0].slug
                                                            : modules[0].protopics[0].subtopics[0].slug) +
                                                        '/'
                                                    }>
                                                    Start for Free
                                                </Link>
                                            </Button>
                                        )}
                                        <Button type='primary' className='mt'>
                                            <Link to={'/checkout/' + course_slug + '/'}>Enroll Now</Link>
                                        </Button>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className='mt'>{getInputSkeleton('large', 200, 55)}</div>
                        )}
                    </div>
                </div>
                <div className='course-overview-head-info-wrapper flex-container flex-wrap place-center mt-xxxl'>
                    {!loading_course && getCourseOverview()}
                </div>

                {/* Features */}
                <div className='course-overview-features-wrapper place-center center-align mt-xxxxl'>
                    <h2 className='course-overview-features-heading'>This Course Provides</h2>
                    <div className='flex-container flex-wrap'>
                        {loading_course ? getFeatureSkeleton() : !isArrayEmpty(course.features) && getFeatures()}
                    </div>
                </div>

                {/* Curriculum */}
                <div className='course-overview-curriculum-wrapper place-center center-align mt-xxxxl'>
                    <h2 className='course-overview-features-heading'>Course Curriculum</h2>
                    {loading_modules
                        ? getParagraphSkeleton()
                        : !isArrayEmpty(modules) && (
                              <Collapse
                                  className='course-overview-curriculum default-card-neu left-align mt-l'
                                  bordered={false}>
                                  {getModule()}
                              </Collapse>
                          )}
                </div>

                {/* FAQs */}
                <div className='course-overview-faq-wrapper place-center center-align mt-xxxxl'>
                    <h2 className='course-overview-features-heading'>Frequently Asked Questions</h2>
                    {loading_course
                        ? getParagraphSkeleton()
                        : !isArrayEmpty(course.faqs) && (
                              <Collapse className='course-overview-faq left-align mt-l' accordion>
                                  {getFaq()}
                              </Collapse>
                          )}
                </div>
                <div className='home-internship-tnc right-align font-weight-500 pb-l mt-xxl mr-xxl'>
                    * <Link to='/tnc'>TnC</Link>
                </div>
            </ErrorHandlerWrapper>
        </>
    );
};

export default CourseOverview;
