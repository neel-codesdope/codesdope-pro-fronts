import React, { useRef, useEffect } from 'react';
import { Comment } from 'antd';
import { getUserDisplayName, getProfileAvatar, getDate } from '../../../Utils/HelperFunctions';
import CommentMarkdownRenderer from '../../../HOC/CommentMarkdownRenderer';

const CommentRepliesComponent = props => {
    const replyRef = useRef();
    let reply_url_ref = props.reply_url_ref;

    useEffect(() => {
        if (!!props.reply && props.first_render) {
            if (reply_url_ref === props.reply.id) {
                replyRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [props.reply_url_ref, props.first_render]);

    return (
        <>
            <li className={!props.reply_elements.list && 'pr-l'} key={props.reply.id} ref={replyRef}>
                <Comment
                    author={
                        props.reply_elements.author && (
                            <span className='comment-author'>
                                {getUserDisplayName(
                                    props.reply.author.first_name,
                                    props.reply.author.last_name,
                                    props.reply.author.username
                                )}
                            </span>
                        )
                    }
                    avatar={
                        props.reply_elements.avatar &&
                        getProfileAvatar(
                            props.reply.author.first_name,
                            props.reply.author.last_name,
                            props.reply.author.username,
                            props.reply.author.profile_pic
                        )
                    }
                    content={
                        props.reply_elements.content && (
                            <p className='comment-title'>
                                <CommentMarkdownRenderer className='preview-content' content={props.reply.reply} />
                            </p>
                        )
                    }
                    datetime={
                        props.reply_elements.datetime && (
                            <span className='comment-time'>{getDate(props.reply.created_at)}</span>
                        )
                    }
                />
            </li>
        </>
    );
};

export default CommentRepliesComponent;
