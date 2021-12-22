import React, { useState, useEffect } from 'react';
import { Button, Drawer, Menu, Dropdown, message, Skeleton } from 'antd';
import { MenuOutlined, CaretDownOutlined } from '@ant-design/icons';
import { withRouter, Link } from 'react-router-dom';
import { useStore } from '../../Stores/SetStore';
import { postAPI } from '../../Utils/ApiCalls';
import { isArrayEmpty, getProfileAvatar, convertToHigherCurrency } from '../../Utils/HelperFunctions';
import { LOGOUT } from '../../Constants/Urls';
import { SOME_ERR, LOGGING_OUT } from '../../Constants/Messages';
import Login from './Login';
import Signup from './Signup';
import Notifications from './Notifications';
import Logo from '../UI Elements/Logo/Logo';
import LogoCodesdopePro from '../UI Elements/Logo/LogoCodesdopePro';
import { getAvatarSkeleton } from '../UI Elements/Skeleton/GeneralSkeleton';

const { SubMenu } = Menu;

const HeaderContent = props => {
    const [AppStore, dispatch] = useStore();
    const [prev_scroll_pos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState('');
    const [logo_type, setLogoType] = useState(0);

    const getMenuItem = () => {
        const courses_menu_list = AppStore.courses.map(course => (
            <Menu.Item key={course.id}>
                <Link to={'/courses/' + course.slug}>{course.name}</Link>
            </Menu.Item>
        ));
        return courses_menu_list;
    };

    const getMenu = () => <Menu>{isArrayEmpty(AppStore.courses) ? getMenuSkeleton() : getMenuItem()}</Menu>;

    const openLoginModal = () => {
        dispatch('openLoginModal');
    };

    const closeLoginModal = () => {
        dispatch('closeLoginModal');
    };

    const openSignupModal = () => {
        dispatch('openSignupModal');
    };

    const closeSignupModal = () => {
        dispatch('closeSignupModal');
    };

    const openSignUpFromLogin = () => {
        dispatch('closeLoginModal');
        dispatch('openSignupModal');
    };

    const openLoginFromSignUp = () => {
        dispatch('closeSignupModal');
        dispatch('openLoginModal');
    };

    const onLogout = () => {
        let hide = message.loading(LOGGING_OUT, 0);
        postAPI(LOGOUT)
            .then(data => {
                hide();
                dispatch('logoutUser');
            })
            .catch(err => {
                hide();
                message.error(SOME_ERR);
            });
    };

    const handleScroll = () => {
        const current_scroll_pos = window.pageYOffset;
        if (prev_scroll_pos < current_scroll_pos) {
            if (current_scroll_pos > 70) {
                setVisible('nav-invisible');
            } else {
                setVisible('');
            }
        } else {
            if (current_scroll_pos > 0) {
                setVisible('nav-visible');
            } else {
                setVisible('');
            }
        }
        if (prev_scroll_pos < current_scroll_pos) {
            setLogoType(0);
        } else {
            if (current_scroll_pos > 1) {
                setLogoType(1);
            } else {
                setLogoType(0);
            }
        }
        setPrevScrollPos(current_scroll_pos);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prev_scroll_pos, visible, handleScroll]);

    const handleCloseMenuClick = e => {
        dispatch('closeSideMenu');
    };

    const handleShowMenuClick = e => {
        dispatch('showSideMenu');
    };

    const getCredits = () => {
        if (AppStore.is_user_fetched) {
            if (AppStore.credits > 0) {
                return (
                    <span className='navbar-credits font-weight-500'>
                        {'- ' + convertToHigherCurrency(AppStore.credits)}
                    </span>
                );
            }
        }
    };

    let profileMenu = (
        <Menu onClick={handleCloseMenuClick}>
            <Menu.Item>
                <Link to='/profile'>Profile</Link>
            </Menu.Item>
            <Menu.Item>
                <Link to='/billing-history'>Billing History</Link>
            </Menu.Item>
            <Menu.Item>
                <Link to='/profile/rewards-referral-code'>Credits {getCredits()}</Link>
            </Menu.Item>
            <Menu.Item onClick={onLogout}>Logout</Menu.Item>
        </Menu>
    );

    const getNavbarComponents = () => {
        if (AppStore.is_user_logged_in) {
            return (
                <>
                    <Notifications handleCloseMenuClick={handleCloseMenuClick} />
                    <Dropdown overlay={profileMenu} placement='bottomRight' trigger={['click']} arrow>
                        <div className='cursor-pointer'>
                            {AppStore.is_user_fetched
                                ? getProfileAvatar(
                                      AppStore.user.user.first_name,
                                      AppStore.user.user.last_name,
                                      AppStore.user.user.username,
                                      AppStore.user.profile_pic
                                  )
                                : getAvatarSkeleton('circle', 35, 35)}
                            <CaretDownOutlined />
                        </div>
                    </Dropdown>
                </>
            );
        }
        return (
            <>
                <Button type='default' className='signin-button' onClick={openLoginModal}>
                    Sign In
                </Button>
                <Button type='primary' className='signup-button' onClick={openSignupModal}>
                    Sign Up
                </Button>
            </>
        );
    };

    const getLoggingInComponent = () => (
        <>
            <Login
                visible={AppStore.show_login_modal}
                onCancel={closeLoginModal}
                openSignUpFromLogin={openSignUpFromLogin}
            />
            <Signup
                visible={AppStore.show_signup_modal}
                onCancel={closeSignupModal}
                openLoginFromSignUp={openLoginFromSignUp}
            />
        </>
    );

    const getMenuSkeleton = () => (
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
            <div className={'nav-header pr-xl pl-xl ' + visible}>
                {/* laptops */}
                <div className='nav-content tab-hide flex-container flex-wrap align-center place-center'>
                    {logo_type === 0 ? (
                        <LogoCodesdopePro className='nav-brand' height={25} />
                    ) : (
                        <Logo className='nav-brand' height={50} />
                    )}
                    <div className='nav-menu flex-container align-center flex-wrap'>
                        <ul>
                            <li>
                                <Dropdown overlay={getMenu} placement='bottomCenter' arrow>
                                    <span className='cursor-pointer'>Courses</span>
                                </Dropdown>
                            </li>
                        </ul>
                        {getNavbarComponents()}
                        {getLoggingInComponent()}
                    </div>
                </div>
                {/* tabs and mobiles */}
                <div className='nav-content nav-content-tab laptop-hide flex-container flex-wrap align-center place-center'>
                    <button type='button' onClick={handleShowMenuClick}>
                        <MenuOutlined />
                    </button>
                    {logo_type === 0 ? (
                        <LogoCodesdopePro className='nav-brand-tab' height={20} />
                    ) : (
                        <Logo className='nav-brand-tab' height={35} />
                    )}
                </div>
            </div>
            {/* Side Menu */}
            <Drawer
                placement={'left'}
                closable={true}
                onClose={() => dispatch('closeSideMenu')}
                visible={AppStore.show_side_menu}
                width={'100%'}>
                <Logo className='drawer-logo flex-container flex-wrap justify-center align-center' height={35} />
                <Menu className='drawer-menu' onClick={handleCloseMenuClick} mode='inline'>
                    <SubMenu title='Courses'>{getMenu()}</SubMenu>
                </Menu>
                <div className='center-align mt'>
                    {getNavbarComponents()}
                    {getLoggingInComponent()}
                </div>
            </Drawer>
        </>
    );
};

export default withRouter(HeaderContent);
