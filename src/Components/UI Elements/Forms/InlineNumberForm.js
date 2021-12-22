import React, { useState, useEffect } from 'react';
import { InputNumber, Button } from 'antd';

const InlineNumberForm = props => {
    const [input_value, setInputValue] = useState(props.initialValue);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [show_success_message, setShowSuccessMessage] = useState(false);

    const validateInput = () => {
        if (isNaN(input_value)) {
            setError('Value must be a number');
        } else if (props.min === props.max && input_value !== props.max) {
            setError('Value must be ' + props.max);
        } else if (input_value < props.min) {
            setError('Value must be greater than ' + props.min);
        } else if (input_value > props.max) {
            setError('Value must be less than ' + props.max);
        } else {
            setError();
        }
    };
    useEffect(() => {
        validateInput();
    }, [input_value]);

    const handleSubmitForm = () => {
        props
            .handleSubmitForm(input_value)
            .then(() => {
                setSuccess(true);
            })
            .catch(err => {
                setSuccess(false);
            });
    };

    const handleInputChange = new_value => {
        setInputValue(new_value);
    };

    return (
        <>
            <div className={'input-form-wrapper wrap-width default-card-neu ' + props.className}>
                <InputNumber
                    className='inline-form-input'
                    min={props.min}
                    max={props.max}
                    precision={props.precision}
                    value={input_value}
                    placeholder={props.form_input_placeholder}
                    onChange={value => handleInputChange(value)}
                />
                <Button
                    className='inline-form-button'
                    type='primary'
                    htmlType='submit'
                    disabled={!!error}
                    loading={props.submitting}
                    onClick={handleSubmitForm}>
                    {props.button_text}
                </Button>
            </div>
            {!!error && <div className='inline-form-error mt-s'>{error}</div>}
            {props.show_success_message && props.success_message && success && (
                <div className='inline-form-success mt'>
                    <i className='fa fa-check-circle mr-s'></i>
                    {props.success_message}
                </div>
            )}
        </>
    );
};

export default InlineNumberForm;
