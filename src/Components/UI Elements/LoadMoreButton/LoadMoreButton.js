import React from 'react';
import { Button } from 'antd';

const LoadMoreButton = props => (
    <div
        style={{
            textAlign: 'center',
            marginTop: 12,
            marginBottom: 20,
            height: 32,
            lineHeight: '32px'
        }}>
        <Button onClick={props.onButtonClick}>{props.btn_text}</Button>
    </div>
);

export default LoadMoreButton;
