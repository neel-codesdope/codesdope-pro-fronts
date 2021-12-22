import React, { useState, useRef } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import { CHANGE_EMAIL } from '../../../Constants/Urls';
import { FIELD_REQUIRED_ERROR, INVALID_EMAIL_ERROR, CONFIRM_CHANGE_EMAIL } from '../../../Constants/Messages';
import { postAPI } from '../../../Utils/ApiCalls';
import { emailTakenValidator } from '../../../Utils/HelperFunctions';
import { useStore } from '../../../Stores/SetStore';
import { getInputSkeleton, getButtonSkeleton } from '../../UI Elements/Skeleton/GeneralSkeleton';

const ChangeEmail = props => {
    const [AppStore, dispatch] = useStore();
    const [updating_email, setUpdatingEmail] = useState(false);
    const emailRef = useRef();

    const handleChangeEmail = data => {
        setUpdatingEmail(true);
        postAPI(CHANGE_EMAIL, data)
            .then(d => {
                message.success(d.message);
                setUpdatingEmail(false);
                dispatch('logoutUser');
                props.history.push('/');
            })
            .catch(err => {
                setUpdatingEmail(false);
            });
    };

    const confirmChangeEmail = answer_id => {
        Modal.confirm({
            content: CONFIRM_CHANGE_EMAIL,
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => handleChangeEmail(answer_id)
        });
    };

    const getFormSkeleton = () => (
        <>
            <div className='profile-form default-card-neu pt-l pb-l pr-xl pl-xl'>
                <div className='center-align'>
                    <div className='mt-xl mb-xl'>{getInputSkeleton('large', 200)}</div>
                </div>
                {getButtonSkeleton('large', 'default')}
            </div>
        </>
    );

    return (
        <>
            {AppStore.is_user_fetched ? (
                <div className='profile-form default-card-neu pt-l pb-l pr-xl pl-xl'>
                    <h1>Change Email</h1>
                    <Form
                        className='mt-l'
                        layout='vertical'
                        name='basic'
                        initialValues={{ remember: true }}
                        onFinish={confirmChangeEmail}
                        validateTrigger='onBlur'>
                        <Form.Item
                            label='Email'
                            name='new_email'
                            rules={[
                                {
                                    required: true,
                                    message: FIELD_REQUIRED_ERROR
                                },
                                {
                                    type: 'email',
                                    message: INVALID_EMAIL_ERROR
                                },
                                { validator: emailTakenValidator }
                            ]}>
                            <Input className='form-input' ref={emailRef} />
                        </Form.Item>

                        <Form.Item>
                            <Button type='primary' htmlType='submit' loading={updating_email}>
                                Change Email
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ) : (
                getFormSkeleton()
            )}
        </>
    );
};

export default ChangeEmail;
