import React from 'react';
import { withRouter } from 'react-router-dom';
import NotFoundPage from '../Components/UI Elements/NotFoundPage/NotFoundPage';

const ErrorHandlerWrapper = props => {
    if (props.error === 404) {
        return <NotFoundPage />;
    }
    if (props.error === 400) {
        props.history.push('/');
    }
    return props.children;
};

export default withRouter(ErrorHandlerWrapper);
