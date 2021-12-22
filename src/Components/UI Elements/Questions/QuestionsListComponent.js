import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { BASE_URL } from '../../../Constants/Urls';
import { NO_DISCUSSION_QUESTION } from '../../../Constants/Messages';
import { getAPI, interpolate } from '../../../Utils/ApiCalls';
import {
    isArrayEmpty,
    isEmptyObject,
    getElementBottomToScreenTop,
    getWindowHeight
} from '../../../Utils/HelperFunctions';
import useInfiniteScroll from '../../../Utils/CustomHooks/useInfiniteScroll';
import { getParagraphSkeleton } from '../Skeleton/GeneralSkeleton';
import QuestionComponent from './QuestionComponent';
import NoData from '../NoData/NoData';
import CircularSpinner from '../Spinner/CircularSpinner';

const QuestionsListComponent = props => {
    const [questions, setQuestions] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch discussion questions from api
    useEffect(() => {
        setLoading(true);
        getAPI(interpolate(props.fetch_ques_url, [props.fetch_ques_url_id]))
            .then(data => {
                setQuestions(data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    }, [props.topic]);

    // Append new added question
    useEffect(() => {
        if (!isEmptyObject(questions)) {
            setQuestions(prevState => {
                let prev_data = Object.assign({}, prevState);
                prev_data.results.unshift(props.new_question);
                prev_data.count = prev_data.count + 1;
                return prev_data;
            });
        }
    }, [props.new_question]);

    // Fetch more questions on scroll down
    const fetchMoreListItems = () => {
        if (!!questions.next) {
            getAPI(questions.next.replace(BASE_URL, ''))
                .then(data => {
                    setQuestions(prevState => {
                        let data_questions = Object.assign({}, prevState);
                        data_questions.next = data.next;
                        data_questions.results = [...data_questions.results, ...data.results];
                        return data_questions;
                    });
                    setIsFetching(false);
                })
                .catch(err => {
                    setIsFetching(false);
                });
        }
    };

    const getDistanceFromTop = () => {
        if (!!questions && !isArrayEmpty(questions.results)) {
            return getElementBottomToScreenTop(questions.results[questions.results.length - 1].id);
        }
    };

    const getHeightToCompare = () => {
        return getWindowHeight();
    };

    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, getDistanceFromTop, getHeightToCompare);

    const getQuestions = () => {
        return (
            <>
                <List
                    itemLayout='horizontal'
                    dataSource={questions.results}
                    locale={{
                        emptyText: (
                            <NoData
                                image='/img/no-data1.png'
                                alt='No practice question'
                                text={NO_DISCUSSION_QUESTION}
                            />
                        )
                    }}
                    renderItem={question => (
                        <li className='discussion-ques pl-l pr-l pt-l pb' id={question.id} key={question.id}>
                            <QuestionComponent
                                question_elements={props.question_elements}
                                question={question}
                                course_enrollment_status={props.course_enrollment_status}
                            />
                        </li>
                    )}
                />

                {!!questions.next && isFetching && <CircularSpinner />}
            </>
        );
    };

    const getDiscussionSkeleton = () => (
        <>
            <div className='mt-l'>{getParagraphSkeleton()}</div>
            <hr />
            <div className='mt-l mb-l'>{getParagraphSkeleton()}</div>
        </>
    );

    return <>{!loading ? getQuestions() : getDiscussionSkeleton()}</>;
};

export default QuestionsListComponent;
