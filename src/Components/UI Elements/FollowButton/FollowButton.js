import React, { useState } from 'react';
import { Tooltip } from 'antd';

const FollowButton = props => {
    const [question_followers_count, setFollows] = useState(props.question_followers_count);
    const [followed, setFollowed] = useState(props.followed);

    const handleFollow = () => {
        followed ? setFollows(question_followers_count - 1) : setFollows(question_followers_count + 1);
        setFollowed(!followed);
        props
            .handleFollow()
            .then(data => {
                setFollows(data.followers);
                setFollowed(data.followed);
            })
            .catch(err => {
                followed ? setFollows(question_followers_count - 1) : setFollows(question_followers_count + 1);
                setFollowed(!followed);
            });
    };

    return (
        <Tooltip key='comment-follow' title='Follow'>
            <span className={props.className} onClick={handleFollow}>
                <span className='action-icon'>
                    {followed ? <i className='fa fa-rss follow-btn'></i> : <i className='fa fa-rss no-follow-btn'></i>}
                </span>
                <span className='action-text'>{question_followers_count}</span>
            </span>
        </Tooltip>
    );
};

export default FollowButton;
