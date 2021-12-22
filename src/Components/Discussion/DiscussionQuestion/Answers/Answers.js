import React, { useState, useEffect } from 'react';
import { List, message } from 'antd';
import {
    isArrayEmpty,
    isIdSameAsUserId,
    isCurrentlyEnrolled,
    getElementBottomToScreenTop,
    getWindowHeight
} from '../../../../Utils/HelperFunctions';
import { getAPI, postAPI, deleteAPI, interpolate } from '../../../../Utils/ApiCalls';
import useInfiniteScroll from '../../../../Utils/CustomHooks/useInfiniteScroll';
import { FETCH_DISCUSSION_QUESTION_ANSWERS, POST_ANSWER, DELETE_ANSWER, BASE_URL } from '../../../../Constants/Urls';
import { ANSWER_SUBMIT_SUCCESS, ANSWER_DELETE_SUCCESS, DELETING_ANSWER } from '../../../../Constants/Messages';
import Answer from './Answer/Answer';
import SubmitAnswer from '../Question/QuestionElements/SubmitAnswer';
import CircularSpinner from '../../../UI Elements/Spinner/CircularSpinner';
import { getInputSkeleton, getCustomSkeleton } from '../../../UI Elements/Skeleton/GeneralSkeleton';

const Answers = props => {
    const [answers, setAnswers] = useState();
    const [loading_answers, setLoadingAnswers] = useState(false);

    useEffect(() => {
        setLoadingAnswers(true);
        getAPI(interpolate(FETCH_DISCUSSION_QUESTION_ANSWERS, [props.question_id]))
            .then(data => {
                setAnswers(data);
                setLoadingAnswers(false);
            })
            .catch(err => {
                setLoadingAnswers(false);
            });
    }, []);

    const mergeObjectArrays = (source_array, new_array) => {
        let ids = new Set(source_array.map(d => d.id));
        let merged_array = [...source_array, ...new_array.filter(d => !ids.has(d.id))];
        return merged_array;
    };

    const handleSubmitAnswer = data => {
        data.question_id = props.question_id;
        return new Promise((resolve, reject) => {
            postAPI(POST_ANSWER, data, 'POST')
                .then(data => {
                    setAnswers(prevState => {
                        let data_answers = Object.assign({}, prevState);
                        data_answers.has_user_answered = true;
                        data_answers.results.count = data_answers.results.count + 1;
                        data_answers.results.results.unshift(data);
                        return data_answers;
                    });
                    message.success(ANSWER_SUBMIT_SUCCESS);
                    resolve();
                })
                .catch(err => {
                    reject();
                });
        });
    };

    const handleDeleteAnswer = answer_id => {
        let hide = message.loading(DELETING_ANSWER, 0);
        deleteAPI(interpolate(DELETE_ANSWER, [answer_id]), 'DELETE')
            .then(d => {
                hide();
                message.success(ANSWER_DELETE_SUCCESS);
                getAPI(interpolate(FETCH_DISCUSSION_QUESTION_ANSWERS, [props.question_id]))
                    .then(data => {
                        setAnswers(data);
                    })
                    .catch(err => {});
            })
            .catch(err => {
                hide();
            });
    };

    const hasAskedQuestion = () => {
        return isIdSameAsUserId(props.question_author);
    };

    const hasAnswered = () => answers.has_user_answered;

    const IsEligibleToAnswer = () => {
        if (hasAskedQuestion() || hasAnswered()) {
            return false;
        }
        return true;
    };

    // Fetch more questions on scroll down
    const fetchMoreListItems = () => {
        if (!!answers && !!answers.results.next) {
            getAPI(answers.results.next.replace(BASE_URL, ''))
                .then(data => {
                    setAnswers(prevState => {
                        let data_answers = Object.assign({}, prevState);
                        data_answers.results.next = data.results.next;
                        data_answers.results.results = mergeObjectArrays(
                            data_answers.results.results,
                            data.results.results
                        );
                        return data_answers;
                    });
                    setIsFetching(false);
                })
                .catch(err => {
                    setIsFetching(false);
                });
        }
    };

    const getDistanceFromTop = () => {
        if (!!answers && !isArrayEmpty(answers.results.results)) {
            return getElementBottomToScreenTop(answers.results.results[answers.results.results.length - 1].id);
        }
    };

    const getHeightToCompare = () => {
        return getWindowHeight();
    };

    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, getDistanceFromTop, getHeightToCompare);

    const getDiscussionSkeleton = () => (
        <div className='colored-card-neu pt-l pb pl-l pr-l mt-xxxl'>
            <div>{getInputSkeleton('small', 200)}</div>
            <div className='mt-l'>{getCustomSkeleton(2)}</div>
        </div>
    );

    const getAnswers = () => (
        <>
            <List
                itemLayout='horizontal'
                dataSource={answers.results.results}
                renderItem={(answer, index) => (
                    <Answer
                        answer={answer}
                        handleDeleteAnswer={handleDeleteAnswer}
                        course_enrollment_status={props.course_enrollment_status}
                    />
                )}
            />

            {!!answers.results.next && isFetching && <CircularSpinner />}
        </>
    );

    return (
        <div className='clear-both pt-l'>
            {!loading_answers && !!answers ? (
                <>
                    {IsEligibleToAnswer() && isCurrentlyEnrolled(props.course_enrollment_status) && (
                        <SubmitAnswer handleSubmitAnswer={handleSubmitAnswer} />
                    )}
                    {
                        <div className='answer-count pb mt-l'>
                            {answers.results.count} {answers.results.count > 1 ? 'Answers' : 'Answer'}
                        </div>
                    }
                    {!isArrayEmpty(answers.results.results) && getAnswers()}
                </>
            ) : (
                getDiscussionSkeleton()
            )}
        </div>
    );
};

export default Answers;
