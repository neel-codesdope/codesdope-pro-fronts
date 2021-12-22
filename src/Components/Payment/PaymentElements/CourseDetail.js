import React from 'react';
import { isArrayEmpty } from '../../../Utils/HelperFunctions';
import { getInputSkeleton } from '../../UI Elements/Skeleton/GeneralSkeleton';

const CourseDetail = props => {
    const getCourseSkeleton = () => (
        <div>
            <div className='flex-container align-center mt-l'>
                <span className='mr-l'>{getInputSkeleton('small', 75, 30)}</span>
                <span className=''>{getInputSkeleton('small', 100)}</span>
            </div>
            <div className='mt-l'>
                <div className='mt-s'>{getInputSkeleton('small', 200, 15)}</div>
                <div className='mt-s'>{getInputSkeleton('small', 200, 15)}</div>
            </div>
        </div>
    );

    return (
        <div className='default-card-neu place-center pt-l pb-l pl-xl pr-xl'>
            <h2>Order Details</h2>
            {!props.loading_course_details ? (
                <div>
                    <div className='flex-container align-center mt-l'>
                        {!!props.course.image && (
                            <div className='payment-course-img-wrapper'>
                                <img
                                    className='flex-container'
                                    src={props.course.image}
                                    alt={props.course.name + ' image'}
                                />
                            </div>
                        )}
                        <div>
                            {props.course.name && (
                                <span className='payment-course-name font-weight-500 ml'>{props.course.name}</span>
                            )}
                            <span className='ml'>
                                (
                                {!isArrayEmpty(props.course.language) &&
                                    props.course.language.map(language_item => (
                                        <span className='payment-course-language' key={language_item.id}>
                                            {language_item.name}
                                        </span>
                                    ))}
                                )
                            </span>
                        </div>
                    </div>
                    {/* details */}
                    {!!props.course.course_details && (
                        <div className='flex-container flex-wrap mt-l'>
                            {Object.keys(props.course.course_details).map((course_detail_key, index) => (
                                <div className='payment-course-detail wrap-width mr-l'>
                                    <span className='course-detail-value mr-s'>
                                        {props.course.course_details[course_detail_key]}
                                    </span>
                                    <span className='course-detail-key'>{course_detail_key}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* features */}
                    {!isArrayEmpty(props.course.features) && (
                        <div className='mt pt'>
                            <h3>Course Features</h3>
                            <div className='mt'>
                                {props.course.features
                                    .sort((a, b) => a.order - b.order)
                                    .map(
                                        feature =>
                                            !!feature.show_at_payment && (
                                                <div className='payment-course-feature mt-s' key={feature.id}>
                                                    <i class='fa fa-check mr-s primary-color'></i>
                                                    {feature.name}
                                                </div>
                                            )
                                    )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                getCourseSkeleton()
            )}
        </div>
    );
};

export default CourseDetail;
