import React, { useState } from 'react';
import { EditFilled } from '@ant-design/icons';
import AddAnswerForm from '../../../../UI Elements/Forms/AddAnswerForm';

const SubmitAnswer = props => {
    const [show_answer_editor, setShowAnswerEditor] = useState(false);
    const [submitting_answer, setSubmittingAnswer] = useState(false);

    const handleSubmitAnswer = data => {
        setSubmittingAnswer(true);
        props
            .handleSubmitAnswer(data)
            .then(() => {
                setSubmittingAnswer(false);
            })
            .catch(err => {
                setSubmittingAnswer(false);
            });
    };

    const handleCloseEditor = () => {
        setShowAnswerEditor(false);
    };

    return (
        <div className='mt-l'>
            <div
                className='action-icon-wrapper wrap-width cursor-pointer primary-color mr-l'
                onClick={() => {
                    setShowAnswerEditor(true);
                }}>
                <EditFilled /> <span className='ml-s'>Answer</span>
            </div>
            {show_answer_editor && (
                <AddAnswerForm
                    answer=''
                    handleSubmitForm={handleSubmitAnswer}
                    submitting_answer={submitting_answer}
                    handleCloseEditor={handleCloseEditor}
                    btn_text='Submit'
                />
            )}
        </div>
    );
};

export default SubmitAnswer;
