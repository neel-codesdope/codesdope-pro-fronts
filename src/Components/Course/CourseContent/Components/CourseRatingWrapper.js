import React, { useState, useEffect } from 'react';
import { RETRIEVE_COURSE_RATING } from '../../../../Constants/Urls';
import { getAPI, interpolate } from '../../../../Utils/ApiCalls';
import { useStore } from '../../../../Stores/SetStore';
import RateButtonPrimary from '../../../UI Elements/CourseRating/Buttons/RateButtonPrimary';

const CourseRatingWrapper = props => {
    const [AppStore, _] = useStore();
    const [rating, setRating] = useState();
    const [feedback, setFeedback] = useState();
    const [is_submitted, setIsSubmitted] = useState(false);

    //Fetch course ratings
    useEffect(() => {
        getAPI(interpolate(RETRIEVE_COURSE_RATING, [props.course_slug]))
            .then(data => {
                setRating(data.rating);
                setFeedback(data.feedback);
            })
            .catch(err => {});
    }, []);

    const getCourseName = () => {
        let course_name = '';
        AppStore.courses.forEach(function (course) {
            if (course.slug === props.course_slug) {
                course_name = course.name;
            }
        });
        return course_name;
    };

    const setRatingSubmitted = value => {
        setIsSubmitted(value);
    };

    return (
        <>
            {!rating && !is_submitted && (
                <RateButtonPrimary
                    className='pt-xxl'
                    course_slug={props.course_slug}
                    course_name={getCourseName()}
                    rating={rating}
                    feedback={feedback}
                    setRatingSubmitted={setRatingSubmitted}
                />
            )}
        </>
    );
};

export default CourseRatingWrapper;
