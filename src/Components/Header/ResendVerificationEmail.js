import React, { useState, useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import Modal from '../StatusModal';
import { postAPINoAuth } from '../../Utils/ApiCalls';
import { RESEND_VERIFICATION_EMAIL } from '../../Constants/Urls';
import { FIELD_REQUIRED_ERROR, INVALID_EMAIL_ERROR, CHECK_MAIL_FOR_LINK } from '../../Constants/Messages';

const ResendVerificationEmail = props => {
    const [is_submitting, setIsSubmitting] = useState(false);
    const emailRef = useRef();
    const [form] = Form.useForm();

    const onFormSubmit = user_data => {
        setIsSubmitting(true);
        postAPINoAuth(RESEND_VERIFICATION_EMAIL, user_data)
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
                <h2>Resend Verification Email</h2>
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
                                Resend Verification Email
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
                <p>Please contact us at if you have any trouble creating your account.</p>
            </Modal>
        </>
    );
};

export default ResendVerificationEmail;
