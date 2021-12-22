import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button } from 'antd';
import { ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { isArrayEmpty, fetchModules, returnStoredModules, convertCurrency } from '../../../../Utils/HelperFunctions';
import { useStore } from '../../../../Stores/SetStore';
import CourseProgressCircular from '../../../UI Elements/CourseProgress/CourseProgressCircular';
import LanguageTag from '../../../UI Elements/LanguageTag/LanguageTag';

const Course = props => {
    const [AppStore, dispatch] = useStore([]);
    const [loading_modules, setLoadingModules] = useState(false);

    const redirectToCourse = (course_slug, modules) => {
        if (course_slug === 'cpp') {
            props.history.push('/courses/' + course_slug + '/' + modules[0].protopics[2].subtopics[0].slug + '/');
        } else {
            props.history.push('/courses/' + course_slug + '/' + modules[0].protopics[0].subtopics[0].slug + '/');
        }
    };

    const handleStartCourseClick = course_slug => {
        setLoadingModules(true);
        let { course_modules, _ } = returnStoredModules(AppStore.course_modules_list, course_slug);
        if (!isArrayEmpty(course_modules)) {
            setLoadingModules(false);
            redirectToCourse(course_slug, course_modules);
        } else {
            fetchModules(course_slug, AppStore.is_user_logged_in)
                .then(data => {
                    dispatch('setCourseModules', course_slug, data);
                    redirectToCourse(course_slug, data.result);
                    setLoadingModules(false);
                })
                .catch(err => {
                    setLoadingModules(false);
                });
        }
    };

    const isCourseEnrolled = course_slug => {
        let is_enrolled = false;
        if (!isArrayEmpty(props.enrolled_courses)) {
            props.enrolled_courses.forEach(function (enrolled_course) {
                if (enrolled_course.slug === course_slug) {
                    is_enrolled = true;
                }
            });
        }
        return is_enrolled;
    };

    return (
        <div className='home-course-wrapper default-card-neu position-relative' key={props.course.id}>
            <div className='course-card'>
                <div
                    className='home-course-card-img-wrapper'
                    style={{
                        backgroundImage: `url("${props.course.image}")`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}>
                    {isCourseEnrolled(props.course.slug) && (
                        <CourseProgressCircular
                            className='home-course-progress position-absolute'
                            course_slug={props.course.slug}
                        />
                    )}
                </div>
                <div className='home-course-card-content-wrapper pr-l pl-l'>
                    <h2 className='home-course-card-heading-wrapper center-align'>
                        <div className='home-course-card-heading wrap-width pt pb pl-xl pr-xl'>{props.course.name}</div>
                    </h2>
                    {props.course.course_details ? (
                        props.course.course_details['Hours of Video Content'] ? (
                            <div className='mt-l'>
                                <span className='home-course-card-subdetail-icon wrap-width'>
                                    <ClockCircleOutlined />
                                </span>
                                <span className='home-course-card-text'>
                                    <strong>{props.course.course_details['Hours of Video Content']} Hours</strong> of
                                    Video Content
                                </span>
                            </div>
                        ) : (
                            <div className='mt-l'></div>
                        )
                    ) : (
                        <div className='mt-l'></div>
                    )}
                    {props.course.certificate_of_completion && (
                        <div>
                            <span className='home-course-card-subdetail-icon wrap-width'>
                                <TrophyOutlined />
                            </span>
                            <span className='home-course-card-text'>Certificate of Completion</span>
                        </div>
                    )}
                    {!!props.course.language && (
                        <div>
                            <span className='home-course-card-subdetail-icon wrap-width'>
                                <i className='fa fa-language'></i>
                            </span>
                            <span className='home-course-card-text'>
                                {props.course.language.map(language_item => (
                                    <LanguageTag style={{ padding: '1px 5px' }} key={language_item.id}>
                                        {language_item.name}
                                    </LanguageTag>
                                ))}{' '}
                                {props.course.language.length > 1 ? '(Multiple Languages)' : ''}
                            </span>
                        </div>
                    )}

                    {!isCourseEnrolled(props.course.slug) && (
                        <div className='center-align'>
                            <div
                                className='home-course-card-price-wrapper wrap-width mt'
                                style={{ marginBottom: '-10px' }}>
                                <div className='flex-container align-center justify-center'>
                                    <span>
                                        <span className='home-course-card-price-currency primary-color'>
                                            <i className='fa fa-inr'></i>
                                        </span>
                                        <span className='ml-s'>
                                            <span className='home-course-card-price-money primary-color'>
                                                {convertCurrency(props.course.total_amount)}
                                            </span>
                                        </span>
                                    </span>
                                    <span>
                                        {!!props.course.discount && (
                                            <span className='home-course-card-original-price ml-s pl'>
                                                <i className='fa fa-inr'></i>
                                                <span>{convertCurrency(props.course.course_fee)}</span>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div
                        className={
                            'flex-container flex-row mob-column mt-l ' +
                            (isCourseEnrolled(props.course.slug) ? 'justify-center' : 'justify-space-between')
                        }>
                        {isCourseEnrolled(props.course.slug) ? (
                            <>
                                <Button className='course-card-button home-card-course-content-button mr'>
                                    <Link to={'/courses/' + props.course.slug}>Course Content</Link>
                                </Button>
                                <Button
                                    className='course-card-button home-card-course-buy-button'
                                    loading={loading_modules}
                                    onClick={() => handleStartCourseClick(props.course.slug)}>
                                    Go to course
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    className='course-card-button home-card-course-free-button mr'
                                    loading={loading_modules}
                                    onClick={() => handleStartCourseClick(props.course.slug)}>
                                    Start For Free
                                </Button>
                                <Button className='course-card-button home-card-course-content-button mr'>
                                    <Link to={'/courses/' + props.course.slug}>Course Content</Link>
                                </Button>
                                <Button className='course-card-button home-card-course-buy-button'>
                                    <Link to={'/checkout/' + props.course.slug}>Enroll Now</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(Course);
