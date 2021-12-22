import React, { useState, useEffect } from 'react';
import { MONGODB_DATABASE_OFFER, COURSE_ENROLLMENT_STATUS } from '../../Constants/Values';
import { FETCH_COURSE_ENROLLMENT_STATUS } from '../../Constants/Urls';
import { getAPI, interpolate } from '../../Utils/ApiCalls';
import { getData } from '../../Utils/MongoDBData';
import { useStore } from '../../Stores/SetStore';

const OfferTopBanner = props => {
    const [AppStore, dispatch] = useStore();
    const [banner, setBanner] = useState();
    const [course_enrollment_status, setCourseEnrollmentStatus] = useState();
    const [distance, setDistance] = useState(0);

    let course_slug = 'cpp';

    // Fetch courses enrolled from api
    useEffect(() => {
        if (AppStore.is_user_logged_in) {
            getAPI(interpolate(FETCH_COURSE_ENROLLMENT_STATUS, [course_slug]))
                .then(response => {
                    setCourseEnrollmentStatus(response.enrolled);
                })
                .catch(err => {});
        }
    }, [AppStore.is_user_logged_in]);

    useEffect(() => {
        (async () => {
            let banner_info = await getData(MONGODB_DATABASE_OFFER);
            setBanner(banner_info);
        })();
    }, []);

    useEffect(() => {
        if (
            (course_enrollment_status !== COURSE_ENROLLMENT_STATUS.ENROLLED || !AppStore.is_user_logged_in) &&
            !!banner
        ) {
            dispatch('showOfferBanner', banner.show_banner, course_slug);
        } else {
            dispatch('showOfferBanner', false, '');
        }
    }, [AppStore.is_user_logged_in, banner, course_enrollment_status]);

    useEffect(() => {
        if (!!banner && banner.show_counter && !!banner.counter_endtime) {
            let date = banner.counter_endtime,
                countDown = new Date(date).getTime(),
                x = setTimeout(function () {
                    let currentOffset = new Date().getTimezoneOffset();
                    let ISTOffset = 330;
                    let now = new Date(new Date().getTime() + (ISTOffset + currentOffset) * 60000),
                        distance = countDown - now;
                    setDistance(distance);
                }, 1000);
        }
    });

    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

    let days = Math.floor(distance / day);
    let hours = Math.floor((distance % day) / hour);
    let minutes = Math.floor((distance % hour) / minute);
    let seconds = Math.floor((distance % minute) / second);

    return (
        <>
            {(course_enrollment_status !== COURSE_ENROLLMENT_STATUS.ENROLLED || !AppStore.is_user_logged_in) &&
                !!banner &&
                banner.show_banner &&
                distance >= 0 && (
                    <a href={banner.link}>
                        <div id='top-banner-wrapper' className='top-banner-wrapper center-align pt pb pr pl'>
                            <div className='flex-container justify-center align-center'>
                                {!!banner.offer && (
                                    <div className='top-banner-offer position-relative wrap-width'>{banner.offer}</div>
                                )}
                                {!!banner.offer_subtext && (
                                    <div className='top-banner-offer-subtext wrap-width ml'>{banner.offer_subtext}</div>
                                )}
                                {!!banner.offer_text_line1 && (
                                    <div className='top-banner-offer-text-line1 pl'>{banner.offer_text_line1}</div>
                                )}
                            </div>
                            {!!banner.offer_text_line2 && (
                                <div className='top-banner-offer-text-line2'>{banner.offer_text_line2}</div>
                            )}
                            {!!banner.offer_text_line3 && (
                                <div className='top-banner-offer-text-line3 center-align pt-s pb-s'>
                                    {banner.offer_text_line3}
                                </div>
                            )}
                            {banner.show_counter && (
                                <div id='countdown' className='mt-s'>
                                    <ul>
                                        <li>
                                            <span id='days'>{days}</span>Days
                                        </li>
                                        <li>
                                            <span id='hours'>{hours}</span>Hours
                                        </li>
                                        <li>
                                            <span id='minutes'>{minutes}</span>Min
                                        </li>
                                        <li>
                                            <span id='seconds'>{seconds}</span>Sec
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </a>
                )}
        </>
    );
};

export default OfferTopBanner;
