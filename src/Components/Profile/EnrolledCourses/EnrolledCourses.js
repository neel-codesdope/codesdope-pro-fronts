import React, { useEffect, useState } from 'react';
import { FETCH_USER_COURSES } from '../../../Constants/Urls';
import { getAPI, interpolate } from '../../../Utils/ApiCalls';
import { getUserProfileId, isArrayEmpty } from '../../../Utils/HelperFunctions';
import { getImageSkeleton, getInputSkeleton, getButtonSkeleton } from '../../UI Elements/Skeleton/GeneralSkeleton';
import NoData from '../../UI Elements/NoData/NoData';
import EnrolledCourse from './EnrolledCourse';

const EnrolledCourses = props => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch courses enrolled from api
    useEffect(() => {
        setLoading(true);
        getAPI(interpolate(FETCH_USER_COURSES, [getUserProfileId()]))
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    }, []);

    const getCourseSkeleton = () => (
        <>
            <div className='enrolled-course default-card-neu center-align pr pl pt-l pb-l mb-l mr-l'>
                <div className='home-course-card-img-wrapper'>{getImageSkeleton()}</div>
                <h2 className='center-align mt'>{getInputSkeleton('small', 150)}</h2>
                {getButtonSkeleton('default', 'default')}
            </div>
            <div className='enrolled-course default-card-neu center-align pr pl pt-l pb-l mb-l mr-l'>
                <div className='home-course-card-img-wrapper'>{getImageSkeleton()}</div>
                <h2 className='center-align mt'>{getInputSkeleton('small', 150)}</h2>
                {getButtonSkeleton('default', 'default')}
            </div>
            <div className='enrolled-course default-card-neu center-align pr pl pt-l pb-l mb-l mr-l'>
                <div className='home-course-card-img-wrapper'>{getImageSkeleton()}</div>
                <h2 className='center-align mt'>{getInputSkeleton('small', 150)}</h2>
                {getButtonSkeleton('default', 'default')}
            </div>
        </>
    );

    const getCoursesList = () => {
        const courses_list = courses.map(course => <EnrolledCourse course={course} courses={courses} />);
        return courses_list;
    };

    return (
        <>
            <div className='profile-form enrolled-courses-wrapper pb-l pl-xl pr-xl'>
                <div className='enrolled-courses flex-container flex-row flex-wrap justify-center'>
                    {loading ? (
                        getCourseSkeleton()
                    ) : !isArrayEmpty(courses) ? (
                        getCoursesList()
                    ) : (
                        <NoData
                            image='/img/no_data.png'
                            alt='No course enrolled'
                            text="Oops! You haven't enrolled in any course"
                            button={true}
                            button_text='Explore Courses'
                            button_url='/'
                            button_size='large'
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default EnrolledCourses;
