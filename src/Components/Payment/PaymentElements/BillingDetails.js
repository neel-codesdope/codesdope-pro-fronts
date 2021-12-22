import React from 'react';
import { Button } from 'antd';

const BillingDetails = props => {
    const handleSelectBillingDetails = () => {
        props.handleSelectBillingDetails(props.billing_detail);
    };

    return (
        <div
            className={
                'billing-detail-card default-card-neu pr pl mb-l ml mr ' +
                (props.selected_billing_details_id == props.billing_detail.id ? 'selected_billing-detail-card' : '')
            }
            key={props.billing_detail.id}>
            <div className='billing-card-inner-wrapper flex-container flex-column pr pl pt-l pb-l'>
                <div className='billing-detail-card-name font-weight-500'>{props.billing_detail.full_name}</div>
                <div>{props.billing_detail.address_1}</div>
                <div>{props.billing_detail.address_2}</div>
                <div>
                    <span>{props.billing_detail.city}</span>, <span>{props.billing_detail.state}</span>{' '}
                    <span>{props.billing_detail.pincode}</span>
                </div>
                <div>{props.billing_detail.country}</div>
                <div className='billimg-detail-btn-wrapper mt'>
                    <Button
                        className='edit-billing-detail-btn billing-detail-card-btn small-card-neu-hover mt'
                        onClick={() => props.handleOpenUpdateBillingDetailsForm(props.billing_detail)}>
                        Edit
                    </Button>
                    <Button
                        className='select-billing-detail-btn billing-detail-card-btn small-card-neu-hover float-right mt'
                        onClick={handleSelectBillingDetails}>
                        Select this address
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BillingDetails;
