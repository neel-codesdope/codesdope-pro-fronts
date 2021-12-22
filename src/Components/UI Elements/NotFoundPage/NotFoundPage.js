import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { Helmet } from 'react-helmet';

const NotFound = props => (
    <>
        <Helmet>
            <title>Page Not Found</title>
            <meta name='description' content={`This page doesn't exist or moved.`} />
        </Helmet>
        <div className={'center-align mt-xxxl mb-xxxl ' + props.className}>
            <div>
                <img src='/img/404.png' alt='No data' height='100' />
            </div>
            <h1 className='not-found-heading place-center pr-l pl-l mt-xl'>Are you Lost? We've got your back!</h1>
            <p className='not-found-text'>
                <span className='font-weight-500'>Error 404:</span> This page doesn't exist.
            </p>
            <Button type='primary' className='not-found-button mt-l'>
                <Link to='/'>Go to Homepage</Link>
            </Button>
        </div>
    </>
);

export default NotFound;
