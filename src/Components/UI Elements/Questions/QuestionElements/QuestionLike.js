import React from 'react';
import LikeButton from '../../LikeButton/LikeButton';

const QuestionLike = props => {
    const handleQuestionLike = () => {
        return new Promise((resolve, reject) => {
            props
                .handleQuestionLike()
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject();
                });
        });
    };

    return (
        <LikeButton
            className={props.className}
            likes={props.likes}
            liked={props.liked}
            handleLike={handleQuestionLike}
        />
    );
};

export default QuestionLike;
