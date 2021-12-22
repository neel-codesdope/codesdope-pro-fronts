import React from 'react';
import { withRouter } from 'react-router-dom';
import NoData from '../NoData/NoData';

const NotLoggedInContent = props => {
    return (
        <NoData
            image='/img/locked.png'
            alt='Not logged in'
            text='This section is locked. Please login to access this.'
            button={true}
            button_text='Login'
            button_url={`/?redirect=${props.location.pathname}${props.location.search}`}
        />
    );
};

export default withRouter(NotLoggedInContent);
