import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { isArrayEmpty } from '../../Utils/HelperFunctions';
import { useStore } from '../../Stores/SetStore';
import Logo from '../UI Elements/Logo/Logo';

const HeaderContent = props => {
    const [AppStore, _] = useStore();

    const getCourse = () => {
        const courses_menu_list = AppStore.courses.map(course => (
            <div key={course.id}>
                <Link to={'/courses/' + course.slug}>{course.name} Tutorial</Link>
            </div>
        ));
        return courses_menu_list;
    };

    const getCourses = () => <>{isArrayEmpty(AppStore.courses) ? getCourseSkeleton() : getCourse()}</>;

    const getCourseSkeleton = () => (
        <>
            <div className='flex-container flex-column'>
                <Skeleton.Input
                    className='place-center ml mr mt-s mb-s'
                    style={{ width: '70%', minWidth: 50 }}
                    size='small'
                    active
                />
                <Skeleton.Input
                    className='place-center ml mr mt-s mb-s'
                    style={{ width: '70%', minWidth: 50 }}
                    size='small'
                    active
                />
            </div>
        </>
    );

    return (
        <>
            <div className='footer-wrapper mt-xxxl'>
                <div className='footer-subwrapper flex-container flex-row place-center pr-xxxxl pl-xxxxl pt-xxxl pb-xxxl'>
                    <Logo className='footer-column-div' height={50} />
                    <div className='footer-column-div'>
                        <h4 className='footer-column-header'>TUTORIALS</h4>
                        <div>{getCourses()}</div>
                    </div>
                    <div className='footer-column-div footer-right-div'>
                        <h4 className='footer-column-header'>PRODUCTS</h4>
                        <div>
                            <a href='https://www.codesdope.com/course/' target='_blank'>
                                Free Courses
                            </a>
                        </div>
                        <div>
                            <Link to='/#paid-courses'>Paid Courses</Link>
                        </div>
                        <div>
                            <a href='https://www.codesdope.com/blog/' target='_blank'>
                                Blog
                            </a>
                        </div>
                    </div>
                    <div className='footer-center-div footer-column-div'>
                        <h4 className='footer-column-header'>COMPANY</h4>
                        <div>
                            <Link to='/about'>About</Link>
                        </div>
                        <div>
                            <Link to='/tnc'>Terms and Conditions</Link>
                        </div>
                        <div>
                            <Link to='/privacy-policy'>Privacy Policy</Link>
                        </div>
                    </div>
                    <div className='footer-column-div'>
                        <h4 className='footer-column-header'>FOLLOW US</h4>
                        <div>
                            <a
                                href='https://www.facebook.com/codesdope'
                                target='_blank'
                                title='CodesDope Facebook'
                                className='footer-icons'>
                                <i className='fa fa-facebook-f'></i>
                            </a>
                            <a
                                href='https://twitter.com/CodesDope'
                                target='_blank'
                                title='CodesDope Twitter'
                                className='footer-icons'>
                                <i className='fa fa-twitter'></i>
                            </a>
                            <a
                                href='https://www.linkedin.com/company/codesdope'
                                target='_blank'
                                title='CodesDope LinkedIn'
                                className='footer-icons'>
                                <i className='fa fa-linkedin'></i>
                            </a>
                            <a
                                href='https://www.instagram.com/codesdope/'
                                target='_blank'
                                title='CodesDope Instagram'
                                className='footer-icons'>
                                <i className='fa fa-instagram'></i>
                            </a>
                        </div>
                        <h4 className='footer-column-header mt'>KEEP IN TOUCH</h4>
                        <div>
                            <a
                                href='mailto:help@codesdope.com'
                                target='_blank'
                                title='Mail to help@codesdope.com'
                                className='footer-icons'>
                                <MailOutlined />
                                <span className='ml'>help@codesdope.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className='footer-bottom-tag pt pb'>&copy; CodesDope Pvt. Ltd. | All rights reserved.</div>
        </>
    );
};

export default withRouter(HeaderContent);
