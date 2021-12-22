import React, { useState, useRef, useEffect } from 'react';
import { Menu, Dropdown, Tooltip, Modal, message } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { postAPI, interpolate } from '../../../../../Utils/ApiCalls';
import {
    getDate,
    isIdSameAsUserId,
    getUserDisplayName,
    getProfileAvatar,
    isArrayEmpty,
    getParameterFromUrl,
    isCurrentlyEnrolled
} from '../../../../../Utils/HelperFunctions';
import {
    UPDATE_ANSWER,
    FETCH_DISCUSSION_ANSWER_COMMENTS,
    FETCH_DISCUSSION_ANSWER_REPLIES,
    POST_ANSWER_COMMENT,
    POST_ANSWER_REPLY,
    LIKE_ANSWER
} from '../../../../../Constants/Urls';
import { UPDATE_ANSWER_SUCCESS, CONFIRM_DELETE_DISCUSSION_ANSWER } from '../../../../../Constants/Messages';
import AnswerLike from './AnswerElements/AnswerLike';
import UpdateAnswerForm from '../../../../UI Elements/Forms/AddAnswerForm';
import CommentsListComponent from '../../../../UI Elements/Comments/CommentsListComponent';
import { getCustomSkeleton } from '../../../../UI Elements/Skeleton/GeneralSkeleton';
import MarkdownRenderer from '../../../../../HOC/MarkdownRenderer';

const Answer = props => {
    const [answer, setAnswer] = useState(props.answer);
    const [show_answer_editor, setShowAnswerEditor] = useState(false);
    const [comment_visibility, toggleCommentVisibility] = useState(false);
    const [updating_answer, setUpdatingAnswer] = useState(false);
    const [first_render, setFirstRender] = useState(true);
    const answerRef = useRef();

    let answer_url_ref = getParameterFromUrl('answer_id');
    let comment_url_ref = getParameterFromUrl('answer_comment_id');
    let reply_url_ref = getParameterFromUrl('answer_comment_reply_id');

    useEffect(() => {
        if (!!answer) {
            if (answer_url_ref === answer.id) {
                answerRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [answer.id, answer_url_ref]);

    useEffect(() => {
        if (answer_url_ref === answer.id && !!comment_url_ref) {
            setFirstRender(true);
            toggleCommentVisibility(true);
        } else {
            toggleCommentVisibility(false);
        }
    }, [answer.id, comment_url_ref, reply_url_ref]);

    useEffect(() => {
        setAnswer(props.answer);
    }, [props.answer]);

    const handleUpdateAnswer = data => {
        setUpdatingAnswer(true);
        postAPI(interpolate(UPDATE_ANSWER, [answer.id]), data, 'PATCH')
            .then(d => {
                setAnswer(prevState => {
                    let prev_data = Object.assign({}, prevState);
                    prev_data.answer = d.answer;
                    return prev_data;
                });
                message.success(UPDATE_ANSWER_SUCCESS);
                setUpdatingAnswer(false);
                setShowAnswerEditor(false);
            })
            .catch(err => {
                setUpdatingAnswer(false);
            });
    };

    const confirmDeleteAnswer = answer_id => {
        Modal.confirm({
            content: CONFIRM_DELETE_DISCUSSION_ANSWER,
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => props.handleDeleteAnswer(answer_id)
        });
    };

    const handleCloseEditor = () => {
        setShowAnswerEditor(false);
    };

    const handleSubmitComment = data => {
        data.discussion_question_answer = answer.id;
        return new Promise((resolve, reject) => {
            postAPI(POST_ANSWER_COMMENT, data, 'POST')
                .then(d => {
                    resolve(d);
                })
                .catch(err => {
                    reject();
                });
        });
    };

    const handleAnswerLike = () => {
        return new Promise((resolve, reject) => {
            postAPI(interpolate(LIKE_ANSWER, [answer.id]))
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject();
                });
        });
    };

    // Answer Menu
    const getAnswerMenu = (answer_id, author_id) => (
        <Menu>
            {isIdSameAsUserId(author_id) && isCurrentlyEnrolled(props.course_enrollment_status) && (
                <Menu.Item key='answer-delete' onClick={() => confirmDeleteAnswer(answer_id)}>
                    Delete Answer
                </Menu.Item>
            )}
            {isIdSameAsUserId(author_id) && isCurrentlyEnrolled(props.course_enrollment_status) && (
                <Menu.Item key='answer-edit' onClick={() => setShowAnswerEditor(true)}>
                    Edit Answer
                </Menu.Item>
            )}
        </Menu>
    );

    const handleShowCommentsBtnClick = () => {
        setFirstRender(false);
        toggleCommentVisibility(!comment_visibility);
    };

    const getAnswerSkeleton = () => (
        <div className='discussion-ques-detail position-relative mt-l'>
            <div className='mt'>{getCustomSkeleton(2)}</div>
        </div>
    );

    return !isArrayEmpty(answer) ? (
        <>
            {!show_answer_editor ? (
                <li className='answer-wrapper pt-l pb-l' id={answer.id} key={answer.id} ref={answerRef}>
                    <div className={'position-relative discussion-ques-reply pt pb pl-l pr-l'}>
                        <p className='ques-title pt'>
                            <MarkdownRenderer className='preview-content' content={answer.answer} />
                        </p>
                        <div className='flex-container'>
                            <div className='ques-action-items-wrapper'>
                                <AnswerLike
                                    className='discussion-ques-action-items cursor-pointer'
                                    likes={props.answer.likes}
                                    liked={props.answer.liked}
                                    handleAnswerLike={handleAnswerLike}
                                />
                                <Tooltip key='answer-comments' title='Comments'>
                                    <span
                                        className='discussion-ques-action-items primary-color cursor-pointer'
                                        onClick={handleShowCommentsBtnClick}>
                                        <MessageOutlined />
                                    </span>
                                </Tooltip>
                            </div>
                            <div className='ques-signature-wrapper'>
                                <div className='ques-signature-details wrap-width right-align'>
                                    <div className='ques-time'>{getDate(answer.created_at)}</div>
                                    <div className='ques-author'>
                                        {getUserDisplayName(
                                            answer.author.first_name,
                                            answer.author.last_name,
                                            answer.author.username
                                        )}
                                    </div>
                                </div>
                                <div className='ques-author-profile-pic wrap-width ml'>
                                    {getProfileAvatar(
                                        answer.author.first_name,
                                        answer.author.last_name,
                                        answer.author.username,
                                        answer.author.profile_pic
                                    )}
                                </div>
                            </div>
                        </div>
                        {isIdSameAsUserId(answer.author.id) && isCurrentlyEnrolled(props.course_enrollment_status) && (
                            <Dropdown
                                className='position-absolute discussion-menu-icon discussion-ans-menu'
                                overlay={() => getAnswerMenu(answer.id, answer.author.id)}
                                placement='bottomCenter'
                                trigger={['click']}
                                arrow>
                                <button className='discussion_dropdown_icon cursor-pointer'>
                                    <i className='fa fa-ellipsis-v'></i>
                                </button>
                            </Dropdown>
                        )}
                    </div>
                    {comment_visibility && (
                        <CommentsListComponent
                            item_id={answer.id}
                            comment_url={FETCH_DISCUSSION_ANSWER_COMMENTS}
                            comment_url_key='answer_id'
                            reply_url={FETCH_DISCUSSION_ANSWER_REPLIES}
                            handleSubmitComment={handleSubmitComment}
                            post_reply_url_key='discussion_question_answer_comment'
                            post_reply_url={POST_ANSWER_REPLY}
                            course_enrollment_status={props.course_enrollment_status}
                            comment_url_ref={answer_url_ref === answer.id && !!comment_url_ref ? comment_url_ref : null}
                            reply_url_ref={answer_url_ref === answer.id && !!reply_url_ref ? reply_url_ref : null}
                            first_render={first_render}
                        />
                    )}
                </li>
            ) : (
                <UpdateAnswerForm
                    answer={answer.answer}
                    handleSubmitForm={handleUpdateAnswer}
                    submitting_answer={updating_answer}
                    handleCloseEditor={handleCloseEditor}
                    btn_text='Update'
                />
            )}
        </>
    ) : (
        getAnswerSkeleton()
    );
};

export default Answer;
