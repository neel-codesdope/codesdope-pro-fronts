import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Empty } from 'antd';

const NoData = props => (
    <div className={'center-align ' + props.className}>
        <div>
            {props.image ? (
                <img src={props.image} alt={props.alt} height='150' />
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
            )}
        </div>
        <p className='no-data-text place-center pr-l pl-l mt-xl'>{props.text}</p>
        {props.button &&
            (props.button_size === 'large' ? (
                <Button type='primary' className='not-found-button'>
                    <Link to={props.button_url}>{props.button_text}</Link>
                </Button>
            ) : (
                <Button className='course-card-button home-card-course-buy-button'>
                    <Link to={props.button_url}>{props.button_text}</Link>
                </Button>
            ))}
    </div>
);

export default NoData;
