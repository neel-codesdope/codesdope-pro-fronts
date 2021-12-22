import React from 'react';
import { Route } from 'react-router-dom';
import NotEnrolledContent from '../Components/UI Elements/InaccessibleContent/NotEnrolledContent';
import NotLoggedInContent from '../Components/UI Elements/InaccessibleContent/NotLoggedInContent';
import { getParagraphSkeleton } from '../Components/UI Elements/Skeleton/GeneralSkeleton';

const CourseAuthorizedRoute = props => {
    return (
        <>
            {props.is_user_logged_in || !props.is_content_locked_when_logged_out ? (
                !props.loading_module ? (
                    !props.is_content_locked ? (
                        <Route
                            exact={props.exact}
                            path={props.path}
                            render={render_props => <props.component {...render_props} {...props.appProps} />}
                        />
                    ) : (
                        <Route
                            exact={props.exact}
                            render={render_props => (
                                <NotEnrolledContent course_slug={props.course_slug} {...render_props} />
                            )}
                        />
                    )
                ) : (
                    getParagraphSkeleton()
                )
            ) : (
                <NotLoggedInContent />
            )}
        </>
    );
};

export default CourseAuthorizedRoute;
