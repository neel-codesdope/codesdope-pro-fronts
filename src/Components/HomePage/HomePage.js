import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Skeleton } from 'antd';
import { Button } from 'antd';
import { useStore } from '../../Stores/SetStore';
import { getAPI, interpolate } from '../../Utils/ApiCalls';
import { isArrayEmpty, getParameterFromUrl, getUserProfileId } from '../../Utils/HelperFunctions';
import { FETCH_USER_COURSES } from '../../Constants/Urls';
import { testimonials } from '../../Constants/Values';
import CoursesList from './CoursesList/CoursesList';
import Editor from './Editor/Editor';
import ScrollToAnchor from '../../HOC/ScrollToAnchor';

var testimonial_settings = {
    dots: false,
    autoplay: true,
    infinite: true,
    speed: 4000,
    autoplaySpeed: 0,
    slidesToShow: 3,
    slidesToScroll: 1,
    draggable: true,
    centerMode: true,
    responsive: [
        {
            breakpoint: 1600,
            settings: {
                slidesToShow: 3
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1
            }
        }
    ]
};

const HomePage = props => {
    const [AppStore, dispatch] = useStore([]);
    const [enrolled_courses, setEnrolledCourses] = useState([]);
    const [loading_enrolled_courses, setLoadingEnrolledCourses] = useState(false);

    // open login modal if url includes redirect
    useEffect(() => {
        let redirect = getParameterFromUrl('redirect');
        if (!!redirect) {
            dispatch('openLoginModal');
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (AppStore.is_user_logged_in) {
            setLoadingEnrolledCourses(true);
            getAPI(interpolate(FETCH_USER_COURSES, [getUserProfileId()]))
                .then(data => {
                    if (isMounted) {
                        setEnrolledCourses(data);
                        setLoadingEnrolledCourses(false);
                    }
                })
                .catch(err => {
                    if (isMounted) {
                        setLoadingEnrolledCourses(false);
                    }
                });
        } else {
            setEnrolledCourses([]);
        }
        return () => {
            isMounted = false;
        };
    }, [AppStore.is_user_logged_in]);

    const getCourseSkeleton = () => (
        <>
            <div className='home-course-wrapper default-card-neu pt-l pl-l pr-l pb-l'>
                <div className='center-align'>
                    <Skeleton.Image style={{ marginBottom: 20 }} />
                </div>
                <Skeleton active />
                <Skeleton.Button className='ml mr' size='default' shape='default' />
                <Skeleton.Button className='ml mr' size='default' shape='default' />
                <Skeleton.Button className='ml mr' size='default' shape='default' />
            </div>
            <div className='home-course-wrapper default-card-neu pt-l pl-l pr-l pb-l'>
                <div className='center-align'>
                    <Skeleton.Image style={{ marginBottom: 20 }} />
                </div>
                <Skeleton active />
                <Skeleton.Button className='ml mr' size='default' shape='default' />
                <Skeleton.Button className='ml mr' size='default' shape='default' />
                <Skeleton.Button className='ml mr' size='default' shape='default' />
            </div>
        </>
    );

    return (
        <>
            <ScrollToAnchor />
            {/* Heading */}
            <div className='home-head-content-wrapper flex-container flex-row justify-center pr-xl pl-xl' id='abc'>
                <div className='home-head-tag-wrapper flex-container flex-column justify-center pr-l'>
                    <h1 className='main-heading no-mb'>
                        <span className='highlight-primary pr-l pl-l pt-s pb-s'>Pro</span> Courses from CodesDope
                    </h1>
                    <p className='home-heading-subtitle mt-l'>
                        Learn with the best and simplest tutorials with examples.
                        <br />
                        Learn with your own pace.
                    </p>
                    {!AppStore.is_user_logged_in ? (
                        <Button
                            type='primary'
                            className='home-button home-head-button home-button-neu flex-container align-center justify-center mt-xl'
                            onClick={() => dispatch('openSignupModal')}>
                            Join for Free
                            <i className='fa fa-long-arrow-right home-button-arrow ml'></i>
                        </Button>
                    ) : (
                        <Button
                            type='primary'
                            className='home-button home-head-button home-button-neu flex-container align-center justify-center mt-xl'>
                            <Link to={'/profile/enrolled-courses'} className='no-text-decoration'>
                                Go to Enrolled Courses
                            </Link>
                            <i className='fa fa-long-arrow-right home-button-arrow ml'></i>
                        </Button>
                    )}
                </div>
                <Editor />
            </div>

            {/* Courses */}
            <div className='dark-bg-wrapper pt-xxl pb-xxxl' id='paid-courses'>
                <h2 className='home-heading center-align'>Courses</h2>
                <div className='home-courses-inner-wrapper flex-container flex-row justify-center pr-l pl-l mt-xxl'>
                    {isArrayEmpty(AppStore.courses) || loading_enrolled_courses ? (
                        getCourseSkeleton()
                    ) : (
                        <CoursesList courses={AppStore.courses} enrolled_courses={enrolled_courses} />
                    )}
                </div>
            </div>

            {/* Why Us */}
            <div className='why-us-wrapper center-align pt-xxxl pb-xxxl'>
                <div className='why-us-inner-wrapper flex-container flex-wrap place-center'>
                    <div className='why-us-component why-us-simplicity pt-l pb-l'>
                        <div className='center-align'>
                            <div className='why-us-img-circle'></div>
                            <div className='why-us-img'>
                                <i className='fa fa-graduation-cap' aria-hidden='true'></i>
                            </div>
                        </div>
                        <h3 className='mt'>Simplicity</h3>
                        <p className='mt pr-l pl-l'>
                            Every concept is explained in such a simple way that even an absoulte beginner can master
                            programming.
                        </p>
                    </div>
                    <div className='why-us-component why-us-quality pt-l pb-l'>
                        <div className='center-align'>
                            <div className='why-us-img-circle'></div>
                            <div className='why-us-img'>
                                <i className='fa fa-star-o' aria-hidden='true'></i>
                            </div>
                        </div>
                        <h3 className='mt'>Quality</h3>
                        <p className='mt pr-l pl-l'>
                            Simplicity meets quality. We are recommended by professors around the globe.
                        </p>
                    </div>
                    <div className='why-us-component why-us-doubt pt-l pb-l'>
                        <div className='center-align'>
                            <div className='why-us-img-circle'></div>
                            <div className='why-us-img'>
                                <i className='fa fa-comments-o' aria-hidden='true'></i>
                            </div>
                        </div>
                        <h3 className='mt'>Doubts</h3>
                        <p className='mt pr-l pl-l'>
                            Your doubts are our responsibility. We are always there for you via multiple channels -
                            discussion forum, mail and chat too.
                        </p>
                    </div>
                    <div className='why-us-component why-us-faculty pt-l pb-l'>
                        <div className='center-align'>
                            <div className='why-us-img-circle'></div>
                            <div className='why-us-img'>
                                <i className='fa fa-black-tie' aria-hidden='true'></i>
                            </div>
                        </div>
                        <h3 className='mt'>Faculty</h3>
                        <p className='mt pr-l pl-l'>All courses are created by alumni of IITs, Amazon, Google, etc.</p>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className='dark-bg-wrapper center-align pt-xxl pb-xxxl'>
                <h2 className='home-heading'>Testimonials</h2>
                <div className='center-align mt-xl'>
                    <Carousel className='testimonial-component-wrapper' {...testimonial_settings}>
                        {testimonials.map((testimonial, index) => (
                            <div className={'testimonial-component' + ((index % 4) + 1) + ' pt-xl pb-xl'}>
                                <div className='testimonial position-relative'>
                                    <div className='testimonial-quote position-absolute'>
                                        <i className='fa fa-quote-right' />
                                    </div>
                                    <div className='pl-xl pr-xl pt-xxxl pb-xl'>
                                        <p className='testimonial-text'>{testimonial.testimonial}</p>
                                    </div>
                                    <div className='testimonial-footer pr-xl pl-xl pt-l pb-l left-align'>
                                        <div className='testimonial-author'>
                                            <span>{testimonial.author}</span>
                                        </div>
                                        <div className='testimonial-author-info'>
                                            <span>{testimonial.author_info}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>

            {/* Features */}
            <div
                className='center-align pt-xxl pb-xxl'
                style={{
                    backgroundImage: `url("/img/benefitsbg.png")`,
                    backgroundPosition: 'center top',
                    backgroundSize: '120%',
                    backgroundRepeat: 'no-repeat'
                }}>
                <h2 className='home-heading'>What We Provide</h2>
                <div className='home-benifits-content-wrapper flex-container left-align pb-xxl mt-xl ml-xl mr-xl'>
                    <div className='benifit-wrapper colored-small-shadow-neu center-align mt'>
                        <div className='benifit-img-wrapper1 center-align pt-l pb-l'>
                            <img src='/img/benefit1.png' />
                        </div>
                        <div className='benifit mt mb-l pl-xl pr-xl'>
                            <div className='benifit-detail-wrapper'>
                                <h3 className='benifit-title'>
                                    <span className='span-underline'>Easy Courses</span> from Highly Educated People
                                </h3>
                                <p className='benifit-detail no-mb'>Learn from IIT alumni, Ex-Amazon and Ex-Google</p>
                            </div>
                        </div>
                    </div>

                    <div className='benifit-wrapper colored-small-shadow-neu center-align mt'>
                        <div className='benifit-img-wrapper1 center-align pt-l pb-l'>
                            <img src='/img/benefit2.png' />
                        </div>
                        <div className='benifit mt mb-l pl-l pr-l'>
                            <div className='benifit-detail-wrapper'>
                                <h3 className='benifit-title'>
                                    <span className='span-underline'>Practice</span> Questions and{' '}
                                    <span className='span-underline'>Summary</span>
                                </h3>
                                <p className='benifit-detail no-mb'>
                                    Practice is the key to programming. That's why we have a lot of practice question
                                    for every topic along with summary for revision
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='benifit-wrapper colored-small-shadow-neu center-align mt'>
                        <div className='benifit-img-wrapper1 center-align pt-l pb-l'>
                            <img src='/img/benefit3.png' />
                        </div>
                        <div className='benifit mt mb-l pl-l pr-l'>
                            <div className='benifit-detail-wrapper'>
                                <h3 className='benifit-title'>
                                    Get Your <span className='span-underline'>Doubts Cleared</span> Anytime
                                </h3>
                                <p className='benifit-detail no-mb'>
                                    You doubt, our responsibility. You can ask doubt via multiple channels - discussion
                                    forum, email and chat
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='benifit-wrapper colored-small-shadow-neu center-align mt'>
                        <div className='benifit-img-wrapper1 center-align pt-l pb-l'>
                            <img src='/img/benefit4.png' />
                        </div>
                        <div className='benifit mt mb-l pl-l pr-l'>
                            <div className='benifit-detail-wrapper'>
                                <h3 className='benifit-title'>
                                    <span className='span-underline'>Certificate</span> of Completion
                                </h3>
                                <p className='benifit-detail no-mb'>Earn certificate after course completion</p>
                            </div>
                        </div>
                    </div>

                    <div className='benifit-wrapper colored-small-shadow-neu center-align mt'>
                        <div className='benifit-img-wrapper1 center-align pt-l pb-l'>
                            <img src='/img/benefit5.png' />
                        </div>
                        <div className='benifit mt mb-l pl-l pr-l'>
                            <div className='benifit-detail-wrapper'>
                                <h3 className='benifit-title'>
                                    <span className='span-underline'>Internship</span> at CodesDope
                                </h3>
                                <p className='benifit-detail no-mb'>
                                    Get assured internship opertunity at CodesDope after completion of the course{' '}
                                    <span className='font-weight-500 primary-color'>*</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='benifit-wrapper colored-small-shadow-neu center-align mt'>
                        <div className='benifit-img-wrapper1 center-align pt-l pb-l'>
                            <img src='/img/benefit6.png' />
                        </div>
                        <div className='benifit mt mb-l pl-l pr-l'>
                            <div className='benifit-detail-wrapper'>
                                <h3 className='benifit-title'>
                                    Lots of <span className='span-underline'>In-Course Projects/Exercises</span>
                                </h3>
                                <p className='benifit-detail no-mb'>
                                    Learn from projects and exercises present in every course
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='home-internship-tnc right-align font-weight-500 pb-l mr-xxxl'>
                    * <Link to='/tnc'>TnC</Link>
                </div>
            </div>

            {/* Doubt Solving */}
            <div
                className='doubt-solving-wrapper'
                style={{
                    backgroundImage: 'url("/img/doubt_background.png")',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: 'black'
                }}>
                <div className='doubt-solving-inner-wrapper pt-l pb-l'>
                    <div className='center-align pl-l pr-l'>
                        <h2>Never Fret About Getting Doubts Solved!</h2>
                        <p className='mt'>We got your back. Whenever stuck, we are only one message away.</p>
                    </div>
                </div>
            </div>

            {/* Steps */}
            <div className='step-wrapper flex-container flex-row justify-center pl-xxxl pr-xxxl mt-xxxxl'>
                <div className='step default-card-neu mt-xl'>
                    <div className='step-index flex-container small-shadow-float justify-center align-center'>1</div>
                    <div>
                        <img src='/img/step1.png' alt='Step 1' />
                    </div>
                    <p className='step-detail mt-l'>Learn at your own pace from Best Teachers</p>
                </div>
                <div className='step default-card-neu mt-xl'>
                    <div className='step-index flex-container justify-center align-center'>2</div>
                    <div>
                        <img src='/img/step2.png' alt='Step 2' />
                    </div>
                    <p className='step-detail mt-l'>Practice Topicwise Questions</p>
                </div>
                <div className='step default-card-neu mt-xl'>
                    <div className='step-index flex-container justify-center align-center'>3</div>
                    <div>
                        <img src='/img/step3.png' alt='Step 3' />
                    </div>
                    <p className='step-detail mt-l'>Get your doubts solved by our Experts and Student Community</p>
                </div>
            </div>

            {/* Join Now */}
            <div className='home-tail-content-wrapper mt-xxxxl pt-xxxl pb-xxxl pl-l pr-l'>
                <div className='center-align'>
                    <h2>Start your Coding Journey Today!</h2>
                    <p className='mt'>
                        No coding experience required. No significant Mathematics knowledge required.
                        <br />
                        Coding is not a rocket science!
                    </p>
                    {!AppStore.is_user_logged_in ? (
                        <Button
                            type='primary'
                            className='home-button home-tail-button mt-l'
                            onClick={() => dispatch('openSignupModal')}>
                            Join for Free
                        </Button>
                    ) : (
                        <Button type='primary' className='home-button home-tail-button mt-l'>
                            <Link to={'/profile/enrolled-courses'} className='no-text-decoration'>
                                Go to Enrolled Courses
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

export default HomePage;
