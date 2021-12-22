import { has } from 'markdown-it/lib/common/utils';
import { initStore } from './SetStore';

const configureUserStore = () => {
    const actions = {
        /**
         * Set profile_complete to true/false
         * @param {String} token Auth token of user
         * @param {Object} user_id User id
         */
        changeProfileCompletion: (state, token, user_id, user_profile_id) => {
            localStorage.setItem('token', token);
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('user_profile_id', user_profile_id);
            return { user_id: user_id, user_token: token, user_profile_id: user_profile_id, is_user_logged_in: true };
        },
        logoutUser: state => {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_profile_id');
            return {
                is_user_logged_in: false,
                user_token: null,
                user_id: null,
                user_profile_id: null,
                is_user_fetched: false,
                user: null
            };
        },
        setUserDetail: (state, user) => ({ user: user, is_user_fetched: true }),
        updateProfilePicUrl: (state, url, user) => {
            const updated_user = { ...user, profile_pic: url };
            return { user: updated_user };
        },
        setUserCredits: (state, credits) => ({ credits: credits }),
        setUserNotifications: (state, notification) => ({ user_notifications: notification || {} }),
        setUserSeenNotifications: (state, has_seen_notifications) => ({ has_seen_notifications })
    };

    initStore(actions, {
        is_user_logged_in: !!localStorage.getItem('token'),
        user_token: localStorage.getItem('token'),
        user_id: localStorage.getItem('user_id'),
        user_profile_id: localStorage.getItem('user_profile_id'),
        is_user_fetched: false,
        user: null,
        credits: null,
        user_notifications: {},
        has_seen_notifications: true
    });
};

export default configureUserStore;
