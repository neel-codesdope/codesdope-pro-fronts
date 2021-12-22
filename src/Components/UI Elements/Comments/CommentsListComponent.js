import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { BASE_URL } from '../../../Constants/Urls';
import { LOADING_COMMENTS } from '../../../Constants/Messages';
import { getAPI } from '../../../Utils/ApiCalls';
import { isArrayEmpty, isCurrentlyEnrolled } from '../../../Utils/HelperFunctions';
import CommentComponent from './CommentComponent';
import AddCommentForm from '../Forms/AddCommentForm';
import LoadMoreButton from '../LoadMoreButton/LoadMoreButton';
import CircularSpinner from '../Spinner/CircularSpinner';
import LoadingListItems from '../Spinner/LoadingListItems';

const CommentsListComponent = props => {
    const [comments, setComments] = useState([]);
    const [loading_comments, setLoadingComments] = useState();
    const [loading_more_comments, setLoadingMoreComments] = useState(false);
    const [submitting_comment, setSubmittingComment] = useState(false);

    // Fetch comments from api
    useEffect(() => {
        setLoadingComments(true);
        let data = {};
        data[props.comment_url_key] = props.item_id;
        getAPI(props.comment_url, data)
            .then(data => {
                setComments(data);
                setLoadingComments(false);
            })
            .catch(err => {
                setLoadingComments(false);
            });
    }, []);

    // Fetch all comments when ref passed in url query param
    useEffect(() => {
        if (!!props.comment_url_ref && !!comments.next && props.first_render) {
            fetchMoreComments();
        }
    }, [comments, props.comment_url_ref]);

    const handleSubmitComment = data => {
        setSubmittingComment(true);
        return new Promise((resolve, reject) => {
            props
                .handleSubmitComment(data)
                .then(d => {
                    setComments(prevState => {
                        prevState.results.unshift(d);
                        return prevState;
                    });
                    setSubmittingComment(false);
                    resolve(d);
                })
                .catch(err => {
                    setSubmittingComment(false);
                    reject();
                });
        });
    };

    const mergeObjectArrays = (source_array, new_array) => {
        let ids = new Set(source_array.map(d => d.id));
        let merged_array = [...source_array, ...new_array.filter(d => !ids.has(d.id))];
        return merged_array;
    };

    const fetchMoreComments = () => {
        if (!!comments.next) {
            setLoadingMoreComments(true);
            getAPI(comments.next.replace(BASE_URL, ''))
                .then(data => {
                    setComments(prevState => {
                        let data_comments = Object.assign({}, prevState);
                        data_comments.next = data.next;
                        data_comments.results = mergeObjectArrays(data_comments.results, data.results);
                        return data_comments;
                    });
                    setLoadingMoreComments(false);
                })
                .catch(err => {
                    setLoadingMoreComments(false);
                });
        }
    };

    const loadMoreComments = !!comments.next ? (
        !loading_comments && !loading_more_comments ? (
            <LoadMoreButton onButtonClick={fetchMoreComments} btn_text='Load more comments' />
        ) : null
    ) : null;

    const comment_elements = {
        list: false,
        author: true,
        avatar: true,
        content: true,
        datetime: true,
        like: false,
        follow: false,
        answer_count: false,
        replies: true,
        post_reply: true
    };

    const getComments = () => {
        return (
            <div className='comment-section-wrapper ml-l mb-l pt-l pb pl pr'>
                {isCurrentlyEnrolled(props.course_enrollment_status) && (
                    <AddCommentForm
                        className='pb-l'
                        comment=''
                        handleSubmitForm={handleSubmitComment}
                        submitting_comment={submitting_comment}
                        btn_text='Add Comment'
                    />
                )}
                {loading_comments === false ? (
                    !isArrayEmpty(comments.results) ? (
                        <>
                            <List
                                itemLayout='horizontal'
                                dataSource={comments.results}
                                locale={{ emptyText: 'No comment' }}
                                loadMore={loadMoreComments}
                                renderItem={comment => (
                                    <CommentComponent
                                        comment_elements={comment_elements}
                                        comment={comment}
                                        reply_url={props.reply_url}
                                        post_reply_url_key={props.post_reply_url_key}
                                        post_reply_url={props.post_reply_url}
                                        course_enrollment_status={props.course_enrollment_status}
                                        comment_url_ref={props.comment_url_ref}
                                        reply_url_ref={props.reply_url_ref}
                                        first_render={props.first_render}
                                    />
                                )}
                            />
                            {loading_more_comments && <LoadingListItems text={LOADING_COMMENTS} />}
                        </>
                    ) : null
                ) : (
                    <div className='center-align align-center'>
                        <CircularSpinner />
                    </div>
                )}
            </div>
        );
    };

    return <>{!!comments && getComments()}</>;
};

export default CommentsListComponent;
