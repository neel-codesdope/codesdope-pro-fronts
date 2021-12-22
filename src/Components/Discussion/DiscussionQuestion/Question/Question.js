import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Modal, message } from 'antd';
import { postAPI, interpolate } from '../../../../Utils/ApiCalls';
import { isIdSameAsUserId, isCurrentlyEnrolled } from '../../../../Utils/HelperFunctions';
import { UPDATE_QUESTION } from '../../../../Constants/Urls';
import { UPDATE_QUESTION_SUCCESS, CONFIRM_DELETE_DISCUSSION_QUESTION } from '../../../../Constants/Messages';
import QuestionComponent from '../../../UI Elements/Questions/QuestionComponent';
import UpdateQuestionForm from '../../../UI Elements/Forms/AddQuestionForm';

const Question = props => {
    const [question_data, setQuestionData] = useState(props.question_data);
    const [show_question_editor, setShowQuestionEditor] = useState(false);
    const [updating_question, setUpdatingQuestion] = useState(false);

    useEffect(() => {
        setQuestionData(props.question_data);
    }, [props.question_data]);

    const handleUpdateQuestion = data => {
        setUpdatingQuestion(true);
        postAPI(interpolate(UPDATE_QUESTION, [question_data.id]), data, 'PATCH')
            .then(d => {
                setQuestionData(prevState => {
                    let prev_data = Object.assign({}, prevState);
                    prev_data.title = d.title;
                    prev_data.detail = d.detail;
                    return prev_data;
                });
                message.success(UPDATE_QUESTION_SUCCESS);
                setUpdatingQuestion(false);
                setShowQuestionEditor(false);
            })
            .catch(err => {
                setUpdatingQuestion(false);
            });
    };

    const handleCloseEditor = () => {
        setShowQuestionEditor(false);
    };

    const confirmDeleteQuestion = () => {
        Modal.confirm({
            content: CONFIRM_DELETE_DISCUSSION_QUESTION,
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => props.handleDeleteQuestion()
        });
    };

    // Question Menu
    const getQuestionMenu = author_id => {
        return (
            <Menu>
                {isIdSameAsUserId(author_id) && isCurrentlyEnrolled(props.course_enrollment_status) && (
                    <Menu.Item key='question-delete' onClick={confirmDeleteQuestion}>
                        Delete Question
                    </Menu.Item>
                )}
                {isIdSameAsUserId(author_id) && isCurrentlyEnrolled(props.course_enrollment_status) && (
                    <Menu.Item key='question-edit' onClick={() => setShowQuestionEditor(true)}>
                        Edit Question
                    </Menu.Item>
                )}
            </Menu>
        );
    };

    const question_elements = {
        list: false,
        title: true,
        author: true,
        avatar: true,
        content: true,
        datetime: true,
        like: true,
        follow: true,
        answer_count: false,
        reply: true,
        large_action_items: true
    };

    return (
        <>
            {!show_question_editor ? (
                <div className='discussion-ques-detail position-relative mt-l'>
                    <QuestionComponent
                        question_elements={question_elements}
                        question={question_data}
                        course_enrollment_status={props.course_enrollment_status}
                    />
                    {isIdSameAsUserId(question_data.author.id) && isCurrentlyEnrolled(props.course_enrollment_status) && (
                        <Dropdown
                            className='position-absolute discussion-menu-icon discussion-ques-menu'
                            overlay={() => getQuestionMenu(question_data.author.id)}
                            placement='bottomCenter'
                            trigger={['click']}
                            arrow>
                            <button className='discussion_dropdown_icon cursor-pointer'>
                                <i className='fa fa-ellipsis-v'></i>
                            </button>
                        </Dropdown>
                    )}
                </div>
            ) : (
                <UpdateQuestionForm
                    title={question_data.title}
                    detail={question_data.detail}
                    handleSubmitForm={handleUpdateQuestion}
                    submitting_question={updating_question}
                    handleCloseEditor={handleCloseEditor}
                    btn_text='Update'
                />
            )}
        </>
    );
};

export default Question;
