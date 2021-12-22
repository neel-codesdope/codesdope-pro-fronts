import React, { useState, useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import { CHANGE_PASSWORD } from '../../../Constants/Urls';
import { UPDATE_PASSWORD_SUCCESS, FIELD_REQUIRED_ERROR, PASSWORD_MISMATCH_ERROR } from '../../../Constants/Messages';
import { postAPI } from '../../../Utils/ApiCalls';
import { passwordValidator } from '../../../Utils/HelperFunctions';

const ResetPassword = props => {
    const [updating_password, setUpdatingPassword] = useState(false);
    const currentPasswordRef = useRef();
    const newPasswordRef = useRef();
    const reNewPasswordRef = useRef();

    const handleUpdateProfile = data => {
        setUpdatingPassword(true);
        postAPI(CHANGE_PASSWORD, data)
            .then(d => {
                message.success(UPDATE_PASSWORD_SUCCESS);
                setUpdatingPassword(false);
            })
            .catch(err => {
                setUpdatingPassword(false);
            });
    };

    return (
        <div className='profile-form default-card-neu pt-l pb-l pr-xl pl-xl'>
            <h1>Change Password</h1>
            <Form
                className='mt-l'
                layout='vertical'
                name='basic'
                initialValues={{ remember: true }}
                onFinish={handleUpdateProfile}
                validateTrigger='onBlur'>
                <Form.Item
                    label='Current Password'
                    name='current_password'
                    rules={[
                        {
                            required: true,
                            message: FIELD_REQUIRED_ERROR
                        }
                    ]}>
                    <Input.Password className='form-input' ref={currentPasswordRef} />
                </Form.Item>

                <Form.Item
                    label='New Password'
                    name='new_password'
                    dependencies={['current_password']}
                    rules={[
                        {
                            required: true,
                            message: FIELD_REQUIRED_ERROR
                        },
                        { validator: passwordValidator }
                    ]}>
                    <Input.Password className='form-input' ref={newPasswordRef} />
                </Form.Item>

                <Form.Item
                    label='Confirm Password'
                    name='re_new_password'
                    rules={[
                        {
                            required: true,
                            message: FIELD_REQUIRED_ERROR
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('new_password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(PASSWORD_MISMATCH_ERROR);
                            }
                        })
                    ]}>
                    <Input.Password className='form-input' ref={reNewPasswordRef} />
                </Form.Item>

                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={updating_password}>
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ResetPassword;
