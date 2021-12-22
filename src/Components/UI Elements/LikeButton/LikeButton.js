import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';

const LikeButton = props => {
    const [likes, setLikes] = useState(props.likes);
    const [liked, setLiked] = useState(props.liked);

    const handleLike = () => {
        liked ? setLikes(likes - 1) : setLikes(likes + 1);
        setLiked(!liked);
        props
            .handleLike()
            .then(data => {
                setLikes(data.likes);
                setLiked(data.liked);
            })
            .catch(err => {
                liked ? setLikes(likes - 1) : setLikes(likes + 1);
                setLiked(!liked);
            });
    };

    return (
        <Tooltip key='comment-like' title='Like'>
            <span className={props.className} onClick={handleLike}>
                <span className='action-icon'>
                    {liked ? <LikeFilled className='like-btn' /> : <LikeOutlined className='no-like-btn' />}
                </span>
                <span className='action-text'>{likes}</span>
            </span>
        </Tooltip>
    );
};

export default LikeButton;
