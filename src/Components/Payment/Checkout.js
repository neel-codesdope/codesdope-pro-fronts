import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Alert, Tag, Switch, Row, Col, message } from 'antd';
import { WalletFilled } from '@ant-design/icons';
import {
    FETCH_BILLING_DETAIL,
    UPDATE_BILLING_DETAIL,
    FETCH_COURSE_OVERVIEW,
    CREATE_ORDER,
    ORDER_STATUS,
    APPLY_REFERRAL_CODE
} from '../../Constants/Urls';
import { SAVE_BILLING_DETAILS_SUCCESS, UPDATE_BILLING_DETAILS_SUCCESS } from '../../Constants/Messages';
import {
    COURSE_ENROLLMENT_STATUS,
    RAZORPAY_PAYMENT_KEY,
    PAYMENT_STATUS_ENUM,
    PAYMENT_ALERT_MESSAGE,
    INITIAL_PAYMENT_ALERT_MESSAGE
} from '../../Constants/Values';
import { getAPI, postAPI, interpolate } from '../../Utils/ApiCalls';
import {
    isArrayEmpty,
    isEmptyObject,
    convertCurrency,
    convertToHigherCurrency,
    convertToLowerCurrency,
    fetchModules,
    returnStoredModules,
    getUserFullName
} from '../../Utils/HelperFunctions';
import { getInputSkeleton } from '../UI Elements/Skeleton/GeneralSkeleton';
import LoadingSpinner from '../UI Elements/LoadingSpinner';
import ErrorHandlerWrapper from '../../HOC/ErrorHandlerWrapper';
import CourseDetail from './PaymentElements/CourseDetail';
import SubmitBillingDetailsForm from './PaymentElements/SubmitBillingDetailsForm';
import BillingDetailsList from './PaymentElements/BillingDetailsList';
import InlineForm from '../UI Elements/Forms/InlineForm';
import InlineNumberForm from '../UI Elements/Forms/InlineNumberForm';
import { useStore } from '../../Stores/SetStore';
import { Helmet } from 'react-helmet';
import { GtagReportConversion } from '../../Utils/Analytics';

const Checkout = props => {
    const [AppStore, dispatch] = useStore();
    const { course_slug } = useParams();
    const [course, setCourse] = useState({});
    const [price_breakup, setPriceBreakup] = useState({});
    const [modules, setModules] = useState([]);
    const [payment_current_index, setPaymentCurrentIndex] = useState(0);
    const [billing_details, setBillingDetails] = useState([]);
    const [form_data, setFormData] = useState('');
    const [selected_billing_details, setSelectedBillingDetails] = useState({});
    const [referral_code, setReferralCode] = useState('');
    const [credits, setCredits] = useState();
    const [available_credits, setAvailableCredits] = useState();
    const [alert, setAlert] = useState({
        show: false
    });
    const [paid_order, setPaidOrder] = useState();
    const [show_add_details_form, setShowAddDetailsForm] = useState(false);
    const [show_update_details_form, setShowUpdateDetailsForm] = useState(false);
    const [show_submit_referral_form, setShowSubmitReferralForm] = useState(false);
    const [show_credits_form, setShowCreditsForm] = useState(false);
    const [isLaptop, setIsLaptop] = useState(window.innerWidth > 1140 ? true : false);
    const [loading_course_details, setLoadingCourseDetails] = useState(false);
    const [loading_course_price, setLoadingCoursePrice] = useState(false);
    const [loading_modules, setLoadingModules] = useState(false);
    const [loading_billing_details, setLoadingBillingDetails] = useState(false);
    const [loading_payment_window, setLoadingPaymentWindow] = useState(false);
    const [loading_payment_result, setLoadingPaymentResult] = useState(false);
    const [disable_payment_btn, setDisablePaymentBtn] = useState(false);
    const [submitting_referral_code, setSubmittingReferralCode] = useState(false);
    const [submitting_credits, setSubmittingCredits] = useState(false);
    const [referral_code_success, setReferralCodeSuccess] = useState(false);
    const [error, setError] = useState();
    const addBillingFormReference = useRef();
    const updateBillingFormReference = useRef();

    window.addEventListener('resize', () => {
        setIsLaptop(window.innerWidth > 1140);
    });

    useEffect(() => {
        if (AppStore.is_user_fetched) {
            setAvailableCredits(AppStore.credits);
        }
    }, [AppStore.credits, AppStore.is_user_fetched]);

    useEffect(() => {
        setLoadingCourseDetails(true);
        getAPI(interpolate(FETCH_COURSE_OVERVIEW, [course_slug]), {}, AppStore.is_user_logged_in)
            .then(response => {
                setCourse({
                    name: response.name,
                    image: response.image,
                    language: response.language,
                    enrolled: response.enrolled,
                    course_details: response.course_details,
                    features: response.features
                });
                setPriceBreakup({
                    base_price: response.course_fee,
                    discount: response.discount,
                    price_after_discount: response.course_amount_before_tax,
                    tax_percentage: response.tax,
                    tax_amount: response.tax_amount,
                    total_amount: response.total_amount,
                    campus_discount_amount: response.campus_discount_amount
                });
                setPaidOrder(response.total_amount > 0);
                setLoadingCourseDetails(false);
                setError();
            })
            .catch(err => {
                setLoadingCourseDetails(false);
                setError(err.response.status);
            });
    }, []);

    useEffect(() => {
        setLoadingBillingDetails(true);
        getAPI(FETCH_BILLING_DETAIL)
            .then(response => {
                setBillingDetails(response);
                setLoadingBillingDetails(false);
            })
            .catch(err => {
                setLoadingBillingDetails(false);
            });
    }, []);

    // Fetch course module
    useEffect(() => {
        let { course_modules, _ } = returnStoredModules(AppStore.course_modules_list, course_slug);
        if (!isArrayEmpty(course_modules)) {
            setModules(course_modules);
        } else {
            setLoadingModules(true);
            fetchModules(course_slug, AppStore.is_user_logged_in)
                .then(data => {
                    setModules(data.result);
                    dispatch('setCourseModules', course_slug, data);
                    setError();
                    setLoadingModules(false);
                })
                .catch(err => {
                    setError(err.response.status);
                    setLoadingModules(false);
                });
        }
    }, []);

    const scrollToRef = ref => {
        if (!!ref) {
            window.scrollTo(0, ref.current.offsetTop);
        }
    };

    const next = () => {
        const payment_current_index_returned = payment_current_index + 1;
        setPaymentCurrentIndex(payment_current_index_returned);
    };

    const prev = () => {
        const payment_current_index_returned = payment_current_index - 1;
        setPaymentCurrentIndex(payment_current_index_returned);
    };

    const redirectToCourse = modules => {
        if (course_slug === 'cpp') {
            props.history.push('/courses/' + course_slug + '/' + modules[0].protopics[2].subtopics[0].slug + '/');
        } else {
            props.history.push('/courses/' + course_slug + '/' + modules[0].protopics[0].subtopics[0].slug + '/');
        }
    };

    const handleRedirectToCourse = () => {
        fetchModules(course_slug, AppStore.is_user_logged_in)
            .then(data => {
                dispatch('setCourseModules', course_slug, data);
                setLoadingPaymentResult(false);
                redirectToCourse(data.result);
            })
            .catch(err => {
                setLoadingPaymentResult(false);
            });
    };

    const getPaymentResponse = (response, order_id) => {
        setLoadingPaymentResult(true);
        postAPI(interpolate(ORDER_STATUS, [order_id]))
            .then(response => {
                if (response.status === PAYMENT_STATUS_ENUM.PENDING) {
                    setDisablePaymentBtn(true);
                    setAlert({
                        show: true,
                        status: PAYMENT_STATUS_ENUM.PENDING,
                        type: 'info'
                    });
                    setLoadingPaymentResult(false);
                }
                if (response.status === PAYMENT_STATUS_ENUM.SUCCESS) {
                    setDisablePaymentBtn(true);
                    setAlert({
                        show: true,
                        status: PAYMENT_STATUS_ENUM.SUCCESS,
                        type: 'success'
                    });
                    handleRedirectToCourse();
                }
                if (response.status === PAYMENT_STATUS_ENUM.FAILED) {
                    setAlert({
                        show: true,
                        status: PAYMENT_STATUS_ENUM.FAILED,
                        type: 'error'
                    });
                    setLoadingPaymentResult(false);
                }
            })
            .catch(err => {
                setLoadingPaymentResult(false);
            });
    };

    const makePayment = (order_id, order_amount, order_currency) => {
        var options = {
            key: RAZORPAY_PAYMENT_KEY,
            order_id: order_id,
            amount: order_amount,
            currency: order_currency,
            name: 'CodesDope',
            description: 'Purchase Course',
            image: '/img/logo.svg',
            readonly: {
                email: true,
                contact: true
            },
            theme: {
                color: '#802bb1'
            },
            modal: {
                confirm_close: true
            },
            timeout: 300,
            send_sms_hash: true,
            handler: function (response) {
                getPaymentResponse(response, order_id);
            }
        };
        options.prefill = {};
        options.prefill.name = selected_billing_details.full_name;
        options.prefill.email = selected_billing_details.email;
        options.prefill.contact = selected_billing_details.phone_number;
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
        setLoadingPaymentWindow(false);
    };

    const handlePayment = () => {
        setAlert({ status: false });
        setLoadingPaymentWindow(true);
        let data = { user_billing_id: selected_billing_details.id };
        if (!!referral_code) {
            data.referral_code = referral_code;
        }
        if (!!credits) {
            data.credits_applied = credits;
        }
        postAPI(interpolate(CREATE_ORDER, [course_slug]), data)
            .then(response => {
                if (response.paid_order) {
                    makePayment(response.order_id, response.order_amount, response.order_currency);
                } else {
                    setDisablePaymentBtn(true);
                    setAlert({
                        show: true,
                        status: PAYMENT_STATUS_ENUM.SUCCESS,
                        type: 'success'
                    });
                    handleRedirectToCourse();
                    setLoadingPaymentWindow(false);
                }
            })
            .catch(err => {
                setLoadingPaymentWindow(false);
            });
        // Google Ads traking
        GtagReportConversion();
    };

    const handleAddBillingDetails = data => {
        return new Promise((resolve, reject) => {
            postAPI(FETCH_BILLING_DETAIL, data, 'POST')
                .then(response => {
                    setBillingDetails(prevState => {
                        let billing_details_data = [...prevState];
                        billing_details_data.unshift(response);
                        return billing_details_data;
                    });
                    setShowAddDetailsForm(false);
                    message.success(SAVE_BILLING_DETAILS_SUCCESS);
                    resolve();
                })
                .catch(err => {
                    reject();
                });
        });
    };

    const handleUpdateBillingDetails = (data, data_id) => {
        return new Promise((resolve, reject) => {
            postAPI(interpolate(UPDATE_BILLING_DETAIL, [data_id]), data, 'PATCH')
                .then(response => {
                    setShowUpdateDetailsForm(false);
                    message.success(UPDATE_BILLING_DETAILS_SUCCESS);
                    setLoadingBillingDetails(true);
                    getAPI(FETCH_BILLING_DETAIL)
                        .then(response => {
                            setBillingDetails(response);
                            setLoadingBillingDetails(false);
                        })
                        .catch(err => {
                            setLoadingBillingDetails(false);
                        });
                    resolve();
                })
                .catch(err => {
                    reject();
                });
        });
    };

    const handleApplyReferralCode = code => {
        setSubmittingReferralCode(true);
        let data = {};
        data.referral_code = code;
        data.credits_applied = credits;
        return new Promise((resolve, reject) => {
            postAPI(interpolate(APPLY_REFERRAL_CODE, [course_slug]), data)
                .then(response => {
                    setPriceBreakup({
                        base_price: response.course_fee,
                        discount: response.course_discount,
                        referral_discount: response.referral_discount,
                        credits_discount: response.credits_used,
                        price_after_discount: response.course_amount_after_applying_credits,
                        tax_percentage: response.tax,
                        tax_amount: response.tax_amount,
                        total_amount: response.course_amount_after_tax,
                        campus_discount_amount: response.campus_discount
                    });
                    setAvailableCredits(response.credits_left);
                    setReferralCode(data.referral_code);
                    setCredits(response.credits_used);
                    setPaidOrder(response.paid_order);
                    setSubmittingReferralCode(false);
                    setShowSubmitReferralForm(false);
                    setReferralCodeSuccess(true);
                    resolve();
                })
                .catch(err => {
                    setSubmittingReferralCode(false);
                    reject();
                });
        });
    };

    const handleRemoveReferralCode = () => {
        setReferralCodeSuccess(false);
        setLoadingCoursePrice(true);

        let data = {};
        data.credits_applied = credits;
        postAPI(interpolate(APPLY_REFERRAL_CODE, [course_slug]), data)
            .then(response => {
                setPriceBreakup({
                    base_price: response.course_fee,
                    discount: response.course_discount,
                    referral_discount: response.referral_discount,
                    credits_discount: response.credits_used,
                    price_after_discount: response.course_amount_after_applying_credits,
                    tax_percentage: response.tax,
                    tax_amount: response.tax_amount,
                    total_amount: response.course_amount_after_tax,
                    campus_discount_amount: response.campus_discount
                });
                setAvailableCredits(response.credits_left);
                setReferralCode('');
                setCredits(response.credits_used);
                setPaidOrder(response.paid_order);
                setLoadingCoursePrice(false);
            })
            .catch(err => {
                setLoadingCoursePrice(false);
            });
    };

    const handleApplyCredits = credits => {
        setSubmittingCredits(true);
        let data = {};
        data.credits_applied = Math.round(convertToLowerCurrency(credits));
        if (!!referral_code) {
            data.referral_code = referral_code;
        }
        return new Promise((resolve, reject) => {
            postAPI(interpolate(APPLY_REFERRAL_CODE, [course_slug]), data)
                .then(response => {
                    setPriceBreakup({
                        base_price: response.course_fee,
                        discount: response.course_discount,
                        referral_discount: response.referral_discount,
                        credits_discount: response.credits_used,
                        price_after_discount: response.course_amount_after_applying_credits,
                        tax_percentage: response.tax,
                        tax_amount: response.tax_amount,
                        total_amount: response.course_amount_after_tax,
                        campus_discount_amount: response.campus_discount
                    });
                    setAvailableCredits(response.credits_left);
                    setCredits(response.credits_used);
                    setPaidOrder(response.paid_order);
                    setSubmittingCredits(false);
                    resolve();
                })
                .catch(err => {
                    setSubmittingCredits(false);
                    reject();
                });
        });
    };

    const handleRemoveCredits = () => {
        setLoadingCoursePrice(true);

        let data = {};
        data.credits_applied = 0;
        if (!!referral_code) {
            data.referral_code = referral_code;
        }
        postAPI(interpolate(APPLY_REFERRAL_CODE, [course_slug]), data)
            .then(response => {
                setPriceBreakup({
                    base_price: response.course_fee,
                    discount: response.course_discount,
                    referral_discount: response.referral_discount,
                    credits_discount: response.credits_used,
                    price_after_discount: response.course_amount_after_applying_credits,
                    tax_percentage: response.tax,
                    tax_amount: response.tax_amount,
                    total_amount: response.course_amount_after_tax,
                    campus_discount_amount: response.campus_discount
                });
                setAvailableCredits(response.credits_left);
                setCredits(response.credits_used);
                setPaidOrder(response.paid_order);
                setLoadingCoursePrice(false);
            })
            .catch(err => {
                setLoadingCoursePrice(false);
            });
    };

    const handleOpenAddBillingDetailsForm = () => {
        setShowUpdateDetailsForm(false);
        setFormData(
            AppStore.is_user_fetched
                ? {
                      email: AppStore.user.user.email,
                      full_name: getUserFullName(AppStore.user.user.first_name, AppStore.user.user.last_name)
                  }
                : {}
        );
        setShowAddDetailsForm(true);
        scrollToRef(addBillingFormReference);
    };

    const handleCloseAddBillingDetailsForm = () => {
        setShowAddDetailsForm(false);
    };

    const handleOpenUpdateBillingDetailsForm = data => {
        setShowAddDetailsForm(false);
        setFormData(data);
        setShowUpdateDetailsForm(true);
        scrollToRef(updateBillingFormReference);
    };

    const handleCloseUpdateBillingDetailsForm = () => {
        setShowUpdateDetailsForm(false);
    };

    const handleSelectBillingDetails = data => {
        setSelectedBillingDetails(data);
        next();
    };

    const handleOpenReferralForm = () => {
        setShowSubmitReferralForm(true);
    };

    const handleCreditsSwitchChange = is_checked => {
        if (is_checked) {
            setShowCreditsForm(true);
        } else {
            setShowCreditsForm(false);
            handleRemoveCredits();
        }
    };

    const handleGoBack = () => {
        prev();
        if (alert.status === PAYMENT_STATUS_ENUM.FAILED) {
            setAlert({ show: false });
        }
    };

    const getReferralAndCredits = () => (
        <div>
            {/* Referral code */}
            <div className='place-center mt-l pt-l pb-l pl pr'>
                {show_submit_referral_form ? (
                    <div>
                        <InlineForm
                            form_input_name='referral_code'
                            form_input_placeholder='Enter Referral Code'
                            submitting={submitting_referral_code}
                            button_text='Apply'
                            handleSubmitForm={handleApplyReferralCode}
                        />
                    </div>
                ) : referral_code_success ? (
                    <div className='referral-code-success-text'>
                        <span className='mr'>
                            Referral Code
                            <Tag color='purple' className='ml-s mr-s'>
                                {referral_code}
                            </Tag>
                            applied successfully.
                        </span>
                        <span className='error-color cursor-pointer' onClick={handleRemoveReferralCode}>
                            Remove
                        </span>
                    </div>
                ) : (
                    <span className='referral-code-text primary-color cursor-pointer' onClick={handleOpenReferralForm}>
                        Have a Referral Code?
                    </span>
                )}
            </div>
            {/* Credits */}
            {(!!available_credits || available_credits === 0) && (
                <div className='place-center mt pb-l pl pr'>
                    <div className='mb'>
                        <span className='use-credits-text mr-l'>Use Credits</span>
                        <Switch size='small' onChange={value => handleCreditsSwitchChange(value)} />
                    </div>
                    <div>
                        {show_credits_form && (
                            <InlineNumberForm
                                className=''
                                form_input_name='credits'
                                initialValue={
                                    credits > 0
                                        ? credits
                                        : convertToHigherCurrency(
                                              Math.min(price_breakup.price_after_discount, available_credits)
                                          )
                                }
                                required={true}
                                min={0}
                                max={convertToHigherCurrency(AppStore.credits)}
                                precision={2}
                                submitting={submitting_credits}
                                button_text='Apply'
                                success_message={convertToHigherCurrency(credits) + ' Credits successfully applied'}
                                show_success_message={credits > 0}
                                handleSubmitForm={handleApplyCredits}
                            />
                        )}
                    </div>

                    <div className='available-credits-text mt'>
                        <WalletFilled />
                        <span className='pl'>Available Credits: {convertToHigherCurrency(available_credits)}</span>
                    </div>
                </div>
            )}
        </div>
    );

    const getPaymentBtnSkeleton = () => <span>{getInputSkeleton('large', 250)}</span>;

    const getPaymentStep1 = () => (
        <>
            <Helmet>
                <title>Select or Create Billing Address</title>
                <meta name='description' content='Select or create a billing address for CodesDope' />
            </Helmet>
            <h1 className='center-align'>Select a Billing Address</h1>
            <BillingDetailsList
                billing_details={billing_details}
                handleOpenAddBillingDetailsForm={handleOpenAddBillingDetailsForm}
                handleOpenUpdateBillingDetailsForm={handleOpenUpdateBillingDetailsForm}
                handleSelectBillingDetails={handleSelectBillingDetails}
                loading_billing_details={loading_billing_details}
            />
            <div className='flex-container justify-center' ref={addBillingFormReference}>
                {show_add_details_form && (
                    <SubmitBillingDetailsForm
                        handleSubmitForm={handleAddBillingDetails}
                        handleCloseForm={handleCloseAddBillingDetailsForm}
                        form_data={form_data}
                        title='Add a Billing Address'
                        btn_text='Save'
                    />
                )}
            </div>
            <div className='flex-container justify-center' ref={updateBillingFormReference}>
                {show_update_details_form && (
                    <SubmitBillingDetailsForm
                        handleSubmitForm={handleUpdateBillingDetails}
                        handleCloseForm={handleCloseUpdateBillingDetailsForm}
                        form_data={form_data}
                        title='Update Billing Address'
                        btn_text='Update'
                    />
                )}
            </div>
        </>
    );

    const getPaymentStep2 = () => (
        <>
            <Helmet>
                <title>Purchase Summary - CodesDope</title>
                <meta name='description' content='Course purchase summary for CodesDope' />
            </Helmet>
            {loading_payment_result && <LoadingSpinner text='Loading...' />}
            {alert.show && (
                <Alert
                    className='payment-alert place-center center-align mb-l'
                    message={PAYMENT_ALERT_MESSAGE[alert.status]}
                    type={alert.type}
                />
            )}
            <div className='flex-container flex-wrap justify-center place-center'>
                <div className='selected-billing-details-card pr pl mb-xxl'>
                    <div className='billing-detail-card default-card-neu place-center pt-l pb-l pl-xl pr-xl mb-xl'>
                        <h2>Billing Details</h2>
                        <Row className='mt-l' key='address_fields_1'>
                            <span className='selected-detail-label'>Name:</span>
                            <span className='selected-detail-value ml'>{selected_billing_details.full_name}</span>
                        </Row>
                        <Row gutter={8} key='address_fields_2'>
                            <Col className='mt' xs={24} sm={24} md={12} lg={12} xl={12}>
                                <span className='selected-detail-label'>Mobile:</span>
                                <span className='selected-detail-value ml'>
                                    {selected_billing_details.phone_number}
                                </span>
                            </Col>
                            <Col className='mt' xs={24} sm={24} md={12} lg={12} xl={12}>
                                <span className='selected-detail-label'>Email:</span>
                                <span className='selected-detail-value ml'>{selected_billing_details.email}</span>
                            </Col>
                        </Row>
                        <Row className='mt' key='address_fields_3'>
                            <span className='selected-detail-label'>Address:</span>
                            <span className='selected-detail-value ml'>
                                {selected_billing_details.address_1}
                                {!!selected_billing_details.address_2 ? ', ' + selected_billing_details.address_2 : ''}
                            </span>
                        </Row>
                        <Row gutter={8} key='address_fields_4'>
                            <Col className='mt' xs={24} sm={12} md={12} lg={12} xl={12}>
                                <span className='selected-detail-label'>City:</span>
                                <span className='selected-detail-value ml'>{selected_billing_details.city}</span>
                            </Col>
                            <Col className='mt' xs={24} sm={12} md={12} lg={12} xl={12}>
                                <span className='selected-detail-label'>PIN:</span>
                                <span className='selected-detail-value ml'>{selected_billing_details.pincode}</span>
                            </Col>
                        </Row>
                        <Row gutter={8} key='address_fields_5'>
                            <Col className='mt' xs={24} sm={12} md={12} lg={12} xl={12}>
                                <span className='selected-detail-label'>State:</span>
                                <span className='selected-detail-value ml'>{selected_billing_details.state}</span>
                            </Col>
                            <Col className='mt' xs={24} sm={12} md={12} lg={12} xl={12}>
                                <span className='selected-detail-label'>Country:</span>
                                <span className='selected-detail-value ml'>{selected_billing_details.country}</span>
                            </Col>
                        </Row>
                    </div>
                    {/* Order Details */}
                    <CourseDetail course={course} loading_course_details={loading_course_details} />
                    {!isLaptop && getReferralAndCredits()}
                </div>
                {/* Payment Summary */}
                <div className='payment-summary-card pr pl'>
                    <div className='default-card-neu place-center pt-l pb-l pl-l pr-l'>
                        <h2>Summary</h2>
                        <div className='clear-both mt-l'>
                            <span className='billing-detail-price float-left'>Base Price</span>
                            <span className='billing-detail-price float-right'>
                                <span>
                                    <i className='fa fa-inr'></i>
                                </span>
                                <span className='ml-s'>{convertCurrency(price_breakup.base_price)}</span>
                            </span>
                        </div>
                        {!!price_breakup.discount && (
                            <div className='clear-both pt pb'>
                                <span className='billing-detail-price float-left'>Discount</span>
                                <span className='billing-detail-price float-right'>
                                    -{' '}
                                    <span>
                                        <i className='fa fa-inr ml-s'></i>
                                    </span>
                                    <span className='ml-s'>{convertCurrency(price_breakup.discount)}</span>
                                </span>
                            </div>
                        )}
                        {!!price_breakup.campus_discount_amount && (
                            <div className='clear-both pt pb'>
                                <span className='billing-detail-price float-left'>Campus Discount</span>
                                <span className='billing-detail-price float-right'>
                                    -{' '}
                                    <span>
                                        <i className='fa fa-inr ml-s'></i>
                                    </span>
                                    <span className='ml-s'>
                                        {convertCurrency(price_breakup.campus_discount_amount)}
                                    </span>
                                </span>
                            </div>
                        )}
                        {!!price_breakup.referral_discount && (
                            <div className='clear-both pt pb'>
                                <span className='billing-detail-price float-left'>Referral Discount</span>
                                <span className='billing-detail-price float-right'>
                                    -{' '}
                                    <span>
                                        <i className='fa fa-inr ml-s'></i>
                                    </span>
                                    <span className='ml-s'>{convertCurrency(price_breakup.referral_discount)}</span>
                                </span>
                            </div>
                        )}
                        {!!price_breakup.credits_discount && (
                            <div className='clear-both pt pb'>
                                <span className='billing-detail-price float-left'>Credits Discount</span>
                                <span className='billing-detail-price float-right'>
                                    -{' '}
                                    <span>
                                        <i className='fa fa-inr ml-s'></i>
                                    </span>
                                    <span className='ml-s'>{convertCurrency(price_breakup.credits_discount)}</span>
                                </span>
                            </div>
                        )}
                        {price_breakup.price_after_discount !== price_breakup.base_price && (
                            <hr className='billing-detail-hr clear-both mt-l' />
                        )}
                        {price_breakup.price_after_discount !== price_breakup.base_price && (
                            <div className='clear-both pt pb'>
                                <span className='billing-detail-price float-left font-weight-500'>
                                    Price after Discount
                                </span>
                                <span className='billing-detail-price float-right font-weight-500'>
                                    <span>
                                        <i className='fa fa-inr ml-s'></i>
                                    </span>
                                    <span className='ml-s'>{convertCurrency(price_breakup.price_after_discount)}</span>
                                </span>
                            </div>
                        )}
                        {!!price_breakup.tax_percentage && (
                            <div className='clear-both pt pb'>
                                <span className='billing-detail-price float-left'>
                                    GST ({price_breakup.tax_percentage}%)
                                </span>
                                <span className='billing-detail-price float-right'>
                                    +{' '}
                                    <span>
                                        <i className='fa fa-inr ml-s'></i>
                                    </span>
                                    <span className='ml-s'>{convertCurrency(price_breakup.tax_amount)}</span>
                                </span>
                            </div>
                        )}
                        <hr className='billing-detail-hr clear-both mt-l' />
                        <div className='clear-both pt pb'>
                            <span className='billing-detail-price float-left font-weight-500'>Total</span>
                            <span className='billing-detail-price billing-total-price float-right font-weight-500'>
                                <span>
                                    <i className='fa fa-inr ml-s'></i>
                                </span>
                                <span className='ml-s'>{convertCurrency(price_breakup.total_amount)}</span>
                            </span>
                        </div>
                        <div className='clear-both'></div>
                        {isLaptop && (
                            <div>
                                <div className='mt-l'>
                                    By completing the purchase you agree to the{' '}
                                    <Link to='/tnc'>Terms and Conditions</Link>
                                </div>
                                <div className='center-align mt'>
                                    {!loading_course_price && !loading_course_details && !loading_modules ? (
                                        paid_order ? (
                                            <div>
                                                <Button
                                                    key='rzp-button1'
                                                    className='payment-btn colored-card-neu font-weight-500 pt pb'
                                                    loading={loading_payment_window}
                                                    disabled={disable_payment_btn}
                                                    onClick={handlePayment}>
                                                    Pay
                                                    <span>
                                                        <i className='fa fa-inr ml'></i>
                                                    </span>
                                                    <span className='ml-s'>
                                                        {convertCurrency(price_breakup.total_amount)}
                                                    </span>
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                className='payment-btn colored-card-neu font-weight-500 pt pb'
                                                loading={loading_payment_window}
                                                disabled={disable_payment_btn}
                                                onClick={handlePayment}>
                                                Enroll Now
                                            </Button>
                                        )
                                    ) : (
                                        getPaymentBtnSkeleton()
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {isLaptop && getReferralAndCredits()}
                </div>
            </div>
            <div className='flex-container align-center mt'>
                <i className='fa fa-long-arrow-left payment-prev-arrow cursor-pointer' onClick={handleGoBack}></i>
                <span className='payment-prev-text cursor-pointer ml' onClick={handleGoBack}>
                    Go Back
                </span>
            </div>
            {!isLaptop && (
                <div className='fixed-payment-btn center-align pt-l pb-l pr-s pl-s'>
                    <div>
                        By completing the purchase you agree to the <Link to='/tnc'>Terms and Conditions</Link>
                    </div>
                    <div className='center-align mt'>
                        {!loading_course_price && !loading_course_details && !loading_modules ? (
                            paid_order ? (
                                <div>
                                    <Button
                                        key='rzp-button1'
                                        className='payment-btn font-weight-500 pt pb'
                                        loading={loading_payment_window}
                                        disabled={disable_payment_btn}
                                        onClick={handlePayment}>
                                        Pay
                                        <span>
                                            <i className='fa fa-inr ml'></i>
                                        </span>
                                        <span className='ml-s'>{convertCurrency(price_breakup.total_amount)}</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    className='payment-btn font-weight-500 pt pb'
                                    loading={loading_payment_window}
                                    disabled={disable_payment_btn}
                                    onClick={handlePayment}>
                                    Enroll Now
                                </Button>
                            )
                        ) : (
                            getPaymentBtnSkeleton()
                        )}
                    </div>
                </div>
            )}
        </>
    );

    const steps = [
        {
            content: getPaymentStep1()
        },
        {
            content: getPaymentStep2()
        }
    ];

    return (
        <ErrorHandlerWrapper error={error}>
            <div className='mt-xxl mb-xl pr-xl pl-xl'>
                {!isEmptyObject(course) && !loading_modules ? (
                    course.enrolled === COURSE_ENROLLMENT_STATUS.ENROLLED ||
                    course.enrolled === COURSE_ENROLLMENT_STATUS.PENDING ? (
                        <div>
                            <div className='status-alert-text place-center center-align'>
                                {INITIAL_PAYMENT_ALERT_MESSAGE[course.enrolled]}
                            </div>
                            {course.enrolled === COURSE_ENROLLMENT_STATUS.ENROLLED && (
                                <div className='center-align mt-l'>
                                    <Button className='course-card-button home-card-course-buy-button'>
                                        <Link
                                            to={
                                                '/courses/' +
                                                course_slug +
                                                '/' +
                                                (course_slug === 'cpp'
                                                    ? modules[0].protopics[2].subtopics[0].slug
                                                    : modules[0].protopics[0].subtopics[0].slug) +
                                                '/'
                                            }>
                                            Go to course
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='mt-large'>{steps[payment_current_index].content}</div>
                    )
                ) : (
                    <LoadingSpinner text='Loading...' />
                )}
            </div>
        </ErrorHandlerWrapper>
    );
};

export default Checkout;
