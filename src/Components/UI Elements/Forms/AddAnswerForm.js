import React, { useState } from 'react';
import { Form, Button } from 'antd';
import Editor from 'cdmd-editor';
import 'cdmd-editor/dist/index.css';
import MarkdownRenderer from '../../../HOC/MarkdownRenderer';

const UpdateAnswerForm = props => {
    const [answer, setAnswer] = useState(props.answer);

    const handleAnswerChange = obj => {
        setAnswer(obj.text);
    };

    const handleSubmitForm = () => {
        let data = {};
        data.answer = answer;
        props.handleSubmitForm(data);
    };

    return (
        <Form className=' default-card-neu mt-l pr-l pl-l pt-l pb'>
            <Editor
                cdmdContainerClassName='mt'
                toolbarClassName='editor-toolbar'
                editorClassName='editor-textarea'
                rows={10}
                onChange={handleAnswerChange}
                value={answer}
            />
            {!!answer && (
                <>
                    <h3 className='preview-heading mt-l'>Preview</h3>
                    <MarkdownRenderer className='preview-box preview-content pt pb pr pl' content={answer} />
                </>
            )}
            <Form.Item className='mt-l'>
                <Button htmlType='submit' loading={props.submitting_answer} type='primary' onClick={handleSubmitForm}>
                    {props.btn_text}
                </Button>
                <Button className='ml' type='primary' onClick={props.handleCloseEditor}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdateAnswerForm;
