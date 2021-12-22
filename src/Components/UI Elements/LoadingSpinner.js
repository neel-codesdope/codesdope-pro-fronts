import React from 'react';

const LoadingSpinner = props => {
    let spinner_class = 'default-spinner';
    if (props.size === 'small') {
        spinner_class = 'small-spinner';
    }
    if (props.size === 'large') {
        spinner_class = 'large-spinner';
    }
    return (
        <div className='spinner-backdrop flex-container justify-center align-center'>
            <div className={'spinner-line ' + spinner_class}></div>
            <div className={'spinner-line ' + spinner_class}></div>
            <div className={'spinner-line ' + spinner_class}></div>
        </div>
    );
};

export default LoadingSpinner;
