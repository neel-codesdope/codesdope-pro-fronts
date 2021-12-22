import React, { useState } from 'react';
import { getParagraphSkeleton } from '../../UI Elements/Skeleton/GeneralSkeleton';
import BillingDetails from './BillingDetails';

const BillingDetailsList = props => {
    const [selected_billing_details_id, setSelectedBillingDetailsId] = useState();

    const handleSelectBillingDetails = data => {
        setSelectedBillingDetailsId(data.id);
        props.handleSelectBillingDetails(data);
    };

    const getBillingDetailsList = () => {
        const billing_details_list = props.billing_details.map(billing_detail => (
            <BillingDetails
                key={billing_detail.id}
                billing_detail={billing_detail}
                handleOpenUpdateBillingDetailsForm={props.handleOpenUpdateBillingDetailsForm}
                handleSelectBillingDetails={handleSelectBillingDetails}
                selected_billing_details_id={selected_billing_details_id}
            />
        ));
        return billing_details_list;
    };

    const getBillingDetailsSkeleton = () => (
        <div className='billing-detail-card default-card-neu flex-container flex-column align-center justify-center cursor-pointer pr pl mb-l ml mr'>
            <div className='billing-card-inner-wrapper pr pl pt-l pb-l'>{getParagraphSkeleton()}</div>
        </div>
    );

    return (
        <div className='profile-form place-center mt-xxxl pb-l'>
            <div className='flex-container flex-row flex-wrap justify-center'>
                {!props.loading_billing_details ? getBillingDetailsList() : getBillingDetailsSkeleton()}
                <div
                    className='billing-detail-card default-card-neu cursor-pointer pr pl mb-l ml mr'
                    onClick={props.handleOpenAddBillingDetailsForm}>
                    <div className='billing-card-inner-wrapper flex-container flex-column align-center justify-center pr pl pt-l pb-l'>
                        <div className='add-billing-detail-icon'>
                            <i className='fa fa-plus' aria-hidden='true'></i>
                        </div>
                        <div className='add-billing-detail-text'>Add a new address</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingDetailsList;
