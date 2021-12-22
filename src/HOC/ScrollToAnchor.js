import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToAnchor = () => {
    const { _, hash } = useLocation();

    useEffect(() => {
        if (hash === '') {
            window.scrollTo(0, 0);
        } else {
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 0);
        }
    }, [hash]);

    return null;
};

export default ScrollToAnchor;
