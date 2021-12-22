import React from 'react';
import NoData from '../NoData/NoData';

const NotEnrolledContent = props => {
    return (
        <NoData
            className={props.className}
            image={props.image ? props.image : '/img/locked.png'}
            alt={props.alt ? props.alt : 'Not enrolled in course'}
            text={props.text ? props.text : 'This section is locked. Enroll into the course to access this.'}
            button={true}
            button_text={props.button_text ? props.button_text : 'Enroll Now'}
            button_url={props.button_url ? props.button_url : '/checkout/' + props.course_slug + '/'}
            button_size={props.button_size}
        />
    );
};

export default NotEnrolledContent;
