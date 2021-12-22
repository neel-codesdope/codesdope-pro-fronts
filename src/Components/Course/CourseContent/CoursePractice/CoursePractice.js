import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Tabs, List } from 'antd';
import { getAPI, interpolate } from '../../../../Utils/ApiCalls';
import { getWindowHeight, isArrayEmpty, getElementBottomToScreenTop } from '../../../../Utils/HelperFunctions';
import { FETCH_PRACTICE_QUESTIONS, BASE_URL } from '../../../../Constants/Urls';
import { PRACTICE_LEVELS } from '../../../../Constants/Values';
import { NO_PRACTICE_QUESTION } from '../../../../Constants/Messages';
import useInfiniteScroll from '../../../../Utils/CustomHooks/useInfiniteScroll';
import { getParagraphSkeleton, getButtonSkeleton } from '../../../UI Elements/Skeleton/GeneralSkeleton';
import CoursePracticeQuestion from './CoursePracticeQuestion/CoursePracticeQuestion';
import NoData from '../../../UI Elements/NoData/NoData';
import CircularSpinner from '../../../UI Elements/Spinner/CircularSpinner';
import { Helmet } from 'react-helmet';

const { TabPane } = Tabs;

const CoursePractice = props => {
    const { course_slug, topic_slug } = useParams();
    const level = new URLSearchParams(useLocation().search).get('level');

    const [selected_tab, setSelectedTab] = useState();
    const [questions, setQuestions] = useState({});
    const [loading, setLoading] = useState(false);

    // Change url on level tab click
    function handleTabClick(key) {
        props.history.push('/courses/' + course_slug + '/' + topic_slug + '/practice?level=' + key);
    }

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

    // Fetch practice questions from api and highlight selected tab
    useEffect(() => {
        if (topic_slug === props.selected_protopic) {
            let params = { level: level - 1 };
            setLoading(true);
            getAPI(interpolate(FETCH_PRACTICE_QUESTIONS, [topic_slug]), params)
                .then(data => {
                    setQuestions(data);
                    setLoading(false);
                    setIsFetching(false);
                })
                .catch(err => {
                    setLoading(false);
                    setIsFetching(false);
                });
            setSelectedTab(level);
        }
    }, [topic_slug, level]);

    let getQuestions = practice_level => {
        if (practice_level == level) {
            return (
                <List
                    dataSource={questions.results}
                    locale={{
                        emptyText: (
                            <NoData image='/img/no-data1.png' alt='No practice question' text={NO_PRACTICE_QUESTION} />
                        )
                    }}
                    renderItem={(ques, index) => <CoursePracticeQuestion ques={ques} index={index} />}
                />
            );
        }
    };

    const getLevels = () => {
        const level_list = PRACTICE_LEVELS.map(level => (
            <TabPane
                className='practice-level-tab'
                tab={
                    <div className='practice-level flex-container justify-center align-center default-card-neu'>
                        Level {level}
                    </div>
                }
                key={level}>
                <div className='practice-content mt-l'>{getQuestions(level)}</div>
                {!!questions.next && isFetching && <CircularSpinner />}
            </TabPane>
        ));
        return level_list;
    };

    const getPracticeSkeleton = () => (
        <>
            <div className='center-align' style={{ width: '100%' }}>
                <span className='ml mr'>{getButtonSkeleton('large', 'default')}</span>
                <span className='ml mr'>{getButtonSkeleton('large', 'default')}</span>
                <span className='ml mr'>{getButtonSkeleton('large', 'default')}</span>
                <div className='mt-xxxl'>{getParagraphSkeleton()}</div>
                <hr />
                <div className='mt'>{getParagraphSkeleton()}</div>
            </div>
        </>
    );

    return (
        <>
            {props.selected_protopic_name ? (
                <Helmet>
                    <title>{props.selected_protopic_name} | Practice Questions - CodesDope Pro</title>
                    <meta
                        name='description'
                        content={`Practice questions of ${props.selected_protopic_name} - CodesDope Pro`}
                    />
                </Helmet>
            ) : (
                <></>
            )}

            <Tabs
                className='practice-wrapper ml-xl mr-xl'
                activeKey={selected_tab}
                onChange={handleTabClick}
                type='card'
                centered>
                {!loading ? getLevels() : getPracticeSkeleton()}
            </Tabs>
        </>
    );
};

export default CoursePractice;
