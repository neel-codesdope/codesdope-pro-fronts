import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COURSE_ENROLLMENT_STATUS } from '../../Constants/Values';
import { FETCH_COURSE_FINAL_PRICE } from '../../Constants/Urls';
import { getAPI, interpolate } from '../../Utils/ApiCalls';
import { convertCurrency, isEmptyObject } from '../../Utils/HelperFunctions';
import { useStore } from '../../Stores/SetStore';

const RegularOfferTopBanner = props => {
    const [AppStore, _] = useStore();
    const [course, setCourse] = useState({});

    useEffect(() => {
        if (
            ((!!props.course_enrollment_status &&
                props.course_enrollment_status !== COURSE_ENROLLMENT_STATUS.ENROLLED) ||
                !AppStore.is_user_logged_in) &&
            !AppStore.offer_banner.show_offer_banner
        ) {
            getAPI(interpolate(FETCH_COURSE_FINAL_PRICE, [props.course_slug]), {}, AppStore.is_user_logged_in)
                .then(response => {
                    setCourse({
                        course_price: response.price,
                        course_original_price: response.original_price,
                        course_name: response.name
                    });
                })
                .catch(err => {});
        } else {
            setCourse({});
        }
    }, [AppStore.is_user_logged_in, AppStore.offer_banner, props.course_enrollment_status]);

    return (
        <>
            {!isEmptyObject(course) && (
                <Link to={'/checkout/' + props.course_slug}>
                    <div id='top-banner-wrapper' className='top-banner-wrapper center-align pt-l pb-l pr pl mb'>
                        <div className='regular-top-banner-offer-text regular-top-banner-line1'>
                            Enroll in {course.course_name} course
                        </div>
                        <div className='regular-top-banner-offer-text mt-s flex-container justify-center align-center'>
                            for
                            <div className='regular-top-banner-price wrap-width ml'>
                                INR {convertCurrency(course.course_price)}
                            </div>
                            {course.course_price !== course.course_original_price && (
                                <div className='regular-top-banner-original-price wrap-width ml'>
                                    INR {convertCurrency(course.course_original_price)}
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            )}
        </>
    );
};

export default RegularOfferTopBanner;
