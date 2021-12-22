import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Checkbox, Button } from 'antd';
import { getAPI, postAPI, interpolate } from '../../../Utils/ApiCalls';
import { FETCH_PRACTICE_QUESTION, SUBMIT_PRACTICE_QUESTION_ANSWER } from '../../../Constants/Urls';
import { NO_PRACTICE_QUESTION_DATA, ENROLL_FOR_PRACTICE_QUESTION } from '../../../Constants/Messages';
import { PRACTICE_QUESTION_TYPE } from '../../../Constants/Values';
import { areArraysEqual, isArrayEmpty, isCurrentlyEnrolled } from '../../../Utils/HelperFunctions';
import { useStore } from '../../../Stores/SetStore';
import { getParagraphSkeleton } from '../../UI Elements/Skeleton/GeneralSkeleton';
import NotEnrolledContent from '../../UI Elements/InaccessibleContent/NotEnrolledContent';
import NotLoggedInContent from '../../UI Elements/InaccessibleContent/NotLoggedInContent';
import NoData from '../../UI Elements/NoData/NoData';
import ErrorHandlerWrapper from '../../../HOC/ErrorHandlerWrapper';
import SummaryMarkdownRenderer from '../../../HOC/SummaryMarkdownRenderer';
import { Helmet } from 'react-helmet';

const PracticeQuestion = props => {
    const [AppStore, _] = useStore();
    const { question_id } = useParams();
    const [data, setData] = useState();
    const [selected_options, setSelectedOptions] = useState([]);
    const [submitted_options, setSubmittedOptions] = useState([]);
    const [loading_question, setLoadingQuestion] = useState(false);
    const [error, setError] = useState();
    const [answer_visibility, setAnswerVisibility] = useState(false);
    const [hint_visibility, setHintVisibility] = useState(false);

    // Fetch practice question detail from api
    useEffect(() => {
        if (AppStore.is_user_logged_in) {
            setLoadingQuestion(true);
            getAPI(interpolate(FETCH_PRACTICE_QUESTION, [question_id]))
                .then(data => {
                    setData(data);
                    setError();
                    setLoadingQuestion(false);
                })
                .catch(err => {
                    setError(err.response.status);
                    setLoadingQuestion(false);
                });
        }
    }, [question_id]);

    const submitAnswer = () => {
        let answer = {};
        answer.answer = {};
        answer.answer.options = selected_options;
        answer.answer.text = '';
        postAPI(interpolate(SUBMIT_PRACTICE_QUESTION_ANSWER, [data.id]), answer)
            .then(response => {})
            .catch(err => {});
    };

    const onSubmitAnswer = () => {
        setSubmittedOptions(selected_options);
        submitAnswer();
    };

    const onChange = checked_values => {
        setSelectedOptions(checked_values);
    };

    const getCorrectAnswerMessage = () => {
        let correct_options = [];
        data.options.map((option, index) => {
            if (data.correct_answer.options.includes(option.id)) {
                correct_options.push(String.fromCharCode(option.order + 64));
            }
        });
        return correct_options;
    };

    const getOptionClass = option_id => {
        let option_class =
            (isMCQAlreadyAnswered() ? data.answer_by_user.options.includes(option_id) : false) ||
            submitted_options.includes(option_id)
                ? data.correct_answer.options.includes(option_id)
                    ? 'success-color'
                    : 'error-color'
                : 'default-practice-option';
        return option_class;
    };

    const isAnswerSubmitted = () => {
        return !isArrayEmpty(submitted_options);
    };

    const isAlreadyAnswered = () => {
        return !!data.answer_by_user;
    };

    const isMCQAlreadyAnswered = () => {
        return !!data.answer_by_user ? (!isArrayEmpty(data.answer_by_user.options) ? true : false) : false;
    };

    const isAnswerCorrect = () => {
        let is_submitted_answer_correct = areArraysEqual(selected_options, data.correct_answer.options);
        let is_previous_answer_correct = isMCQAlreadyAnswered()
            ? areArraysEqual(data.answer_by_user.options, data.correct_answer.options)
            : false;
        return is_submitted_answer_correct || is_previous_answer_correct;
    };

    const isAnswerVisible = () => {
        let is_visible = false;
        if (!!data.correct_answer.text || !!data.answer_explanation) {
            if (data.question_type === PRACTICE_QUESTION_TYPE.MCQ) {
                if (isAnswerSubmitted() || isAlreadyAnswered()) {
                    is_visible = true;
                }
            } else {
                is_visible = true;
            }
        }
        return is_visible;
    };

    const getQuestionDetails = () => (
        <div>
            {/* Question */}
            <h1 className='primary-color'>{data.question}</h1>
            <div className='practice-section-ques'>
                <SummaryMarkdownRenderer className='practice_ui' content={data.detail} />
                {!isArrayEmpty(data.options) && (
                    <Checkbox.Group
                        className='practice-ques-choices mb mt'
                        onChange={onChange}
                        defaultValue={isMCQAlreadyAnswered() ? data.answer_by_user.options : undefined}>
                        {data.options.map((option, index) => (
                            <div key={option.id}>
                                <Checkbox value={option.id} disabled={isAnswerSubmitted() || isMCQAlreadyAnswered()}>
                                    <span className='practice_ques_choice_index primary-color font-weight-500'>
                                        {String.fromCharCode(option.order + 64)}.
                                    </span>{' '}
                                    <span
                                        className={
                                            isAnswerSubmitted() || isMCQAlreadyAnswered()
                                                ? getOptionClass(option.id)
                                                : 'default-practice-option'
                                        }>
                                        <span className='practice-ques-option wrap-width'>{option.option}</span>
                                    </span>
                                </Checkbox>
                            </div>
                        ))}
                    </Checkbox.Group>
                )}
                {data.question_type === PRACTICE_QUESTION_TYPE.MCQ && !isAnswerSubmitted() && !isAlreadyAnswered() && (
                    <div className='mt-s mb-l'>
                        <Button
                            type='primary'
                            className='practice-submit-btn'
                            disabled={isArrayEmpty(selected_options)}
                            onClick={onSubmitAnswer}>
                            Submit Answer
                        </Button>
                    </div>
                )}
                {(isAnswerSubmitted() || isAlreadyAnswered()) && !isAnswerCorrect() && (
                    <div className='success-color font-weight-500 mb'>Correct Answer: {getCorrectAnswerMessage()}</div>
                )}
                {data.examples.map((example, index) => (
                    <>
                        <h3>Example {index + 1}</h3>
                        {example.sample_input && (
                            <div>
                                <h4>Input</h4>
                                <pre className='code-block'>{example.sample_input}</pre>
                            </div>
                        )}
                        {example.output && (
                            <div>
                                <h4>Output</h4>
                                <pre className='code-block'>{example.output}</pre>
                            </div>
                        )}
                        {example.explanation && (
                            <div>
                                <h4>Explanation</h4>
                                <p className='practice-eg-explanation'>{example.explanation}</p>
                            </div>
                        )}
                    </>
                ))}
                <div className='mt-l mb-l'>
                    {!!data.hint && (
                        <Button type='primary' className='mr-l' onClick={() => setHintVisibility(!hint_visibility)}>
                            Show Hint
                        </Button>
                    )}
                    {isAnswerVisible() && (
                        <Button type='primary' onClick={() => setAnswerVisibility(!answer_visibility)}>
                            Show Answer
                        </Button>
                    )}
                </div>
            </div>
            {/* Hint */}
            {hint_visibility && (
                <div className='practice-ans mt-l mb-l pt-l pl-l pb-l pr-l'>
                    <SummaryMarkdownRenderer className='practice_ui' content={data.hint} />
                </div>
            )}

            {/* Answer */}
            {answer_visibility && (
                <div className='practice-section-ans mt-xl pt-l'>
                    <h2>Answer</h2>
                    <SummaryMarkdownRenderer className='practice_ui' content={data.correct_answer.text} />
                    <SummaryMarkdownRenderer className='practice_ui mt-l' content={data.answer_explanation} />
                </div>
            )}
        </div>
    );

    const getPracticeQuestionSkeleton = () => (
        <>
            <div>{getParagraphSkeleton()}</div>
            <div className='mt'>{getParagraphSkeleton()}</div>
        </>
    );

    return (
        <ErrorHandlerWrapper error={error}>
            <div className='practice-ques-sep-wrapper place-center mt-xxl'>
                {AppStore.is_user_logged_in ? (
                    !loading_question ? (
                        !isArrayEmpty(data) ? (
                            !data.is_locked ? (
                                <>
                                    <Helmet>
                                        <title>{data.question} - CodesDope</title>
                                        <meta name='description' content={`${data.question} - Practice on CodesDope`} />
                                    </Helmet>
                                    {getQuestionDetails()}
                                </>
                            ) : (
                                <NotEnrolledContent
                                    course_slug={data.course_slug}
                                    text={ENROLL_FOR_PRACTICE_QUESTION}
                                />
                            )
                        ) : (
                            <NoData text={NO_PRACTICE_QUESTION_DATA} />
                        )
                    ) : (
                        getPracticeQuestionSkeleton()
                    )
                ) : (
                    <NotLoggedInContent />
                )}
            </div>
        </ErrorHandlerWrapper>
    );
};

export default PracticeQuestion;
