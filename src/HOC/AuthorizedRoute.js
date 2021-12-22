import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthorizedRoute = props => {
    return (
        <>
            {props.is_logged_in ? (
                <Route
                    exact={props.exact}
                    path={props.path}
                    render={render_props => <props.component {...render_props} {...props.appProps} />}
                />
            ) : (
                <Redirect to={`/?redirect=${props.location.pathname}${props.location.search}`} />
            )}
        </>
    );
};

export default AuthorizedRoute;
