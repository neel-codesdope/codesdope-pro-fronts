import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';

const InlineForm = props => {
    const [input_value, setInputValue] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [show_success_message, setShowSuccessMessage] = useState(false);

    const validateInput = () => {};
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

    const handleInputChange = e => {
        setInputValue(e.target.value);
    };

    return (
        <>
            <div className={'input-form-wrapper wrap-width default-card-neu ' + props.className}>
                <Input
                    className='inline-form-input'
                    value={input_value}
                    placeholder={props.form_input_placeholder}
                    onChange={value => handleInputChange(value)}
                />

                <Button
                    className='inline-form-button'
                    type='primary'
                    htmlType='submit'
                    disabled={!!error || input_value.length < 1}
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

export default InlineForm;
