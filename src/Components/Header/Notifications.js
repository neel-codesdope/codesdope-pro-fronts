import React, { useEffect, useState } from 'react';
import { Menu, Dropdown, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useStore } from '../../Stores/SetStore';
import { postAPI, interpolate } from '../../Utils/ApiCalls';
import { getUserProfileId, reverseObj, getDateTimeText, getLastNDaysTimestamp } from '../../Utils/HelperFunctions';
import {
    NOTIFICATIONS_URL,
    NOTIFICATIONS_HAS_SEEN_URL,
    MARK_NOTIFICATION_READ,
    UPDATE_HAS_SEEN_NOTIFICATION
} from '../../Constants/Urls';
import { getInputSkeleton } from '../UI Elements/Skeleton/GeneralSkeleton';
import NotificationMarkdownRenderer from '../../HOC/NotificationMarkdownRenderer';
import firebase from '../../Utils/FirebaseAuth';

const Notifications = props => {
    const [AppStore, dispatch] = useStore();
    const [notificationsLoaded, setNotificationsLoaded] = useState(false);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    useEffect(() => {
        let ref_url = interpolate(NOTIFICATIONS_HAS_SEEN_URL, [AppStore.user_id]);
        let ref = firebase.database().ref(ref_url);
        ref.on('value', updateUserSeenNotification);
        return () => {
            ref && ref.off('value');
        };
    }, []);

    const onNotificatinBadgeClick = event => {
        setNotificationsSeen();
        if (!notificationsLoaded) {
            setLoadingNotifications(true);
            let ref_url = interpolate(NOTIFICATIONS_URL, [AppStore.user_id]);
            let ref = firebase
                .database()
                .ref(ref_url)
                .orderByChild('timestamp')
                .startAt(getLastNDaysTimestamp(8 * 7)); // 8 weeks
            ref.on('value', updateUserNotification);
            return () => {
                ref && ref.off('value');
            };
        }
    };

    const setNotificationsSeen = () => {
        postAPI(interpolate(UPDATE_HAS_SEEN_NOTIFICATION, [getUserProfileId()]), {})
            .then(data => {})
            .catch(err => {});
    };

    /**
     * Update notification bell icon if any new notification comes and update it in store
     * @param {Object} snapshot Firebase object
     */
    const updateUserNotification = snapshot => {
        setLoadingNotifications(false);
        let notifications = reverseObj(snapshot.val());
        dispatch('setUserNotifications', notifications);
        setNotificationsLoaded(true);
    };

    const updateUserSeenNotification = snapshot => {
        let has_seen_notifications = snapshot.val();
        dispatch('setUserSeenNotifications', has_seen_notifications);
    };

    /**
     * Clear is_new from firebase
     * @param {String} notification_id Notification id
     */
    const markNotificationRead = (notification_id, is_new) => {
        if (is_new === true) {
            let data = {
                notification_id: notification_id
            };
            postAPI(interpolate(MARK_NOTIFICATION_READ, [getUserProfileId()]), data)
                .then(data => {})
                .catch(err => {});
        }
    };

    const notifications = AppStore.user_notifications ? AppStore.user_notifications || [] : [];
    let keys = Object.keys(notifications);
    const user_notifications = keys.map((val, k) => {
        let notif = notifications[val];
        return (
            <Menu.Item
                className='notification-dropdown-menu-item'
                key={k}
                onClick={() => markNotificationRead(val, notif.is_new)}>
                <Link to={notif.url} className='notification-url'>
                    {notif.is_new ? (
                        <div className='unread-notification notification'>
                            <div className='unread-notification-text'>
                                <NotificationMarkdownRenderer content={notif.text} />
                            </div>
                            <div className='notification-date'>{getDateTimeText(notif.timestamp)}</div>
                        </div>
                    ) : (
                        <div className='notification'>
                            <div>
                                <NotificationMarkdownRenderer content={notif.text} />
                            </div>
                            <div className='notification-date'>{getDateTimeText(notif.timestamp)}</div>
                        </div>
                    )}
                </Link>
            </Menu.Item>
        );
    });

    const notificationSkeleton = () => (
        <div>
            <div className='pl pr pt-s pb-s' style={{ marginTop: '10px', borderBottom: '1px solid #d2d2d2' }}>
                <div>{getInputSkeleton('small', 50, 12)}</div>
                <div className='center-align'>
                    {getInputSkeleton('small', 300, 12)}
                    {getInputSkeleton('small', 300, 12)}
                </div>
            </div>
            <div className='pl pr pt-s pb-s' style={{ marginTop: '10px', borderBottom: '1px solid #d2d2d2' }}>
                <div>{getInputSkeleton('small', 50, 12)}</div>
                <div className='center-align'>
                    {getInputSkeleton('small', 300, 12)}
                    {getInputSkeleton('small', 300, 12)}
                </div>
            </div>
            <div className='pl pr pt-s pb-s' style={{ marginTop: '10px', borderBottom: '1px solid #d2d2d2' }}>
                <div>{getInputSkeleton('small', 50, 12)}</div>
                <div className='center-align'>
                    {getInputSkeleton('small', 300, 12)}
                    {getInputSkeleton('small', 300, 12)}
                </div>
            </div>
            <div className='pl pr pt-s pb-s' style={{ marginTop: '10px' }}>
                <div>{getInputSkeleton('small', 50, 12)}</div>
                <div className='center-align'>
                    {getInputSkeleton('small', 300, 12)}
                    {getInputSkeleton('small', 300, 12)}
                </div>
            </div>
        </div>
    );

    let notificationMenu = (
        <Menu className='notification-dropdown-menu pt pb' onClick={props.handleCloseMenuClick}>
            {loadingNotifications ? (
                notificationSkeleton()
            ) : user_notifications.length ? (
                user_notifications
            ) : (
                <Menu.Item className='notification-dropdown-menu-item'>
                    <span className='pl pr'>No notification</span>
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <Dropdown
            className='notification-wrapper mr-l'
            overlay={notificationMenu}
            placement='bottomRight'
            trigger={['click']}
            arrow>
            <span>
                <Badge
                    dot={AppStore.has_seen_notifications === null ? false : !AppStore.has_seen_notifications}
                    offset={[-10, 2]}
                    className='notification-badge pr-s pl-s'
                    onClick={onNotificatinBadgeClick}>
                    <BellOutlined className='notification-icon cursor-pointer' rotate={10} />
                </Badge>
            </span>
        </Dropdown>
    );
};

export default Notifications;
