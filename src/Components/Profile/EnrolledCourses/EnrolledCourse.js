import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { RETRIEVE_COURSE_RATING } from '../../../Constants/Urls';
import { getAPI, interpolate } from '../../../Utils/ApiCalls';
import { isEmptyObject } from '../../../Utils/HelperFunctions';
import CourseProgress from '../../UI Elements/CourseProgress/CourseProgress';
import CourseRating from '../../UI Elements/CourseRating/CourseRating';

const EnrolledCourse = props => {
    const [rating_data, setRatingData] = useState();

    //Fetch course ratings
    useEffect(() => {
        getAPI(interpolate(RETRIEVE_COURSE_RATING, [props.course.slug]))
            .then(data => {
                setRatingData(data);
            })
            .catch(err => {});
    }, []);

    return (
        <>
            <div className='enrolled-course default-card-neu center-align mb-l mr-l' key={props.course.id}>
                <div className='profile-course-card-img-wrapper'>
                    <img src={props.course.image} alt={props.course.name} />
                </div>
                <div className='pt pb-s pr pl'>
                    <h2 className='center-align mt'>{props.course.name}</h2>
                    <CourseProgress course_slug={props.course.slug} className='pl pr' />
                    <Button className='continue-learning-btn small-card-neu-hover mt-s'>
                        <Link to={'/courses/' + props.course.slug + '/' + props.course.first_subtopic_of_course + '/'}>
                            Continue Learning
                        </Link>
                    </Button>
                </div>
                <div className='course-rating-wrapper pt-s pb-s mt-l'>
                    <div className='course-rating-heading'>Rate this course</div>
                    <CourseRating
                        course_slug={props.course.slug}
                        course_name={props.course.name}
                        rating={!isEmptyObject(rating_data) ? rating_data.rating : {}}
                        feedback={!isEmptyObject(rating_data) ? rating_data.feedback : {}}
                    />
                </div>
            </div>
        </>
    );
};

export default EnrolledCourse;
