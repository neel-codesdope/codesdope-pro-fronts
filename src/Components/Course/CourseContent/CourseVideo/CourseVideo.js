import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Input } from 'antd';
import { LoadingOutlined, FrownOutlined, SmileOutlined, CheckCircleFilled } from '@ant-design/icons';
import {
    VIDEO_COMPLETION_THRESHOLD,
    COURSE_ENROLLMENT_STATUS,
    VIDEO_ERROR_MESSAGE,
    VIDEO_ERROR_ENUM
} from '../../../../Constants/Values';
import { FIELD_REQUIRED_ERROR } from '../../../../Constants/Messages';
import { RETRIEVE_SUBTOPIC_RATING, CREATE_SUBTOPIC_RATING } from '../../../../Constants/Urls';
import { postAPI, getAPI, interpolate } from '../../../../Utils/ApiCalls';
import withMemo from '../../../../HOC/withMemo';
import { useStore } from '../../../../Stores/SetStore';
import ReactPlayer from 'react-player/vimeo';
import { Helmet } from 'react-helmet';

const { TextArea } = Input;

const CourseVideo = props => {
    const [AppStore, _] = useStore();
    const [loading_video, setLoadingVideo] = useState(true);
    const [video_error, setVideoError] = useState(false);
    const [video_ended, setVideoEnded] = useState(false);
    const [rating, setRating] = useState('');
    const [already_submitted_rating, setAlreadySubmittedRating] = useState(false);
    const [show_feedback_form, setShowFeedbackForm] = useState(false);
    const [submitting_rating, setSubmittingRating] = useState(false);
    const videoRef = useRef(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (!props.preferred_language) {
            setVideoError(false);
            setLoadingVideo(true);
        } else if (!props.video) {
            setVideoError(VIDEO_ERROR_ENUM.VIDEO_ID_NULL);
            setLoadingVideo(false);
        } else {
            setVideoError(false);
            setLoadingVideo(true);
        }
    }, [props.selected_subtopic, props.preferred_language]);

    useEffect(() => {
        if (
            (props.course_enrollment_status === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                props.course_enrollment_status === COURSE_ENROLLMENT_STATUS.EXPIRED) &&
            AppStore.is_user_logged_in
        ) {
            getAPI(interpolate(RETRIEVE_SUBTOPIC_RATING, [props.selected_subtopic]), {}, AppStore.is_user_logged_in)
                .then(response => {
                    setAlreadySubmittedRating(!!response.rating);
                    setRating(response.rating);
                })
                .catch(err => {});
        }
    }, [props.selected_subtopic, AppStore.is_user_logged_in]);

    useEffect(() => {
        closeFeedbackForm();
    }, [props.selected_subtopic]);

    const handleChapterCompletion = () => {
        setLoadingVideo(true);
        if (AppStore.is_user_logged_in && !props.is_subtopic_watched) {
            props
                .updateSuptopicWatchedStatus(props.selected_subtopic)
                .then(() => {
                    props.selectNextChapter();
                    setLoadingVideo(false);
                })
                .catch(err => {
                    setLoadingVideo(false);
                });
        } else {
            let is_next_chapter = props.selectNextChapter();
            if (!is_next_chapter) {
                setLoadingVideo(false);
            }
        }
    };

    const handleTimeUpdate = data => {
        if (!video_ended && data.played >= VIDEO_COMPLETION_THRESHOLD) {
            if (AppStore.is_user_logged_in && !props.is_subtopic_watched) {
                props.updateSuptopicWatchedStatus(props.selected_subtopic);
            }
        }
    };
    const handleOnEnd = data => {
        setVideoEnded(true);
        handleChapterCompletion();
    };
    const handleOnPlay = data => {
        if (loading_video) {
            setLoadingVideo(false);
        }
    };
    const handleOnReady = data => {
        setLoadingVideo(false);
        setVideoError(false);
    };
    const handleOnSeeked = data => {
        if (data / videoRef.current.getDuration() > 0.999) {
            handleChapterCompletion();
        }
    };
    const handleOnLoaded = data => {
        setVideoEnded(false);
        setLoadingVideo(false);
        setVideoError(false);
    };
    const handleOnError = data => {
        setVideoError(VIDEO_ERROR_ENUM.GENERAL);
        setLoadingVideo(false);
    };

    const submitRating = (user_rating, user_feedback) => {
        setSubmittingRating(true);
        let data = {};
        data.rating = user_rating;
        data.feedback = user_feedback;
        postAPI(interpolate(CREATE_SUBTOPIC_RATING, [props.selected_subtopic]), data)
            .then(data => {
                setRating(data.rating);
                closeFeedbackForm();
                setSubmittingRating(false);
            })
            .catch(err => {
                setSubmittingRating(false);
            });
    };

    const handleHappyFeedback = () => {
        submitRating(5, '');
    };

    const handleSadFeedback = data => {
        submitRating(1, data.feedback);
    };

    const openFeedbackForm = () => {
        setShowFeedbackForm(true);
    };

    const closeFeedbackForm = () => {
        setShowFeedbackForm(false);
        form.resetFields();
    };

    return (
        <>
            {props.selected_subtopic_name ? (
                <Helmet>
                    <title>{props.selected_subtopic_name} - CodesDope Pro</title>
                    <meta
                        name='description'
                        content={`Watch video for ${props.selected_subtopic_name} on CodesDope Pro`}
                    />
                </Helmet>
            ) : (
                <></>
            )}
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                {video_error ? (
                    <div
                        className='video-error-wrapper flex-container justify-center align-center center-align pr pl'
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                            whiteSpace: 'pre-line'
                        }}>
                        {VIDEO_ERROR_MESSAGE[video_error]}
                    </div>
                ) : (
                    <ReactPlayer
                        ref={videoRef}
                        url={'https://vimeo.com/' + props.video}
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0'
                        }}
                        width='100%'
                        height='100%'
                        controls={true}
                        playsinline={true}
                        config={{
                            vimeo: {
                                playerOptions: { autoplay: true }
                            }
                        }}
                        onReady={data => handleOnReady(data)}
                        onPlay={data => handleOnPlay(data)}
                        onProgress={data => handleTimeUpdate(data)}
                        onEnded={data => handleOnEnd(data)}
                        onSeek={data => handleOnSeeked(data)}
                        onStart={data => handleOnLoaded(data)}
                        onError={data => handleOnError(data)}
                    />
                )}

                {loading_video && (
                    <div
                        className='video-loading-wrapper flex-container justify-center align-center'
                        style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0' }}>
                        <LoadingOutlined spin />
                    </div>
                )}
            </div>
            {(props.course_enrollment_status === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                props.course_enrollment_status === COURSE_ENROLLMENT_STATUS.EXPIRED) &&
                AppStore.is_user_logged_in &&
                !already_submitted_rating &&
                (submitting_rating && !show_feedback_form ? (
                    <div className='subtopic-feedback-wrapper flex-container justify-center mt-xl'>
                        <LoadingOutlined className='subtopic-feedback-loading' />
                    </div>
                ) : (
                    <div className='mt-xl'>
                        {!rating && !show_feedback_form && (
                            <div>
                                <p className='subtopic-feedback-heading center-align'>Did you like this video?</p>
                                <div className='flex-container justify-center'>
                                    <div className='pl-l pr-l' onClick={openFeedbackForm}>
                                        <FrownOutlined className='subtopic-feedback-smiley feedback-smiley-sad error-color cursor-pointer' />
                                    </div>
                                    <div className='pl-l pr-l' onClick={handleHappyFeedback}>
                                        <SmileOutlined className='subtopic-feedback-smiley feedback-smiley-happy success-color cursor-pointer' />
                                    </div>
                                </div>
                            </div>
                        )}
                        {show_feedback_form && (
                            <div className='ml mr'>
                                <p className='subtopic-feedback-heading center-align'>How can we improve?</p>
                                <Form
                                    className='subtopic-feedback-form rating-modal-form place-center mt'
                                    onFinish={handleSadFeedback}
                                    form={form}>
                                    <Form.Item
                                        name='feedback'
                                        rules={[{ required: true, message: FIELD_REQUIRED_ERROR }]}>
                                        <TextArea
                                            className='form-input'
                                            rows={3}
                                            placeholder='Please give your feedback.'
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            className='mt'
                                            type='primary'
                                            loading={submitting_rating}
                                            style={{ height: 38 }}
                                            htmlType='submit'>
                                            Submit
                                        </Button>
                                        <Button
                                            className='mt ml'
                                            type='primary'
                                            style={{ height: 38 }}
                                            onClick={closeFeedbackForm}>
                                            Cancel
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        )}
                        {!!rating && (
                            <div className='center-align'>
                                <div className='feedback-response wrap-width center-align pt pb pl-l pr-l ml-l mr-l'>
                                    <CheckCircleFilled className='success-color mr' /> Thanks for the feedback.
                                    {rating === 5 && <span> We are glad you liked the content.</span>}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
        </>
    );
};

export default withMemo(CourseVideo, ['selected_subtopic', 'is_subtopic_watched', 'video']);
