import React, { useState, useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import Modal from '../StatusModal';
import { postAPINoAuth } from '../../Utils/ApiCalls';
import { CONFIRM_RESET_PASSWORD } from '../../Constants/Urls';
import { FIELD_REQUIRED_ERROR, UPDATE_PASSWORD_SUCCESS } from '../../Constants/Messages';
import { passwordValidator } from '../../Utils/HelperFunctions';

const ConfirmResetPassword = props => {
    const [is_submitting, setIsSubmitting] = useState(false);
    const newPasswordRef = useRef();
    const [form] = Form.useForm();

    const onFormSubmit = user_data => {
        setIsSubmitting(true);
        user_data.token = props.token;
        postAPINoAuth(CONFIRM_RESET_PASSWORD, user_data)
            .then(data => {
                setIsSubmitting(false);
                form.resetFields();
                props.onCancel();
                message.success(UPDATE_PASSWORD_SUCCESS);
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
                <h2>Reset Password</h2>
                <Form {...layout} onFinish={onFormSubmit} validateTrigger='onBlur' form={form} className='mt-large'>
                    <Form.Item
                        label='New Password'
                        name='new_password'
                        rules={[
                            {
                                required: true,
                                message: FIELD_REQUIRED_ERROR
                            },
                            { validator: passwordValidator }
                        ]}>
                        <Input.Password className='form-input' ref={newPasswordRef} />
                    </Form.Item>

                    <Form.Item>
                        <div>
                            <Button
                                type='primary'
                                loading={is_submitting}
                                className='full-width mt'
                                style={{ height: 38 }}
                                htmlType='submit'>
                                Submit
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ConfirmResetPassword;
