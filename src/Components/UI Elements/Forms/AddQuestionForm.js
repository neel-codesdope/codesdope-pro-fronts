import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import Editor from 'cdmd-editor';
import 'cdmd-editor/dist/index.css';
import { FIELD_REQUIRED_ERROR } from '../../../Constants/Messages';
import MarkdownRenderer from '../../../HOC/MarkdownRenderer';

const UpdateQuestionForm = props => {
    const [title, setTitle] = useState(props.title);
    const [detail, setDetail] = useState(props.detail);

    const handleTitleChange = obj => {
        setTitle(obj.target.value);
    };

    const handleDetailChange = obj => {
        setDetail(obj.text);
    };

    const handleSubmitForm = () => {
        if (title.length > 1) {
            let data = {};
            data.title = title;
            data.detail = detail;
            props.handleSubmitForm(data);
        }
    };

    return (
        <Form className='submit-question-form default-card-neu mt-l pr-l pl-l pt-l pb' layout='vertical'>
            <Form.Item
                className='form-item mt'
                name='title'
                initialValue={props.title}
                rules={[{ required: true, message: FIELD_REQUIRED_ERROR }]}>
                <Input className='form-input' placeholder='Enter title' onChange={handleTitleChange} value={title} />
            </Form.Item>
            <Editor
                cdmdContainerClassName='editor-wrapper mt'
                toolbarClassName='editor-toolbar'
                editorClassName='editor-textarea'
                rows={10}
                onChange={handleDetailChange}
                value={detail}
            />
            {!!detail && (
                <>
                    <h3 className='preview-heading mt-l'>Preview</h3>
                    <MarkdownRenderer className='preview-box preview-content pt pb pr pl' content={detail} />
                </>
            )}
            <Form.Item className='mt-l'>
                <Button htmlType='submit' loading={props.submitting_question} type='primary' onClick={handleSubmitForm}>
                    {props.btn_text}
                </Button>
                <Button className='ml' type='primary' onClick={props.handleCloseEditor}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdateQuestionForm;
