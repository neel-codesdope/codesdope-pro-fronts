import React, { useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { getProfileAvatar } from '../../../Utils/HelperFunctions';
import { useStore } from '../../../Stores/SetStore';
import { getAvatarSkeleton } from '../Skeleton/GeneralSkeleton';

const { TextArea } = Input;

const AddCommentForm = props => {
    const [AppStore, _] = useStore();
    const commentRef = useRef();
    const [form] = Form.useForm();

    const handleSubmitForm = data => {
        props
            .handleSubmitForm(data)
            .then(() => {
                form.resetFields();
            })
            .catch(err => {});
    };

    return (
        <Form className={props.className} onFinish={handleSubmitForm} form={form}>
            <div className='flex-container'>
                <span>
                    {AppStore.is_user_fetched
                        ? getProfileAvatar(
                              AppStore.user.user.first_name,
                              AppStore.user.user.last_name,
                              AppStore.user.user.username,
                              AppStore.user.profile_pic
                          )
                        : getAvatarSkeleton('circle', 35, 35)}
                </span>
                <Form.Item name='comment' initialValue={props.comment} className='comment-input ml'>
                    <TextArea className='form-input' rows={1} ref={commentRef} />
                </Form.Item>
            </div>
            <Form.Item className='comment-submit-btn pl'>
                <Button htmlType='submit' loading={props.submitting_comment} type='primary' style={{ marginLeft: 35 }}>
                    {props.btn_text}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddCommentForm;
