import React from 'react';
import FollowButton from '../../FollowButton/FollowButton';

const QuestionFollow = props => {
    const handleQuestionFollow = () => {
        return new Promise((resolve, reject) => {
            props
                .handleQuestionFollow()
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject();
                });
        });
    };
    return (
        <FollowButton
            className={props.className}
            question_followers_count={props.question_followers_count}
            followed={props.followed}
            handleFollow={handleQuestionFollow}
        />
    );
};

export default QuestionFollow;
