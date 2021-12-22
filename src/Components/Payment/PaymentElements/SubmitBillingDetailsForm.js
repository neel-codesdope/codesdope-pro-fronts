import React, { useState, useRef, useMemo } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import countryList from 'react-select-country-list';

import { Form, Input, Button, Select, Row, Col } from 'antd';
import { FIELD_REQUIRED_ERROR, INVALID_EMAIL_ERROR } from '../../../Constants/Messages';

const { Option } = Select;

const SubmitBillingDetailsForm = React.forwardRef((props, ref) => {
    const [submitting_address, setSubmittingAddress] = useState(false);
    const nameRef = useRef();
    const mobileRef = useRef();
    const emailRef = useRef();
    const cityRef = useRef();
    const countryRef = useRef();
    const pinRef = useRef();
    const stateRef = useRef();
    const addressLine1Ref = useRef();
    const addressLine2Ref = useRef();
    const [form] = Form.useForm();

    const countries = useMemo(() => countryList().getData(), []);

    const handleSubmitForm = data => {
        data.phone_number = '+' + data.phone_number;
        setSubmittingAddress(true);
        props
            .handleSubmitForm(data, props.form_data.id)
            .then(() => {
                form.resetFields();
                setSubmittingAddress(false);
            })
            .catch(err => {
                setSubmittingAddress(false);
            });
    };

    const getCountryList = () => {
        let country_list = countries.map(country => (
            <Option value={country.label} key={country.value}>
                {country.label}
            </Option>
        ));
        country_list['249'] = (
            <Option value='Other' key='OTHER'>
                Other
            </Option>
        );
        return country_list;
    };

    return (
        <div className='profile-form payment-form place-center default-card-neu mt-xxl pt-xl pb-l pr-xl pl-xl'>
            <h2>{props.title}</h2>
            <Form
                className='mt-l'
                layout='vertical'
                name='basic'
                initialValues={{ remember: true }}
                onFinish={handleSubmitForm}
                validateTrigger='onBlur'
                form={form}
                ref={ref}>
                <Form.Item
                    className='form-item'
                    label='Full Name'
                    name='full_name'
                    initialValue={props.form_data.full_name}
                    rules={[
                        {
                            required: true,
                            message: FIELD_REQUIRED_ERROR
                        }
                    ]}>
                    <Input className='form-input' placeholder='Name' ref={nameRef} />
                </Form.Item>
                <Row gutter={8}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                            label='Mobile Number'
                            name='phone_number'
                            initialValue={props.form_data.phone_number}
                            rules={[
                                {
                                    required: true,
                                    message: FIELD_REQUIRED_ERROR
                                }
                            ]}>
                            <PhoneInput
                                ref={mobileRef}
                                country='in'
                                preferredCountries={['in']}
                                disableDropdown={false}
                                inputClass='ant-input phone-input'
                                isValid={(value, country) => {
                                    if (value.match(/12345/)) {
                                        return 'Invalid value: ' + value + ', ' + country.name;
                                    } else if (value.match(/1234/)) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                            label='Email'
                            name='email'
                            initialValue={props.form_data.email}
                            rules={[
                                {
                                    required: true,
                                    message: FIELD_REQUIRED_ERROR
                                },
                                {
                                    type: 'email',
                                    message: INVALID_EMAIL_ERROR
                                }
                            ]}>
                            <Input className='form-input' ref={emailRef} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                            className='form-item'
                            label='Country'
                            name='country'
                            initialValue={props.form_data.country || 'India'}
                            rules={[
                                {
                                    required: true,
                                    message: FIELD_REQUIRED_ERROR
                                }
                            ]}>
                            <Select className='form-input' placeholder='Select a country' ref={countryRef}>
                                {getCountryList()}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                            className='form-item'
                            label='State'
                            name='state'
                            initialValue={props.form_data.state}
                            rules={[
                                {
                                    required: true,
                                    message: FIELD_REQUIRED_ERROR
                                }
                            ]}>
                            <Input className='form-input' ref={stateRef} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                            className='form-item'
                            label='Address Line 1'
                            name='address_1'
                            initialValue={props.form_data.address_1}
                            rules={[
                                {
                                    required: true,
                                    message: FIELD_REQUIRED_ERROR
                                }
                            ]}>
                            <Input className='form-input' ref={addressLine1Ref} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                            className='form-item'
                            label='Address Line 2'
                            name='address_2'
                            initialValue={props.form_data.address_2}>
                            <Input className='form-input' ref={addressLine2Ref} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                            className='form-item'
                            label='City'
                            name='city'
                            initialValue={props.form_data.city}
                            rules={[
                                {
                                    required: true,
                                    message: FIELD_REQUIRED_ERROR
                                }
                            ]}>
                            <Input className='form-input' ref={cityRef} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                            className='form-item'
                            label='PIN'
                            name='pincode'
                            initialValue={props.form_data.pincode}
                            rules={[
                                {
                                    required: true,
                                    message: FIELD_REQUIRED_ERROR
                                }
                            ]}>
                            <Input className='form-input' ref={pinRef} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={submitting_address}>
                        {props.btn_text}
                    </Button>
                    <Button className='ml' type='primary' onClick={props.handleCloseForm}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
});

export default SubmitBillingDetailsForm;
