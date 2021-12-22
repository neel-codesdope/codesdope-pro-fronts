import React, { useState, useRef } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { INVALID_URL_ERROR, UPDATE_PROFILE_SUCCESS } from '../../../../Constants/Messages';
import { UPDATE_PROFILE_DETAIL } from '../../../../Constants/Urls';
import { postAPI, interpolate } from '../../../../Utils/ApiCalls';
import { getUserProfileId } from '../../../../Utils/HelperFunctions';

const { Option } = Select;
const { TextArea } = Input;

const UpdateBasicDetails = props => {
    const [updating_profile, setUpdatingProfile] = useState(false);
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const schoolRef = useRef();
    const cityRef = useRef();
    const countryRef = useRef();
    const bioRef = useRef();
    const facebookURLRef = useRef();
    const twitterURLRef = useRef();
    const githubURLRef = useRef();
    const linkedinURLRef = useRef();
    const instagramURLRef = useRef();

    const handleUpdateProfile = data => {
        setUpdatingProfile(true);
        postAPI(interpolate(UPDATE_PROFILE_DETAIL, [getUserProfileId()]), data, 'PATCH')
            .then(d => {
                props.dispatch('setUserDetail', d);
                message.success(UPDATE_PROFILE_SUCCESS);
                setUpdatingProfile(false);
            })
            .catch(err => {
                setUpdatingProfile(false);
            });
    };

    return (
        <div>
            <h1>Basic Details</h1>
            <Form
                className='mt-l'
                layout='vertical'
                name='basic'
                initialValues={{ remember: true }}
                onFinish={handleUpdateProfile}
                validateTrigger='onBlur'>
                <Form.Item
                    className='form-item'
                    label='First Name'
                    name={['user', 'first_name']}
                    initialValue={props.user.user.first_name}>
                    <Input className='form-input' placeholder='First Name' ref={firstNameRef} />
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label='Last Name'
                    name={['user', 'last_name']}
                    initialValue={props.user.user.last_name}>
                    <Input className='form-input' placeholder='Last Name' ref={lastNameRef} />
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label='Username'
                    name='username'
                    initialValue={props.user.user.username}>
                    <Input className='form-input' placeholder='Username' disabled />
                </Form.Item>

                <Form.Item className='form-item' label='Email' name='email' initialValue={props.user.user.email}>
                    <Input className='form-input' placeholder='Email' disabled />
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label='School / College'
                    name='school'
                    initialValue={props.user.school}>
                    <Input className='form-input' placeholder='School' ref={schoolRef} />
                </Form.Item>

                <Form.Item className='form-item' label='City' name='city' initialValue={props.user.city}>
                    <Input className='form-input' placeholder='City' ref={cityRef} />
                </Form.Item>

                <Form.Item className='form-item' label='Country' name='country' initialValue={props.user.country}>
                    <Select className='form-input' placeholder='Select a country' ref={countryRef}>
                        <Option value='India'>India</Option>
                        <Option value='Unites States'>Unites States</Option>
                        <Option value='other'>other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label='About you'
                    name='author_description'
                    initialValue={props.user.author_description}>
                    <TextArea className='form-input' rows={4} placeholder='Write about yourself' ref={bioRef} />
                </Form.Item>

                <hr className='mt-l mb-l' />

                <Form.Item
                    className='form-item'
                    label='Facebook URL'
                    name='facebook_url'
                    initialValue={props.user.facebook_url}
                    rules={[
                        {
                            type: 'url',
                            message: INVALID_URL_ERROR
                        }
                    ]}>
                    <Input className='form-input' placeholder='https://www.facebook.com/' ref={facebookURLRef} />
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label='Twitter URL'
                    name='twitter_url'
                    initialValue={props.user.twitter_url}
                    rules={[
                        {
                            type: 'url',
                            message: INVALID_URL_ERROR
                        }
                    ]}>
                    <Input className='form-input' placeholder='https://twitter.com/' ref={twitterURLRef} />
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label='Github URL'
                    name='github_url'
                    initialValue={props.user.github_url}
                    rules={[
                        {
                            type: 'url',
                            message: INVALID_URL_ERROR
                        }
                    ]}>
                    <Input className='form-input' placeholder='https://github.com/' ref={githubURLRef} />
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label='LinkedIn URL'
                    name='linkedin_url'
                    initialValue={props.user.linkedin_url}
                    rules={[
                        {
                            type: 'url',
                            message: INVALID_URL_ERROR
                        }
                    ]}>
                    <Input className='form-input' placeholder='https://www.linkedin.com/' ref={linkedinURLRef} />
                </Form.Item>

                <Form.Item
                    className='form-item'
                    label='Instagram URL'
                    name='instagram_url'
                    initialValue={props.user.instagram_url}
                    rules={[
                        {
                            type: 'url',
                            message: INVALID_URL_ERROR
                        }
                    ]}>
                    <Input className='form-input' placeholder='https://www.facebook.com/' ref={instagramURLRef} />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={updating_profile}>
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateBasicDetails;
