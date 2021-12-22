import React, { useEffect, useState, useRef } from 'react';
import { editor_array } from '../../../Constants/Values';
import { sleep } from '../../../Utils/HelperFunctions';

let animation_speed = 150;

const Editor = props => {
    const [editorConstantStrings, setEditorConstantStrings] = useState([]);
    const [editorVariableStrings, setEditorVariableStrings] = useState([]);
    const [anitmationArrIndex, setAnimationArrIndex] = useState(0);

    const isFirstVariableTextRun = useRef(true);

    const [variableTextIterIndex, setVariableTextIterIndex] = useState(0);

    const changeEditorVariableText = async () => {
        if (anitmationArrIndex >= editor_array.length) {
            return;
        }

        let variable_text = editor_array[anitmationArrIndex].variable_text;

        if (variable_text === '' && variable_text !== editorVariableStrings[anitmationArrIndex]) {
            setEditorVariableStrings([...editorVariableStrings, '']);
            return;
        }

        if (variable_text === editorVariableStrings[anitmationArrIndex]) {
            setVariableTextIterIndex(0);
            setAnimationArrIndex(anitmationArrIndex => anitmationArrIndex + 1);
            return;
        }
        if (variableTextIterIndex === 0) {
            await sleep(500);
        } else {
            await sleep(animation_speed);
        }

        let string_to_set =
            editorVariableStrings[anitmationArrIndex] !== undefined
                ? editorVariableStrings[anitmationArrIndex] + variable_text.charAt(variableTextIterIndex)
                : variable_text.charAt(variableTextIterIndex);

        setVariableTextIterIndex(variableTextIterIndex + 1);

        setEditorVariableStrings([...editorVariableStrings.slice(0, anitmationArrIndex), string_to_set]);
    };

    const changeEditorConstString = () => {
        if (anitmationArrIndex >= editor_array.length) {
            return;
        }
        let const_string = editor_array[anitmationArrIndex].constant_text;
        setEditorConstantStrings([...editorConstantStrings, const_string]);

        changeEditorVariableText();
    };

    useEffect(() => {
        changeEditorConstString();
    }, [anitmationArrIndex]);

    useEffect(() => {
        if (isFirstVariableTextRun.current) {
            isFirstVariableTextRun.current = false;
            return;
        }

        changeEditorVariableText();
    }, [editorVariableStrings]);

    const generateEditorParentBody = () => {
        const editor_content = editorConstantStrings.map((const_string, index) => (
            <div key={index} className='home-editor-line-parent'>
                {(index === anitmationArrIndex && variableTextIterIndex === 0) || index === editor_array.length - 1 ? (
                    index === editor_array.length - 1 ? (
                        <div className='home-editor-text wrap-width editor-cursor editor-cursor-end'>
                            {const_string}
                        </div>
                    ) : (
                        <div className='home-editor-text wrap-width editor-cursor'>{const_string}</div>
                    )
                ) : (
                    <div className='home-editor-text wrap-width'>{const_string}</div>
                )}
                {index === anitmationArrIndex ? (
                    <div className='home-editor-text home-editor-var-text wrap-width editor-cursor'>
                        {editorVariableStrings[index]}
                    </div>
                ) : (
                    <div className='home-editor-text home-editor-var-text wrap-width '>
                        {editorVariableStrings[index]}
                    </div>
                )}
            </div>
        ));

        return editor_content;
    };

    return (
        <div className='home-head-side-wrapper tab-hide flex-container align-center pl-l'>
            <div className='home-head-side position-relative'>
                <div className='home-head-background position-absolute'></div>
                <div className='home-head-foreground position-absolute'>
                    <div className='home-editor-navbar'>
                        <div className='close wrap-width'></div>
                        <div className='minimize wrap-width'></div>
                        <div className='maximize wrap-width'></div>
                    </div>
                    <div id='home-editor-body' className='home-editor-body'>
                        {generateEditorParentBody()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
