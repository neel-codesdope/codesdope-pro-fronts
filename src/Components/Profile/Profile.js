import React, { useState, useEffect } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
    UserOutlined,
    UnlockOutlined,
    QuestionCircleOutlined,
    MessageOutlined,
    MailOutlined,
    WalletOutlined
} from '@ant-design/icons';
import { PROFILE_MENU } from '../../Constants/Values';
import { useStore } from '../../Stores/SetStore';
import ErrorHandlerWrapper from '../../HOC/ErrorHandlerWrapper';
import BasicDetails from './BasicDetails/BasicDetails';
import ChangePassword from './ChangePassword/ChangePassword';
import ChangeEmail from './ChangeEmail/ChangeEmail';
import EnrolledCourses from './EnrolledCourses/EnrolledCourses';
import QuestionsAsked from './QuestionsAsked/QuestionsAsked';
import QuestionsFollowed from './QuestionsFollowed/QuestionsFollowed';
import QuestionsAnswered from './QuestionsAnswered/QuestionsAnswered';
import RewardsReferralCode from './RewardsReferralCode/RewardsReferralCode';
import { getUserDisplayName } from '../../Utils/HelperFunctions';
import { Helmet } from 'react-helmet';

const Profile = props => {
    const [AppStore, _] = useStore();
    const [selected_key_tab, setSelectedKeyTab] = useState();
    const [error, setError] = useState();

    const setStatesFromUrl = () => {
        if (Object.keys(props.match.params).length === 1) {
            if (
                [
                    PROFILE_MENU.BASIC_DETAILS,
                    PROFILE_MENU.CHANGE_PASSWORD,
                    PROFILE_MENU.CHANGE_EMAIL,
                    PROFILE_MENU.ENROLLED_COURSES,
                    PROFILE_MENU.QUESTIONS_ASKED,
                    PROFILE_MENU.QUESTIONS_FOLLOWED,
                    PROFILE_MENU.QUESTIONS_ANSWERED,
                    PROFILE_MENU.REWARDS_AND_REFERRAL_CODE
                ].includes(props.match.params['menu'])
            ) {
                setSelectedKeyTab(props.match.params['menu']);
            } else if (!error) {
                setError(404);
            }
        } else {
            setSelectedKeyTab('basic-details');
        }
    };

    if (!selected_key_tab) {
        setStatesFromUrl();
    }

    useEffect(() => {
        setStatesFromUrl();
    }, [props.match.params['menu']]);

    // Change states on url change from back/forward browser button press
    useEffect(() => {
        window.onpopstate = e => {
            setStatesFromUrl();
        };
    }, [window.onpopstate, props.match.params['menu']]);

    const handleTabClick = e => {
        setSelectedKeyTab(e.key);
    };

    const getProfileMenu = () => {
        return (
            <Menu
                className='profile-menu default-card-neu'
                defaultSelectedKeys={[selected_key_tab]}
                selectedKeys={[selected_key_tab]}
                mode='inline'
                onClick={handleTabClick}>
                <Menu.Item key={PROFILE_MENU.BASIC_DETAILS} icon={<UserOutlined />}>
                    <Link to='/profile'>Basic Details</Link>
                </Menu.Item>
                {AppStore.is_user_fetched && AppStore.user.has_set_password && (
                    <Menu.Item key={PROFILE_MENU.CHANGE_PASSWORD} icon={<UnlockOutlined />}>
                        <Link to='/profile/change-password'>Change Password</Link>
                    </Menu.Item>
                )}
                <Menu.Item key={PROFILE_MENU.CHANGE_EMAIL} icon={<MailOutlined />}>
                    <Link to='/profile/change-email'>Change Email</Link>
                </Menu.Item>
                <Menu.Item
                    key={PROFILE_MENU.ENROLLED_COURSES}
                    icon={
                        <span>
                            <i className='fa fa-book'></i>
                        </span>
                    }>
                    <Link to='/profile/enrolled-courses'>Enrolled Courses</Link>
                </Menu.Item>
                <Menu.Item key={PROFILE_MENU.QUESTIONS_ASKED} icon={<QuestionCircleOutlined />}>
                    <Link to='/profile/questions-asked'>Questions Asked</Link>
                </Menu.Item>
                <Menu.Item
                    key={PROFILE_MENU.QUESTIONS_FOLLOWED}
                    icon={
                        <span>
                            <i className='fa fa-rss'></i>
                        </span>
                    }>
                    <Link to='/profile/questions-followed'>Questions Followed</Link>
                </Menu.Item>
                <Menu.Item key={PROFILE_MENU.QUESTIONS_ANSWERED} icon={<MessageOutlined />}>
                    <Link to='/profile/questions-answered'>Questions Answered</Link>
                </Menu.Item>
                <Menu.Item key={PROFILE_MENU.REWARDS_AND_REFERRAL_CODE} icon={<WalletOutlined />}>
                    <Link to='/profile/rewards-referral-code'>Rewards & Referral Code</Link>
                </Menu.Item>
            </Menu>
        );
    };

    return (
        <ErrorHandlerWrapper error={error}>
            {AppStore.is_user_fetched ? (
                <Helmet>
                    <title>{`${getUserDisplayName(
                        AppStore.user.user.first_name,
                        AppStore.user.user.last_name,
                        AppStore.user.user.username
                    )} | CodesDope`}</title>
                    <meta
                        name='description'
                        content={`Profile of ${getUserDisplayName(
                            AppStore.user.user.first_name,
                            AppStore.user.user.last_name,
                            AppStore.user.user.username
                        )} for CodesDope Pro`}
                    />
                </Helmet>
            ) : (
                <></>
            )}
            <div className='profile-wrapper flex-container flex-wrap justify-center place-center mt-xxl'>
                <div className='profile-menu-wrapper pr pl'>{getProfileMenu()}</div>
                <div className='profile-forms-wrapper pr-l pl-l'>
                    <Switch>
                        <Route exact path='/profile' render={props => <BasicDetails {...props} />} />
                        <Route exact path='/profile/change-password' render={props => <ChangePassword {...props} />} />
                        <Route exact path='/profile/change-email' render={props => <ChangeEmail {...props} />} />
                        <Route
                            exact
                            path='/profile/enrolled-courses'
                            render={props => <EnrolledCourses {...props} />}
                        />
                        <Route exact path='/profile/questions-asked' render={props => <QuestionsAsked {...props} />} />
                        <Route
                            exact
                            path='/profile/questions-followed'
                            render={props => <QuestionsFollowed {...props} />}
                        />
                        <Route
                            exact
                            path='/profile/questions-answered'
                            render={props => <QuestionsAnswered {...props} />}
                        />
                        <Route
                            exact
                            path='/profile/rewards-referral-code'
                            render={props => <RewardsReferralCode {...props} />}
                        />
                    </Switch>
                </div>
            </div>
        </ErrorHandlerWrapper>
    );
};

export default Profile;
