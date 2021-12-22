import React, { useState } from 'react';
import { Button, Form, Input, Radio } from 'antd';
import { FIELD_REQUIRED_ERROR } from '../../../Constants/Messages';
import { feedback_array } from '../../../Constants/Values';

const { TextArea } = Input;
const SubmitReplyForm = props => {
    const [feedback, setFeedback] = useState(
        feedback_array.includes(props.feedback) ? props.feedback : !props.feedback ? '' : 'Other'
    );
    const [custom_feedback, setCustomFeedback] = useState(
        !feedback_array.includes(props.feedback) ? props.feedback : ''
    );
    const [form] = Form.useForm();

    const handleSubmitForm = data => {
        let result = feedback === 'Other' || props.temporary_rating >= 4 ? custom_feedback : feedback;
        props.handleSubmitForm(result);
    };

    const onFeedbackClick = feedback_option => {
        setFeedback(feedback_option);
    };

    const onCustomFeedbackChange = obj => {
        setCustomFeedback(obj.target.value);
    };

    const isSubmitButtonDisabled = () => {
        let is_disabled = false;
        if ((feedback === 'Other' || props.temporary_rating >= 4) && !custom_feedback) {
            is_disabled = true;
        } else if (!props.temporary_rating >= 4 && !feedback) {
            is_disabled = true;
        }
        return is_disabled;
    };

    return (
        <div>
            <Form form={form} className='rating-modal-form mt-l'>
                {props.temporary_rating < 4 && (
                    <div>
                        <div className='feedback-options-wrapper mb-l'>
                            {feedback_array.map((feedback_option, index) => (
                                <div
                                    key={index}
                                    className={
                                        'feedback-option ' +
                                        (feedback == feedback_option ? 'selected_feedback-option' : '')
                                    }
                                    onClick={() => onFeedbackClick(feedback_option)}>
                                    {feedback_option}
                                </div>
                            ))}
                        </div>
                        <div className='left-align'>
                            <Radio checked={feedback === 'Other'} onChange={() => onFeedbackClick('Other')}>
                                Other reason
                            </Radio>
                        </div>
                    </div>
                )}
                {(feedback === 'Other' || props.temporary_rating >= 4) && (
                    <Form.Item
                        className='mt mb-l'
                        name='feedback'
                        initialValue={custom_feedback}
                        defaultValue={custom_feedback}
                        value={custom_feedback}
                        onChange={onCustomFeedbackChange}
                        rules={[{ required: true, message: FIELD_REQUIRED_ERROR }]}>
                        <TextArea className='form-input' rows={3} placeholder={props.placeholder} />
                    </Form.Item>
                )}
            </Form>
            <div>
                <Button
                    className='mt'
                    type='primary'
                    disabled={isSubmitButtonDisabled()}
                    loading={props.submitting_rating}
                    style={{ height: 38 }}
                    onClick={handleSubmitForm}>
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default SubmitReplyForm;
