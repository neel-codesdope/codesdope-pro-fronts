import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox, Button } from 'antd';
import { areArraysEqual, isArrayEmpty } from '../../../../../Utils/HelperFunctions';
import { postAPI, interpolate } from '../../../../../Utils/ApiCalls';
import { SUBMIT_PRACTICE_QUESTION_ANSWER } from '../../../../../Constants/Urls';
import { PRACTICE_QUESTION_TYPE } from '../../../../../Constants/Values';
import SummaryMarkdownRenderer from '../../../../../HOC/SummaryMarkdownRenderer';

const CoursePracticeQuestion = props => {
    const [selected_options, setSelectedOptions] = useState([]);
    const [submitted_options, setSubmittedOptions] = useState([]);
    const [answer_visibility, setAnswerVisibility] = useState(false);

    const [hint_visibility, setHintVisibility] = useState(false);

    const submitAnswer = () => {
        let data = {};
        data.answer = {};
        data.answer.options = selected_options;
        data.answer.text = '';
        postAPI(interpolate(SUBMIT_PRACTICE_QUESTION_ANSWER, [props.ques.id]), data)
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
        props.ques.options.map((option, index) => {
            if (props.ques.correct_answer.options.includes(option.id)) {
                correct_options.push(String.fromCharCode(option.order + 64));
            }
        });
        return correct_options;
    };

    const getOptionClass = option_id => {
        let option_class =
            (isMCQAlreadyAnswered() ? props.ques.answer_by_user.options.includes(option_id) : false) ||
            submitted_options.includes(option_id)
                ? props.ques.correct_answer.options.includes(option_id)
                    ? 'success-color'
                    : 'error-color'
                : 'default-practice-option';
        return option_class;
    };

    const isAnswerSubmitted = () => {
        return !isArrayEmpty(submitted_options);
    };

    const isAlreadyAnswered = () => {
        return !!props.ques.answer_by_user;
    };

    const isMCQAlreadyAnswered = () => {
        return !!props.ques.answer_by_user ? (!isArrayEmpty(props.ques.answer_by_user.options) ? true : false) : false;
    };

    const isAnswerCorrect = () => {
        let is_submitted_answer_correct = areArraysEqual(selected_options, props.ques.correct_answer.options);
        let is_previous_answer_correct = isMCQAlreadyAnswered()
            ? areArraysEqual(props.ques.answer_by_user.options, props.ques.correct_answer.options)
            : false;
        return is_submitted_answer_correct || is_previous_answer_correct;
    };

    return (
        <li className='practice-ques-wrap pt-l' key={props.ques.id} id={props.ques.id}>
            <div className='flex-container flex-row flex-nowrap'>
                <span className='serial-no center-align'>{props.index + 1}</span>
                <Link to={'/practice/questions/' + props.ques.id}>
                    <SummaryMarkdownRenderer
                        className='practice-ques-wrapper practice_ui wrap-width ml-l pr-l'
                        content={props.ques.short_detail}
                    />
                </Link>
            </div>
            {!isArrayEmpty(props.ques.options) && (
                <div>
                    <Checkbox.Group
                        className='practice-ques-choices ml-xxl mb'
                        onChange={onChange}
                        defaultValue={isMCQAlreadyAnswered() ? props.ques.answer_by_user.options : undefined}>
                        {props.ques.options.map((option, index) => (
                            <div key={option.id} className='mb-s'>
                                <Checkbox
                                    value={option.id}
                                    disabled={isAnswerSubmitted() || isMCQAlreadyAnswered()}
                                    className='practice_ques_choice-wrapper'>
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
                    {(props.ques.question_type === PRACTICE_QUESTION_TYPE.MCQ ||
                        props.ques.question_type === PRACTICE_QUESTION_TYPE.FILL_BLANK) &&
                        !isAnswerSubmitted() &&
                        !isAlreadyAnswered() && (
                            <div className='ml-xxl mt-s mb-l'>
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
                        <div className='success-color font-weight-500 ml-xxl mb'>
                            Correct Answer: {getCorrectAnswerMessage()}
                        </div>
                    )}
                </div>
            )}
            {(props.ques.hint || props.ques.correct_answer.text) && (
                <div className='practice-ques-icons ml-xxl mb-l'>
                    {props.ques.hint && (
                        <Button type='default' className='mr-l' onClick={() => setHintVisibility(!hint_visibility)}>
                            Hint
                        </Button>
                    )}
                    {props.ques.correct_answer.text && (
                        <Button type='default' onClick={() => setAnswerVisibility(!answer_visibility)}>
                            Answer
                        </Button>
                    )}
                </div>
            )}
            {hint_visibility && (
                <SummaryMarkdownRenderer
                    className='practice-ans practice_ui mt-l mb-l pt-l pl-l pb-l pr-l'
                    content={props.ques.hint}
                />
            )}
            {answer_visibility && (
                <SummaryMarkdownRenderer
                    className='practice-ans practice_ui mt-l mb-l pl-l pr-l pt-l pb-l'
                    content={props.ques.correct_answer.text}
                />
            )}
        </li>
    );
};

export default CoursePracticeQuestion;
