import React, { useState } from 'react';
import { Button } from 'antd';
import { EditFilled } from '@ant-design/icons';
import AddQuestionForm from '../../../../UI Elements/Forms/AddQuestionForm';

const SubmitQuestion = props => {
    const [show_question_editor, setShowQuestionEditor] = useState(false);
    const [submitting_question, setSubmittingQuestion] = useState(false);

    const handleSubmitQuestion = data => {
        setSubmittingQuestion(true);
        props
            .handleSubmitQuestion(data)
            .then(() => {
                setSubmittingQuestion(false);
                setShowQuestionEditor(false);
            })
            .catch(err => {
                setSubmittingQuestion(false);
            });
    };

    const handleCloseEditor = () => {
        setShowQuestionEditor(false);
    };

    return (
        <div className='mt-l mb-xl'>
            <Button
                className={
                    'ask-question-btn default-card-neu cursor-pointer mr-l ' +
                    (show_question_editor ? 'active' : 'not-active')
                }
                onClick={() => {
                    setShowQuestionEditor(true);
                }}>
                <EditFilled /> <span className='ml-s'>Ask Question</span>
            </Button>
            {show_question_editor && (
                <AddQuestionForm
                    title=''
                    detail=''
                    handleSubmitForm={handleSubmitQuestion}
                    submitting_question={submitting_question}
                    handleCloseEditor={handleCloseEditor}
                    btn_text='Submit'
                />
            )}
        </div>
    );
};

export default SubmitQuestion;
