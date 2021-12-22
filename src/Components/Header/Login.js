import React, { useState, useRef } from 'react';
import { Form, Input, Button, Divider } from 'antd';
import Modal from '../StatusModal';
import { useStore } from '../../Stores/SetStore';
import { loginAPI } from '../../Utils/ApiCalls';
import { LOGIN } from '../../Constants/Urls';
import { FIELD_REQUIRED_ERROR } from '../../Constants/Messages';
import ResetPassword from './ResetPassword';
import GoogleLoginButton from '../UI Elements/SocialLoginButtons/GoogleLoginButton';

const Login = props => {
    const [, dispatch] = useStore();
    const [show_reset_password_modal, setResetPasswordModal] = useState(false);
    const [is_login_submitting, setIsLoginSubmitting] = useState(false);
    const usernameOrEmailRef = useRef();
    const passwordRef = useRef();
    const [form] = Form.useForm();

    const onLoginSubmit = user_data => {
        setIsLoginSubmitting(true);
        loginAPI(LOGIN, user_data)
            .then(data => {
                setIsLoginSubmitting(false);
                dispatch('changeProfileCompletion', data.token, data.id, data.user_profile_id);
                form.resetFields();
                props.onCancel();
            })
            .catch(err => {
                setIsLoginSubmitting(false);
            });
    };

    const openResetPasswordModal = () => {
        setResetPasswordModal(true);
        props.onCancel();
    };

    const closeResetPasswordModal = () => {
        setResetPasswordModal(false);
    };

    const layout = {
        labelCol: { span: 24 }
    };

    return (
        <>
            <ResetPassword visible={show_reset_password_modal} onCancel={closeResetPasswordModal} />
            <Modal visible={props.visible} onCancel={props.onCancel}>
                <h2>Welcome back!</h2>
                <Form {...layout} onFinish={onLoginSubmit} form={form} className='mt-large'>
                    <Form.Item
                        name='username_or_email'
                        label='Username or Email'
                        rules={[{ required: true, message: FIELD_REQUIRED_ERROR }]}>
                        <Input className='form-input' placeholder='Username or Email' ref={usernameOrEmailRef} />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        label='Password'
                        rules={[
                            {
                                required: true,
                                message: FIELD_REQUIRED_ERROR
                            }
                        ]}>
                        <Input.Password className='form-input' placeholder='Password' ref={passwordRef} />
                    </Form.Item>

                    <div className='wrap-width'>
                        <Button type='link' className='mt forgot-password' onClick={openResetPasswordModal}>
                            Forgot Password?
                        </Button>
                    </div>

                    <Form.Item>
                        <div>
                            <Button
                                type='primary'
                                loading={is_login_submitting}
                                className='full-width mt'
                                style={{ height: 38 }}
                                htmlType='submit'>
                                Login
                            </Button>
                        </div>
                    </Form.Item>
                </Form>

                <Divider>Or</Divider>

                <GoogleLoginButton onCancel={props.onCancel} />
                <div className='mt-l'>
                    Not registered yet? Go to{' '}
                    <span className='primary-color cursor-pointer' onClick={props.openSignUpFromLogin}>
                        Sign Up
                    </span>
                </div>
            </Modal>
        </>
    );
};

export default Login;
