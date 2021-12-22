import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { BASE_URL } from '../../../Constants/Urls';
import { LOADING_REPLIES } from '../../../Constants/Messages';
import { getAPI } from '../../../Utils/ApiCalls';
import CommentRepliesComponent from './CommentRepliesComponent';
import LoadMoreButton from '../LoadMoreButton/LoadMoreButton';
import LoadingListItems from '../Spinner/LoadingListItems';

const CommentRepliesListComponent = props => {
    const [replies, setReplies] = useState([]);
    const [loading_replies, setLoadingReplies] = useState();
    const [loading_more_replies, setLoadingMoreReplies] = useState(false);

    // Fetch replies from api
    useEffect(() => {
        setLoadingReplies(true);
        let data = { comment_id: props.comment_id };
        getAPI(props.reply_url, data)
            .then(data => {
                setReplies(data);
                setLoadingReplies(false);
            })
            .catch(err => {
                setLoadingReplies(false);
            });
    }, [props.comment_id]);

    // Add new reply
    useEffect(() => {
        setReplies(prevState => {
            if (!!prevState.results) {
                if (prevState.results[0] !== props.new_reply) {
                    prevState.results.unshift(props.new_reply);
                }
            }
            return prevState;
        });
    }, [props.new_reply]);

    // Fetch all replies when ref passed in url query param
    useEffect(() => {
        if (!!props.reply_url_ref && !!replies.next && props.first_render) {
            fetchMoreReplies();
        }
    }, [replies, props.reply_url_ref]);

    const mergeObjectArrays = (source_array, new_array) => {
        let ids = new Set(source_array.map(d => d.id));
        let merged_array = [...source_array, ...new_array.filter(d => !ids.has(d.id))];
        return merged_array;
    };

    const fetchMoreReplies = () => {
        if (!!replies.next) {
            setLoadingMoreReplies(true);
            getAPI(replies.next.replace(BASE_URL, ''))
                .then(data => {
                    setReplies(prevState => {
                        let data_replies = Object.assign({}, prevState);
                        data_replies.next = data.next;
                        data_replies.results = mergeObjectArrays(data_replies.results, data.results);
                        return data_replies;
                    });
                    setLoadingMoreReplies(false);
                })
                .catch(err => {
                    setLoadingMoreReplies(false);
                });
        }
    };

    const loadMoreReplies = !!replies.next ? (
        !loading_replies && !loading_more_replies ? (
            <LoadMoreButton onButtonClick={fetchMoreReplies} btn_text='Load more replies' />
        ) : null
    ) : null;

    const reply_elements = {
        list: false,
        author: true,
        avatar: true,
        content: true,
        datetime: true,
        like: false,
        follow: false,
        answer_count: false,
        reply: true
    };

    const getReplies = () => {
        return (
            <>
                {loading_replies === false ? (
                    <div className='ml-l'>
                        <List
                            itemLayout='horizontal'
                            dataSource={replies.results}
                            locale={{ emptyText: 'No reply' }}
                            loadMore={loadMoreReplies}
                            renderItem={reply => (
                                <CommentRepliesComponent
                                    reply_elements={reply_elements}
                                    reply={reply}
                                    reply_url_ref={props.reply_url_ref}
                                    first_render={props.first_render}
                                />
                            )}
                        />

                        {loading_more_replies && <LoadingListItems text={LOADING_REPLIES} />}
                    </div>
                ) : (
                    <div className='ml-l'>
                        <LoadingListItems text={LOADING_REPLIES} />
                    </div>
                )}
            </>
        );
    };

    return <>{!!replies && getReplies()}</>;
};

export default CommentRepliesListComponent;
