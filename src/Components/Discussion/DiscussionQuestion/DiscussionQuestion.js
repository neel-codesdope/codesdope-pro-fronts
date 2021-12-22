import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { getAPI, deleteAPI, interpolate } from '../../../Utils/ApiCalls';
import { FETCH_DISCUSSION_QUESTION, DELETE_QUESTION } from '../../../Constants/Urls';
import {
    QUESTION_DELETE_SUCCESS,
    DELETING_QUESTION,
    ENROLL_FOR_DISCUSSION_QUESTION
} from '../../../Constants/Messages';
import { COURSE_ENROLLMENT_STATUS } from '../../../Constants/Values';
import { NO_DISCUSSION_QUESTION_DATA } from '../../../Constants/Messages';
import { isArrayEmpty, getParameterFromUrl } from '../../../Utils/HelperFunctions';
import { useStore } from '../../../Stores/SetStore';
import { getInputSkeleton, getCustomSkeleton } from '../../UI Elements/Skeleton/GeneralSkeleton';
import Question from './Question/Question';
import Answers from './Answers/Answers';
import NotEnrolledContent from '../../UI Elements/InaccessibleContent/NotEnrolledContent';
import NotLoggedInContent from '../../UI Elements/InaccessibleContent/NotLoggedInContent';
import NoData from '../../UI Elements/NoData/NoData';
import ErrorHandlerWrapper from '../../../HOC/ErrorHandlerWrapper';
import { Helmet } from 'react-helmet';

const DiscussionQuestion = props => {
    const [AppStore, _] = useStore();
    const { question_id } = useParams();
    const [question_data, setQuestionData] = useState();
    const [loading_question, setLoadingQuestion] = useState(false);
    const [error, setError] = useState();

    let answer_url_ref = getParameterFromUrl('answer_id');

    // Fetch question detail from api
    useEffect(() => {
        if (AppStore.is_user_logged_in) {
            setLoadingQuestion(true);
            getAPI(interpolate(FETCH_DISCUSSION_QUESTION, [question_id]), {}, AppStore.is_user_logged_in)
                .then(data => {
                    setQuestionData(data);
                    setError();
                    setLoadingQuestion(false);
                })
                .catch(err => {
                    setError(err.response.status);
                    setLoadingQuestion(false);
                });
        }
    }, [question_id, answer_url_ref]);

    const handleDeleteQuestion = () => {
        let hide = message.loading(DELETING_QUESTION, 0);
        deleteAPI(interpolate(DELETE_QUESTION, [question_id]), 'DELETE')
            .then(d => {
                hide();
                message.success(QUESTION_DELETE_SUCCESS);
                props.history.replace(
                    '/courses/' + question_data.course_slug + '/' + question_data.topic.slug + '/discussion'
                );
            })
            .catch(err => {
                hide();
            });
    };

    const getDiscussionSkeleton = () => (
        <div className='colored-card-neu pt-l pb pl-l pr-l'>
            <div>{getInputSkeleton('small', 200)}</div>
            <div className='mt-l'>{getCustomSkeleton(2)}</div>
        </div>
    );

    return (
        <ErrorHandlerWrapper error={error}>
            <div className='discussion-ques-wrapper place-center mt-xxl'>
                {AppStore.is_user_logged_in ? (
                    !loading_question ? (
                        !isArrayEmpty(question_data) ? (
                            question_data.enrolled === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                            question_data.enrolled === COURSE_ENROLLMENT_STATUS.EXPIRED ? (
                                <>
                                    {question_data.title ? (
                                        <Helmet>
                                            <title>{`${question_data.title} - CodesDope`}</title>
                                            <meta
                                                name='description'
                                                content={`${question_data.title} - Discuss this question on CodesDope`}
                                            />
                                        </Helmet>
                                    ) : (
                                        <></>
                                    )}
                                    <div>
                                        {/* Question */}
                                        <Question
                                            question_data={question_data}
                                            handleDeleteQuestion={handleDeleteQuestion}
                                            course_enrollment_status={question_data.enrolled}
                                        />
                                        {/* Answers */}
                                        <Answers
                                            question_id={question_id}
                                            question_author={question_data.author.id}
                                            course_enrollment_status={question_data.enrolled}
                                        />
                                    </div>
                                </>
                            ) : (
                                <NotEnrolledContent
                                    course_slug={question_data.course_slug}
                                    text={ENROLL_FOR_DISCUSSION_QUESTION}
                                />
                            )
                        ) : (
                            <NoData text={NO_DISCUSSION_QUESTION_DATA} />
                        )
                    ) : (
                        getDiscussionSkeleton()
                    )
                ) : (
                    <NotLoggedInContent />
                )}
            </div>
        </ErrorHandlerWrapper>
    );
};

export default DiscussionQuestion;
