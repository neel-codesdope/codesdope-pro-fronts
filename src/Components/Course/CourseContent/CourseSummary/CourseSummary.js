import React from 'react';
import { summaryCodeChange } from '../../../../Utils/summaryCodeChange';
import { NO_SUMMARY } from '../../../../Constants/Messages';
import { getParagraphSkeleton } from '../../../UI Elements/Skeleton/GeneralSkeleton';
import SummaryMarkdownRenderer from '../../../../HOC/SummaryMarkdownRenderer';
import NoData from '../../../UI Elements/NoData/NoData';
import { Helmet } from 'react-helmet';

const CourseSummary = props => {
    return (
        <>
            {props.selected_subtopic_name ? (
                <Helmet>
                    <title>{props.selected_protopic_name} | Summary - CodesDope Pro</title>
                    <meta name='description' content={`Summary of ${props.selected_protopic_name} - CodesDope Pro`} />
                </Helmet>
            ) : (
                <></>
            )}

            {!!props.summary ? (
                <div className='summary ml-xl mr-xl' onClick={summaryCodeChange}>
                    {!props.loading ? <SummaryMarkdownRenderer content={props.summary} /> : getParagraphSkeleton()}
                </div>
            ) : (
                <NoData image='/img/no-data1.png' alt='No summary' text={NO_SUMMARY} />
            )}
        </>
    );
};

export default CourseSummary;
