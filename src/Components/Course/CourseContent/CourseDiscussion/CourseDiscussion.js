import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { postAPI } from '../../../../Utils/ApiCalls';
import { isCurrentlyEnrolled } from '../../../../Utils/HelperFunctions';
import { FETCH_DISCUSSION_QUESTIONS, POST_QUESTION } from '../../../../Constants/Urls';
import { QUESTION_SUBMIT_SUCCESS } from '../../../../Constants/Messages';
import QuestionsListComponent from '../../../UI Elements/Questions/QuestionsListComponent';
import SubmitQuestion from './SubmitQuestion/SubmitQuestion';
import { Helmet } from 'react-helmet';

const CourseDiscussion = props => {
    const { topic_slug } = useParams();
    const [new_question, setNewQuestion] = useState();

    const handleSubmitQuestion = data => {
        data.topic_slug = topic_slug;
        return new Promise((resolve, reject) => {
            postAPI(POST_QUESTION, data, 'POST')
                .then(d => {
                    setNewQuestion(d);
                    message.success(QUESTION_SUBMIT_SUCCESS);
                    props.history.push('/discussion/questions/' + d.id + '/');
                    resolve();
                })
                .catch(err => {
                    reject();
                });
        });
    };

    const question_elements = {
        list: true,
        author: true,
        avatar: true,
        content: true,
        datetime: true,
        like: true,
        follow: true,
        answer_count: true,
        reply: false
    };

    return (
        <>
            {props.selected_protopic_name ? (
                <Helmet>
                    <title>{props.selected_protopic_name} | Discussion Questions - CodesDope Pro</title>
                    <meta
                        name='description'
                        content={`Discussion questions for ${props.selected_protopic_name} - CodesDope Pro`}
                    />
                </Helmet>
            ) : (
                <></>
            )}

            <div className='ml-xl mr-xl'>
                <div>
                    {isCurrentlyEnrolled(props.course_enrollment_status) && (
                        <SubmitQuestion handleSubmitQuestion={handleSubmitQuestion} />
                    )}
                    <QuestionsListComponent
                        question_elements={question_elements}
                        fetch_ques_url={FETCH_DISCUSSION_QUESTIONS}
                        fetch_ques_url_id={topic_slug}
                        topic={topic_slug}
                        new_question={new_question}
                        course_enrollment_status={props.course_enrollment_status}
                    />
                </div>
            </div>
        </>
    );
};

export default CourseDiscussion;
