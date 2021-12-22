import React from 'react';
import { Tag } from 'antd';

const LanguageTag = props => {
    return (
        <Tag style={props.style} color={props.color || 'purple'} className={`${props.className} language-tag-text`}>
            {props.children}
        </Tag>
    );
};

export default LanguageTag;
