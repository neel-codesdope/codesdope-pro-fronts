import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tooltip } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { postAPI, interpolate } from '../../../Utils/ApiCalls';
import { getUserDisplayName, getProfileAvatar, getDate, getParameterFromUrl } from '../../../Utils/HelperFunctions';
import {
    FETCH_DISCUSSION_QUESTION_COMMENTS,
    FETCH_DISCUSSION_QUESTION_REPLIES,
    POST_QUESTION_COMMENT,
    POST_QUESTION_REPLY,
    LIKE_QUESTION,
    FOLLOW_QUESTION
} from '../../../Constants/Urls';
import QuestionLike from './QuestionElements/QuestionLike';
import QuestionFollow from './QuestionElements/QuestionFollow';
import CommentsListComponent from '../Comments/CommentsListComponent';
import MarkdownRenderer from '../../../HOC/MarkdownRenderer';

const QuestionComponent = props => {
    const [comment_visibility, toggleCommentVisibility] = useState(false);
    const [first_render, setFirstRender] = useState(true);

    const { question_id } = useParams();
    let comment_url_ref = getParameterFromUrl('question_comment_id');
    let reply_url_ref = getParameterFromUrl('question_comment_reply_id');

    useEffect(() => {
        if (question_id === props.question.id && !!comment_url_ref) {
            setFirstRender(true);
            toggleCommentVisibility(true);
        } else {
            toggleCommentVisibility(false);
        }
    }, [props.question.id, comment_url_ref, reply_url_ref]);

    const handleSubmitComment = data => {
        data.question = props.question.id;
        return new Promise((resolve, reject) => {
            postAPI(POST_QUESTION_COMMENT, data, 'POST')
                .then(d => {
                    resolve(d);
                })
                .catch(err => {
                    reject();
                });
        });
    };

    const handleQuestionLike = () => {
        return new Promise((resolve, reject) => {
            postAPI(interpolate(LIKE_QUESTION, [props.question.id]))
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject();
                });
        });
    };

    const handleQuestionFollow = () => {
        return new Promise((resolve, reject) => {
            postAPI(interpolate(FOLLOW_QUESTION, [props.question.id]))
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject();
                });
        });
    };

    const handleShowCommentsBtnClick = () => {
        setFirstRender(false);
        toggleCommentVisibility(!comment_visibility);
    };

    return (
        <>
            <div className={!props.question_elements.list ? 'pb pl-l pr-l' : ''}>
                <div className='pb'>
                    {props.question_elements.title && <h1>{props.question.title}</h1>}
                    {props.question_elements.content &&
                        (props.question_elements.list ? (
                            <Link
                                to={
                                    '/discussion/questions/' +
                                    props.question.id +
                                    (props.question.answer_id ? '/?answer_id=' + props.question.answer_id : '')
                                }>
                                <p className='ques-title'>{props.question.title}</p>
                            </Link>
                        ) : (
                            <p className='ques-title pt'>
                                <MarkdownRenderer className='preview-content' content={props.question.detail} />
                            </p>
                        ))}
                    <div className='flex-container flex-wrap'>
                        <div className='ques-action-items-wrapper'>
                            {props.question_elements.like && (
                                <QuestionLike
                                    className={
                                        'discussion-ques-action-items cursor-pointer ' +
                                        (props.question_elements.large_action_items && 'large-action-icons')
                                    }
                                    likes={props.question.likes}
                                    liked={props.question.liked}
                                    handleQuestionLike={handleQuestionLike}
                                />
                            )}
                            {props.question_elements.follow && (
                                <QuestionFollow
                                    className={
                                        'discussion-ques-action-items cursor-pointer ' +
                                        (props.question_elements.large_action_items && 'large-action-icons')
                                    }
                                    question_followers_count={props.question.question_followers_count}
                                    followed={props.question.followed}
                                    handleQuestionFollow={handleQuestionFollow}
                                />
                            )}
                            {props.question_elements.answer_count && (
                                <Tooltip
                                    className={
                                        'discussion-ques-action-items cursor-default ' +
                                        (props.question_elements.large_action_items && 'large-action-icons')
                                    }
                                    key='comment-answer-count'
                                    title='Answers'>
                                    <span>
                                        <i className='fa fa-comment'></i>
                                    </span>
                                    <span className='ml-s'>{props.question.no_of_answers}</span>
                                </Tooltip>
                            )}
                            <span key='comment-reply-to mr'>
                                {props.question_elements.reply && (
                                    <Tooltip
                                        key='question-comments'
                                        title='Comments'
                                        className={
                                            'discussion-ques-action-items primary-color cursor-pointer ' +
                                            (props.question_elements.large_action_items && 'large-action-icons')
                                        }>
                                        <span onClick={handleShowCommentsBtnClick}>
                                            <MessageOutlined />
                                        </span>
                                    </Tooltip>
                                )}
                            </span>
                        </div>
                        {(props.question_elements.datetime ||
                            props.question_elements.author ||
                            props.question_elements.avatar) && (
                            <div className='ques-signature-wrapper'>
                                <div className='ques-signature-details wrap-width right-align'>
                                    {props.question_elements.datetime && (
                                        <div className='ques-time'>{getDate(props.question.created_at)}</div>
                                    )}
                                    {props.question_elements.author && (
                                        <div className='ques-author'>
                                            {getUserDisplayName(
                                                props.question.author.first_name,
                                                props.question.author.last_name,
                                                props.question.author.username
                                            )}
                                        </div>
                                    )}
                                </div>
                                {props.question_elements.avatar && (
                                    <div className='ques-author-profile-pic wrap-width ml'>
                                        {getProfileAvatar(
                                            props.question.author.first_name,
                                            props.question.author.last_name,
                                            props.question.author.username,
                                            props.question.author.profile_pic,
                                            37
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {/* <div className='clear-both'></div> */}
                </div>
                {comment_visibility && (
                    <CommentsListComponent
                        item_id={props.question.id}
                        comment_url={FETCH_DISCUSSION_QUESTION_COMMENTS}
                        reply_url={FETCH_DISCUSSION_QUESTION_REPLIES}
                        comment_url_key='question_id'
                        handleSubmitComment={handleSubmitComment}
                        post_reply_url_key='discussion_question_comment'
                        post_reply_url={POST_QUESTION_REPLY}
                        course_enrollment_status={props.course_enrollment_status}
                        comment_url_ref={!!comment_url_ref ? comment_url_ref : null}
                        reply_url_ref={!!reply_url_ref ? reply_url_ref : null}
                        first_render={first_render}
                    />
                )}
            </div>
        </>
    );
};

export default QuestionComponent;
