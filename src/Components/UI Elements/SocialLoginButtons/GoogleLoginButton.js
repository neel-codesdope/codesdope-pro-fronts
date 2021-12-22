import React from 'react';
import { message } from 'antd';
import { GOOGLE_LOGIN } from '../../../Constants/Urls';
import { GOOGLE_LOGIN_ERROR } from '../../../Constants/Messages';
import { loginAPI } from '../../../Utils/ApiCalls';
import { useStore } from '../../../Stores/SetStore';
import { GoogleLogin } from 'react-google-login';
import { GOOGLE_LOGIN_CLIENT_ID } from '../../../Constants/Values';
import { setSourceData } from '../../../Utils/HelperFunctions';

const GoogleLoginButton = props => {
    const [, dispatch] = useStore();
    const handleGoogleResponse = response => {
        let user_data = {
            token: response.tokenId
        };
        loginAPI(GOOGLE_LOGIN, user_data)
            .then(data => {
                props.onCancel();
                dispatch('changeProfileCompletion', data.token, data.id, data.user_profile_id);
                setSourceData(data.user_profile_id);
            })
            .catch(err => {
                message.error(GOOGLE_LOGIN_ERROR);
            });
    };

    const handleGoogleResponseFailure = response => {
        message.error(GOOGLE_LOGIN_ERROR);
    };
    return (
        <div className='center-align'>
            <GoogleLogin
                className='login-social-btn'
                clientId={GOOGLE_LOGIN_CLIENT_ID}
                icon={true}
                buttonText={<span className='login-social-btn-text pr pl'>Sign in with Google</span>}
                onSuccess={handleGoogleResponse}
                onFailure={handleGoogleResponseFailure}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
};

export default GoogleLoginButton;
