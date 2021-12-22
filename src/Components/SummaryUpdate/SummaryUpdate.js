import React, { useEffect, useState } from 'react';
import SummaryMarkdown from '../../HOC/SummaryMarkdownRenderer';
import { getAPI, postAPI, interpolate } from '../../Utils/ApiCalls';
import { useParams } from 'react-router-dom';
import { TOPIC_DETAIL } from '../../Constants/Urls';
import { AUTOSAVE_STATUS, SUMMARY_AUTOSAVE_DURATION } from '../../Constants/Values';
import LoadingSpinner from '../UI Elements/LoadingSpinner';
import Editor from 'cdmd-editor';
import 'cdmd-editor/dist/index.css';

const SummaryUpdate = props => {
    const { topic_slug } = useParams();
    const [summary, setSummary] = useState(undefined);
    const [autosaveStatus, setAutosaveStatus] = useState(AUTOSAVE_STATUS.IDLE);

    useEffect(() => {
        getAPI(interpolate(TOPIC_DETAIL, [topic_slug]))
            .then(response => {
                setSummary(response.summary);
            })
            .catch(err => {});
    }, []);

    useEffect(() => {
        const delayDebounceFn = () => {
            updateSummary();
        };
        let debouncer = setTimeout(() => {
            delayDebounceFn();
        }, SUMMARY_AUTOSAVE_DURATION);

        setAutosaveStatus(AUTOSAVE_STATUS.CHANGES_NOT_SAVED);

        return () => {
            clearTimeout(debouncer);
        };
    }, [summary]);

    const handleChange = obj => {
        setSummary(obj.text);
    };

    const updateSummary = () => {
        let data = { summary };

        postAPI(interpolate(TOPIC_DETAIL, [topic_slug]), data, 'patch')
            .then(data => {
                setAutosaveStatus(AUTOSAVE_STATUS.CHANGES_SAVED);
            })
            .catch(err => {});
    };

    return (
        <div style={{ padding: 20 }}>
            <p>{autosaveStatus}</p>
            <Editor rows={20} onChange={handleChange} value={summary || ''} />
            <div className='summary'>
                {summary !== undefined ? <SummaryMarkdown content={summary || ''} /> : <LoadingSpinner />}
            </div>
        </div>
    );
};

export default SummaryUpdate;
