import { useState, useEffect } from 'react';

const useInfiniteScroll = (callback, getDistanceFromTop, getHeightToCompare) => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    useEffect(() => {
        if (!isFetching) return;
        callback();
    }, [isFetching]);

    function handleScroll() {
        if (getDistanceFromTop() > getHeightToCompare() || isFetching) {
            return;
        }
        setIsFetching(true);
    }

    return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
