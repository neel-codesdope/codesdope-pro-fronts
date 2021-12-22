import React from 'react';
import { withRouter } from 'react-router-dom';
import Course from './Course/Course';

const CoursesList = props => {
    const courses_list = props.courses.map(course => (
        <Course
            course={course}
            key={course.id}
            enrolled_courses={props.enrolled_courses}
            isCourseEnrolled={props.isCourseEnrolled}
        />
    ));
    return courses_list;
};

export default withRouter(CoursesList);
