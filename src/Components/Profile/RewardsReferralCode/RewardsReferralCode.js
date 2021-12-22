import React, { useState, useEffect } from 'react';
import { FETCH_REFERRAL_CODE } from '../../../Constants/Urls';
import { getAPI, interpolate } from '../../../Utils/ApiCalls';
import { convertToHigherCurrency, getUserProfileId } from '../../../Utils/HelperFunctions';
import ReferralCode from '../../UI Elements/ReferralCode/ReferralCode';
import { getInputSkeleton } from '../../UI Elements/Skeleton/GeneralSkeleton';
import { useStore } from '../../../Stores/SetStore';

const RewardsReferralCode = props => {
    const [AppStore, _] = useStore();
    const [referral_code, setReferralCode] = useState();
    const [referral_discount, setReferralDiscount] = useState();
    const [loading_referral_code, setLoadingReferralCode] = useState(false);

    useEffect(() => {
        setLoadingReferralCode(true);
        getAPI(interpolate(FETCH_REFERRAL_CODE, [getUserProfileId()]))
            .then(response => {
                setReferralCode(response.referral_code);
                setReferralDiscount(response.referral_discount);
                setLoadingReferralCode(false);
            })
            .catch(err => {
                setLoadingReferralCode(false);
            });
    }, []);

    const getReferralCodeSkeleton = () => <div className='center-align mt-l'>{getInputSkeleton('large', 150)}</div>;
    const getCreditsSkeleton = () => <div>{getInputSkeleton('large', 150)}</div>;

    return (
        <>
            <div className='profile-form'>
                <div className='default-card-neu pt-l pb-l pr-xl pl-xl'>
                    <h1>Credits</h1>
                    <div className='mt-l'>
                        <span>
                            <span className='course-overview-price-money primary-color'>
                                {AppStore.is_user_fetched
                                    ? convertToHigherCurrency(AppStore.credits)
                                    : getCreditsSkeleton()}
                            </span>
                        </span>
                    </div>
                    <p className='reward-points-text mt'>
                        Use available Reward Points to get discount on your next purchase.
                    </p>
                </div>
                <div className='default-card-neu pt-l pb-l pr-xl pl-xl mt-xxl'>
                    <h1>Refer and Earn</h1>
                    <p className='reward-points-text mt-l'>Share the following Referral Code with your friends.</p>
                    {!loading_referral_code ? (
                        <ReferralCode className='center-align mt-l' referral_code={referral_code} />
                    ) : (
                        getReferralCodeSkeleton()
                    )}
                    <p className='reward-points-text mt-l'>
                        For each purchase using this Referral Code, your friend will get{' '}
                        {referral_discount ? referral_discount + '%' : ''} discount and you will earn more Reward Points
                        which can be redeemed for getting discount on future purchases.
                    </p>
                </div>
            </div>
        </>
    );
};

export default RewardsReferralCode;
