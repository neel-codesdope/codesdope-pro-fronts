import React from 'react';
import { FETCH_QUESTIONS_FOLLOWED } from '../../../Constants/Urls';
import { getUserProfileId } from '../../../Utils/HelperFunctions';
import QuestionsListComponent from '../../UI Elements/Questions/QuestionsListComponent';

const QuestionsFollowed = props => {
    const question_elements = {
        list: true,
        title: false,
        author: true,
        avatar: false,
        content: true,
        datetime: true,
        like: true,
        follow: true,
        answer_count: true,
        reply: false
    };

    return (
        <div className='profile-form default-card-neu pt-l pb-l pr-l pl-l'>
            <QuestionsListComponent
                question_elements={question_elements}
                fetch_ques_url={FETCH_QUESTIONS_FOLLOWED}
                fetch_ques_url_id={getUserProfileId()}
            />
        </div>
    );
};

export default QuestionsFollowed;
