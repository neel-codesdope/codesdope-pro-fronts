import React, { useState, useRef } from 'react';
import { Form, Input, Button, Divider, message } from 'antd';
import Modal from '../StatusModal';
import { loginAPI } from '../../Utils/ApiCalls';
import {
    emailTakenValidator,
    usernameTakenValidator,
    usernameFormatValidator,
    passwordValidator
} from '../../Utils/HelperFunctions';
import { SIGNUP } from '../../Constants/Urls';
import {
    FIELD_REQUIRED_ERROR,
    INVALID_EMAIL_ERROR,
    PASSWORD_MISMATCH_ERROR,
    CHECK_MAIL_FOR_LINK
} from '../../Constants/Messages';
import GoogleLoginButton from '../UI Elements/SocialLoginButtons/GoogleLoginButton';
import ResendVerificationEmail from './ResendVerificationEmail';

const Signup = props => {
    const [is_signup_submitting, setIsSignupSubmitting] = useState(false);
    const [showResendVerificationEmailModal, setShowResendVerificationEmailModal] = useState(false);
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const rePasswordRef = useRef();
    const [form] = Form.useForm();

    const onSignupSubmit = user_data => {
        setIsSignupSubmitting(true);
        loginAPI(SIGNUP, user_data)
            .then(data => {
                setIsSignupSubmitting(false);
                form.resetFields();
                props.onCancel();
                message.success(CHECK_MAIL_FOR_LINK);
            })
            .catch(err => {
                setIsSignupSubmitting(false);
            });
    };

    const openResendVerificationEmailModal = () => {
        setShowResendVerificationEmailModal(true);
        props.onCancel();
    };

    const closeResendVerificationEmailModal = () => {
        setShowResendVerificationEmailModal(false);
        props.onCancel();
    };

    const layout = {
        labelCol: { span: 24 }
    };

    return (
        <>
            <ResendVerificationEmail
                visible={showResendVerificationEmailModal}
                onCancel={closeResendVerificationEmailModal}
            />
            <Modal visible={props.visible} onCancel={props.onCancel}>
                <h2>Welcome!</h2>
                <Form {...layout} onFinish={onSignupSubmit} validateTrigger='onBlur' form={form} className='mt-large'>
                    <Form.Item
                        name='username'
                        label='Username'
                        hasFeedback
                        rules={[
                            { required: true, message: FIELD_REQUIRED_ERROR },
                            { validator: usernameTakenValidator },
                            { validator: usernameFormatValidator }
                        ]}>
                        <Input className='form-input' placeholder='Username' ref={usernameRef} />
                    </Form.Item>
                    <Form.Item
                        name='email'
                        label='Email'
                        hasFeedback
                        rules={[
                            { required: true, message: FIELD_REQUIRED_ERROR },
                            {
                                type: 'email',
                                message: INVALID_EMAIL_ERROR
                            },
                            { validator: emailTakenValidator }
                        ]}>
                        <Input className='form-input' placeholder='Email' ref={emailRef} />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        label='Password'
                        rules={[
                            {
                                required: true,
                                message: FIELD_REQUIRED_ERROR
                            },
                            { validator: passwordValidator }
                        ]}>
                        <Input.Password className='form-input' placeholder='Password' ref={passwordRef} />
                    </Form.Item>

                    <Form.Item
                        label='Confirm Password'
                        name='re_password'
                        rules={[
                            {
                                required: true,
                                message: FIELD_REQUIRED_ERROR
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(PASSWORD_MISMATCH_ERROR);
                                }
                            })
                        ]}>
                        <Input.Password className='form-input' ref={rePasswordRef} />
                    </Form.Item>

                    <Form.Item>
                        <div>
                            <Button
                                type='primary'
                                loading={is_signup_submitting}
                                className='full-width mt'
                                style={{ height: 38 }}
                                htmlType='submit'>
                                Sign Up
                            </Button>
                        </div>
                    </Form.Item>
                </Form>

                <Divider>Or</Divider>

                <GoogleLoginButton onCancel={props.onCancel} />
                <div className='mt'>
                    <span className='primary-color cursor-pointer' onClick={openResendVerificationEmailModal}>
                        Resend Verification Email
                    </span>
                </div>

                <div className='mt-s'>
                    Already a member? Go to{' '}
                    <span className='primary-color cursor-pointer' onClick={props.openLoginFromSignUp}>
                        Log In
                    </span>
                </div>
            </Modal>
        </>
    );
};

export default Signup;
