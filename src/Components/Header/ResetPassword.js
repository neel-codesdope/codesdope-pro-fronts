import React, { useState, useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import Modal from '../StatusModal';
import { postAPINoAuth } from '../../Utils/ApiCalls';
import { RESET_PASSWORD } from '../../Constants/Urls';
import { FIELD_REQUIRED_ERROR, INVALID_EMAIL_ERROR, CHECK_MAIL_FOR_LINK } from '../../Constants/Messages';

const ResetPassword = props => {
    const [is_submitting, setIsSubmitting] = useState(false);
    const emailRef = useRef();
    const [form] = Form.useForm();

    const onFormSubmit = user_data => {
        setIsSubmitting(true);
        postAPINoAuth(RESET_PASSWORD, user_data)
            .then(data => {
                setIsSubmitting(false);
                form.resetFields();
                props.onCancel();
                message.success(CHECK_MAIL_FOR_LINK);
            })
            .catch(err => {
                setIsSubmitting(false);
            });
    };

    const layout = {
        labelCol: { span: 24 }
    };

    return (
        <>
            <Modal visible={props.visible} onCancel={props.onCancel}>
                <h2>Forgot your Password?</h2>
                <p className='reset-password-form-text'>
                    Don't worry! Enter your email address below, and we'll send you an email allowing you to reset it.
                </p>
                <Form {...layout} onFinish={onFormSubmit} validateTrigger='onBlur' form={form} className='mt-large'>
                    <Form.Item
                        name='email'
                        label='Email'
                        rules={[
                            { required: true, message: FIELD_REQUIRED_ERROR },
                            {
                                type: 'email',
                                message: INVALID_EMAIL_ERROR
                            }
                        ]}>
                        <Input className='form-input' placeholder='Email' ref={emailRef} />
                    </Form.Item>

                    <Form.Item>
                        <div>
                            <Button
                                type='primary'
                                loading={is_submitting}
                                className='full-width mt'
                                style={{ height: 38 }}
                                htmlType='submit'>
                                Reset Password
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
                <p>Please contact us if you have any trouble resetting your password.</p>
            </Modal>
        </>
    );
};

export default ResetPassword;
