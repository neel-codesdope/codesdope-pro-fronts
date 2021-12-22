import React from 'react';
import LikeButton from '../../../../../UI Elements/LikeButton/LikeButton';

const AnswerLike = props => {
    const handleAnswerLike = () => {
        return new Promise((resolve, reject) => {
            props
                .handleAnswerLike()
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject();
                });
        });
    };
    return (
        <LikeButton className={props.className} likes={props.likes} liked={props.liked} handleLike={handleAnswerLike} />
    );
};

export default AnswerLike;
