import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { PlayCircleFilled } from '@ant-design/icons';

const About = props => {
    return (
        <>
            <Helmet>
                <title>About Us</title>
                <meta name='description' content='About CodesDope Pro' />
            </Helmet>
            <div className='pt-l pb-l'>
                <div className='our-mission-wrapper pt-l pb-l'>
                    <h1>Our Mission</h1>
                    <p className='pt-xl pb-xl mt-xl'>
                        Our mission is to make learning so simple that even those who have absolutely no background in
                        coding can learn it in a reasonable time-period.
                    </p>
                </div>
                <div className='about-steps-wrapper flex-container flex-wrap justify-center place-center pl-xl pr-xl'>
                    <div className='about-steps mt-l'>
                        <img src='/img/about1.png' />
                        <h3 className='mt'>Start from Scratch</h3>
                        <p>
                            We have designed our courses in such a way that you don't need any pre-requisite knowledge
                            whatsoever to take them. We start from the very basics of coding and go on steadily so that
                            any and everybody can keep pace with their course.
                        </p>
                    </div>
                    <div className='about-steps mt-l'>
                        <img src='/img/about2.png' />
                        <h3 className='mt'>Become a Pro</h3>
                        <p>
                            The course material has been created by well-educated and experienced mentors who you can
                            easily relate to and trust. There are lots of practice questions at the end of each topic
                            and a forum dedicated especially to clearing any doubts you have while completing the
                            courses.
                        </p>
                    </div>
                    <div className='about-steps mt-l'>
                        <img src='/img/about3.png' />
                        <h3 className='mt'>Get Assured Internship</h3>
                        <p>
                            Kick start your career with us by taking an internship. We provide a wide range of
                            internships for those who have completed our course. This would help you gain industrial
                            experience which will be helpful in your career.<Link to='/tnc'>*</Link>
                        </p>
                    </div>
                </div>
                <div className='mt-xxxxl pb-l'>
                    <h2 className='about-heading center-align'>What We Provide</h2>
                    <div className='about-features-wrapper flex-container left-align pb-xxl mt-xl ml-xl mr-xl'>
                        <div className='about-feature-wrapper colored-small-shadow-neu center-align mt'>
                            <div className='center-align mt-l'>
                                <PlayCircleFilled className='about-feature-icon' />
                            </div>
                            <div className='mt mb-l pl-xl pr-xl'>
                                <div className='about-feature-detail-wrapper'>
                                    <h3 className='about-feature-title'>Courses from Highly Educated People</h3>
                                </div>
                            </div>
                        </div>
                        <div className='about-feature-wrapper colored-small-shadow-neu center-align mt'>
                            <div className='center-align mt-l'>
                                <i className='fa fa-pencil-square-o about-feature-icon'></i>
                            </div>
                            <div className='mt mb-l pl-xl pr-xl'>
                                <div className='about-feature-detail-wrapper'>
                                    <h3 className='about-feature-title'>Practice Questions and Summary</h3>
                                </div>
                            </div>
                        </div>
                        <div className='about-feature-wrapper colored-small-shadow-neu center-align mt'>
                            <div className='center-align mt-l'>
                                <i className='fa fa-comments about-feature-icon'></i>
                            </div>
                            <div className='mt mb-l pl-xl pr-xl'>
                                <div className='about-feature-detail-wrapper'>
                                    <h3 className='about-feature-title'>Doubt Assistance</h3>
                                </div>
                            </div>
                        </div>
                        <div className='about-feature-wrapper colored-small-shadow-neu center-align mt'>
                            <div className='center-align mt-l'>
                                <i className='fa fa-certificate about-feature-icon'></i>
                            </div>
                            <div className='mt mb-l pl-xl pr-xl'>
                                <div className='about-feature-detail-wrapper'>
                                    <h3 className='about-feature-title'>Certificate of Completion</h3>
                                </div>
                            </div>
                        </div>
                        <div className='about-feature-wrapper colored-small-shadow-neu center-align mt'>
                            <div className='center-align mt-l'>
                                <i className='fa fa-graduation-cap about-feature-icon'></i>
                            </div>
                            <div className='mt mb-l pl-xl pr-xl'>
                                <div className='about-feature-detail-wrapper'>
                                    <h3 className='about-feature-title'>Assured Internship at CodesDope</h3>
                                </div>
                            </div>
                        </div>
                        <div className='about-feature-wrapper colored-small-shadow-neu center-align mt'>
                            <div className='center-align mt-l'>
                                <i className='fa fa-cogs about-feature-icon'></i>
                            </div>
                            <div className='mt mb-l pl-xl pr-xl'>
                                <div className='about-feature-detail-wrapper'>
                                    <h3 className='about-feature-title'>In-Course Projects/Exercises</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
