import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const CircularSpinner = props => {
    const spinner_icon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
        <div className='center-align'>
            <Spin indicator={spinner_icon} />
        </div>
    );
};

export default CircularSpinner;
