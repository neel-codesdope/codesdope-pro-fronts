import React from 'react';
import { Tooltip, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { copyTextToClipboard } from '../../../Utils/HelperFunctions';

const ReferralCode = props => {
    const copyReferralCode = () => {
        copyTextToClipboard(props.referral_code);
        message.success('Copied!');
    };

    return (
        <div className={props.className}>
            <span className='referral-code primary-color font-weight-500 pt pl pb pr mr-l'>{props.referral_code}</span>
            <Tooltip title='Copy code'>
                <CopyOutlined className='copy-icon cursor-pointer' onClick={copyReferralCode} />
            </Tooltip>
        </div>
    );
};

export default ReferralCode;
