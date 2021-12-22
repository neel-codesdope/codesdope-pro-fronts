import React from 'react';
import CourseRating from '../CourseRating';

const RateButtonPrimary = props => {
    return (
        <div className={props.className + ' clear-both center-align'}>
            <div className='rate-course-btn-primary wrap-width pt pb pr-xl pl-xl'>
                <div className='rate-course-btn-heading mb-s'>Rate this course</div>
                <CourseRating
                    course_slug={props.course_slug}
                    course_name={props.course_name}
                    rating={props.rating}
                    feedback={props.feedback}
                    setRatingSubmitted={props.setRatingSubmitted}
                />
            </div>
        </div>
    );
};

export default RateButtonPrimary;
