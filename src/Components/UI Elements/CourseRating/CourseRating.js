import React, { useState, useEffect } from 'react';
import { Form, Rate, message } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { CREATE_COURSE_RATING, UPDATE_COURSE_RATING } from '../../../Constants/Urls';
import { CREATE_RATING_SUCCESS, UPDATE_RATING_SUCCESS, SUBMITTING_RATING } from '../../../Constants/Messages';
import { feedback_array } from '../../../Constants/Values';
import { postAPI, interpolate } from '../../../Utils/ApiCalls';
import Modal from '../../StatusModal';
import SubmitReplyForm from '../../UI Elements/Forms/SubmitRatingForm';

const CourseRating = props => {
    const [rating, setRating] = useState(props.rating);
    const [feedback, setFeedback] = useState(props.feedback);
    const [temporary_rating, setTemporaryRating] = useState();
    const [open_rating_modal, setOpenRatingModal] = useState(false);
    const [submitting_rating, setSubmittingRating] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        setRating(props.rating);
    }, [props.rating]);

    useEffect(() => {
        setFeedback(props.feedback);
    }, [props.feedback]);

    const setRatingSubmitted = () => {
        if (!!props.setRatingSubmitted) {
            props.setRatingSubmitted(true);
        }
    };

    const onOpenRatingModal = () => {
        setOpenRatingModal(true);
    };

    const onCloseRatingModal = () => {
        setOpenRatingModal(false);
        form.resetFields();
        // if user rated < 4 and a rating already exists (not required)
        // if user rated >= 4 and closed the feedback modal without submitting feedback
        if (!!rating) {
            setRatingSubmitted();
        }
    };

    const createRating = (user_rating, user_feedback) => {
        let data = {};
        data.rating = user_rating;
        data.feedback = user_feedback;
        let hide;
        if (data.rating >= 4 && data.feedback === '') {
            hide = message.loading(SUBMITTING_RATING, 0);
        } else {
            setSubmittingRating(true);
        }
        postAPI(interpolate(CREATE_COURSE_RATING, [props.course_slug]), data)
            .then(response => {
                setRating(response.rating);
                setFeedback(response.feedback);
                setSubmittingRating(false);
                if (data.rating >= 4 && data.feedback === '') {
                    onOpenRatingModal();
                    hide();
                } else {
                    onCloseRatingModal();
                    // if user submitted rating < 4
                    setRatingSubmitted();
                }
                message.success(CREATE_RATING_SUCCESS);
            })
            .catch(err => {
                setSubmittingRating(false);
            });
    };

    const updateRating = (user_rating, user_feedback) => {
        let data = {};
        data.rating = user_rating;
        data.feedback = !!user_feedback
            ? user_feedback
            : data.rating >= 4 && feedback_array.includes(feedback)
            ? ''
            : feedback;
        let hide;
        if (data.rating >= 4 && user_feedback === '') {
            hide = message.loading(SUBMITTING_RATING, 0);
        } else {
            setSubmittingRating(true);
        }
        postAPI(interpolate(UPDATE_COURSE_RATING, [props.course_slug]), data, 'PATCH')
            .then(response => {
                setRating(response.rating);
                setFeedback(response.feedback);
                setSubmittingRating(false);
                if (data.rating >= 4 && user_feedback === '') {
                    onOpenRatingModal();
                    hide();
                } else {
                    onCloseRatingModal();
                }
                // if user submitted feedback for rating >= 4
                // if user updated rating (not required)
                setRatingSubmitted();
                message.success(UPDATE_RATING_SUCCESS);
            })
            .catch(err => {
                setSubmittingRating(false);
            });
    };

    const submitRating = (user_rating, user_feedback) => {
        if (!!rating) {
            updateRating(user_rating, user_feedback);
        } else {
            createRating(user_rating, user_feedback);
        }
    };

    const onRatingChange = data => {
        setTemporaryRating(data);
        if (data >= 4) {
            setSubmittingRating(false);
            submitRating(data, '');
        } else {
            onOpenRatingModal();
        }
    };

    const onSubmitFeedbackForm = data => {
        submitRating(temporary_rating, data);
    };

    return (
        <>
            <Rate
                className='course-rate-wrapper'
                defaultValue={rating}
                value={rating}
                allowClear={false}
                onChange={onRatingChange}
            />
            <Modal visible={open_rating_modal} onCancel={onCloseRatingModal}>
                {temporary_rating < 4 && (
                    <div className='center-align'>
                        <h2 className='heading-rating-modal'>Rate {props.course_name} course</h2>
                        <Rate
                            className='rating-star-modal'
                            value={temporary_rating}
                            defaultValue={temporary_rating}
                            allowClear={false}
                            onChange={onRatingChange}
                        />
                    </div>
                )}
                {temporary_rating < 4 && (
                    <div className='center-align mt-l'>
                        <h2 className='heading-rating-modal'>What went wrong?</h2>
                        <SubmitReplyForm
                            feedback={feedback}
                            submitting_rating={submitting_rating}
                            temporary_rating={temporary_rating}
                            handleSubmitForm={onSubmitFeedbackForm}
                            placeholder='Please give feedback for this course'
                        />
                    </div>
                )}
                {temporary_rating >= 4 && (
                    <div className='center-align'>
                        <h2 className='heading-rating-modal'>
                            Thanks for your review <SmileOutlined className='success-color ml-s' />
                        </h2>
                        <p className='subheading-rating-modal mt-l'>
                            We would love to know your experience taking this course.
                        </p>
                        <SubmitReplyForm
                            feedback={feedback}
                            submitting_rating={submitting_rating}
                            temporary_rating={temporary_rating}
                            handleSubmitForm={onSubmitFeedbackForm}
                            placeholder='Please give feedback for this course.'
                        />
                    </div>
                )}
            </Modal>
        </>
    );
};

export default CourseRating;
