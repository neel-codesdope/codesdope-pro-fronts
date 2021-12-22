import React from 'react';
import { Link } from 'react-router-dom';

const LogoCodesdopePro = props => (
    <div className={props.className}>
        <Link to='/'>
            <img
                src='/img/logo_codesdope_pro.svg'
                alt='CodesDope Pro Logo'
                className='header-logo '
                height={props.height}
            />
        </Link>
    </div>
);

export default LogoCodesdopePro;
