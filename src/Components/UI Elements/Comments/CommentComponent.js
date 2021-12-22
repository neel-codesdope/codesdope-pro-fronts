import React, { useState, useRef, useEffect } from 'react';
import { Comment, Tooltip } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { postAPI } from '../../../Utils/ApiCalls';
import { getUserDisplayName, getProfileAvatar, getDate, isCurrentlyEnrolled } from '../../../Utils/HelperFunctions';
import CommentRepliesListComponent from '../CommentReplies/CommentRepliesListComponent';
import AddReplyForm from '../Forms/AddReplyForm';
import CommentMarkdownRenderer from '../../../HOC/CommentMarkdownRenderer';

const CommentComponent = props => {
    const [reply_visibility, toggleReplyVisibility] = useState(false);
    const [post_reply_form_visibility, togglePostReplyFormVisibility] = useState(false);
    const [submitting_reply, setSubmittingReply] = useState(false);
    const [new_reply, setNewReply] = useState({});
    const [first_render, setFirstRender] = useState(true);
    const commentRef = useRef();

    let comment_url_ref = props.comment_url_ref;
    let reply_url_ref = props.reply_url_ref;

    useEffect(() => {
        if (!!props.comment && props.first_render) {
            if (comment_url_ref === props.comment.id) {
                commentRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [comment_url_ref, props.first_render]);

    useEffect(() => {
        if (comment_url_ref === props.comment.id && !!reply_url_ref && props.first_render) {
            setFirstRender(true);
            toggleReplyVisibility(true);
        }
    }, [reply_url_ref]);

    const handleSubmitReply = data => {
        setSubmittingReply(true);
        data[props.post_reply_url_key] = props.comment.id;
        return new Promise((resolve, reject) => {
            postAPI(props.post_reply_url, data, 'POST')
                .then(d => {
                    setNewReply(d);
                    setSubmittingReply(false);
                    togglePostReplyFormVisibility(!post_reply_form_visibility);
                    toggleReplyVisibility(true);
                    resolve(d);
                })
                .catch(err => {
                    setSubmittingReply(false);
                    reject();
                });
        });
    };

    const handleShowRepliesBtnClick = () => {
        setFirstRender(false);
        toggleReplyVisibility(!reply_visibility);
    };

    return (
        <>
            <li
                className={'discussion-comment ' + (!props.comment_elements.list ? 'pr-l' : '')}
                key={props.comment.id}
                ref={commentRef}>
                <Comment
                    author={
                        props.comment_elements.author && (
                            <span className='comment-author'>
                                {getUserDisplayName(
                                    props.comment.author.first_name,
                                    props.comment.author.last_name,
                                    props.comment.author.username
                                )}
                            </span>
                        )
                    }
                    avatar={
                        props.comment_elements.avatar &&
                        getProfileAvatar(
                            props.comment.author.first_name,
                            props.comment.author.last_name,
                            props.comment.author.username,
                            props.comment.author.profile_pic
                        )
                    }
                    content={
                        props.comment_elements.content && (
                            <p className='comment-title'>
                                <CommentMarkdownRenderer className='preview-content' content={props.comment.comment} />
                            </p>
                        )
                    }
                    datetime={
                        props.comment_elements.datetime && (
                            <span className='comment-time'>{getDate(props.comment.created_at)}</span>
                        )
                    }
                    actions={[
                        <Tooltip key='comment-replies' title='Replies'>
                            <span>
                                {props.comment_elements.replies && (
                                    <span onClick={handleShowRepliesBtnClick}>
                                        <MessageOutlined />
                                    </span>
                                )}
                            </span>
                        </Tooltip>,

                        <Tooltip key='post-reply' title='Reply'>
                            <span>
                                {props.comment_elements.post_reply &&
                                    isCurrentlyEnrolled(props.course_enrollment_status) && (
                                        <span
                                            onClick={() => togglePostReplyFormVisibility(!post_reply_form_visibility)}>
                                            <i className='fa fa-reply'></i>
                                        </span>
                                    )}
                            </span>
                        </Tooltip>
                    ]}
                />
                {post_reply_form_visibility && (
                    <AddReplyForm
                        className='pb-l'
                        reply=''
                        handleSubmitForm={handleSubmitReply}
                        submitting_reply={submitting_reply}
                        btn_text='Reply'
                    />
                )}
                {reply_visibility && (
                    <CommentRepliesListComponent
                        comment_id={props.comment.id}
                        reply_url={props.reply_url}
                        new_reply={new_reply}
                        reply_url_ref={comment_url_ref === props.comment.id && !!reply_url_ref ? reply_url_ref : null}
                        first_render={props.first_render && first_render}
                    />
                )}
            </li>
        </>
    );
};

export default CommentComponent;
