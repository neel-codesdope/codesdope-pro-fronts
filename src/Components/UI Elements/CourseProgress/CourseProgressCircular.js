import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';
import { getAPI, interpolate } from '../../../Utils/ApiCalls';
import { returnFloor } from '../../../Utils/HelperFunctions';
import { FETCH_COURSE_PROGRESS } from '../../../Constants/Urls';
import { useStore } from '../../../Stores/SetStore';

const CourseProgressCircular = props => {
    const [AppStore, _] = useStore();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (AppStore.is_user_logged_in) {
            getAPI(interpolate(FETCH_COURSE_PROGRESS, [props.course_slug]))
                .then(response => {
                    setProgress(response.progress);
                })
                .catch(err => {});
        } else {
            setProgress(0);
        }
    }, [props.is_subtopic_watched, AppStore.is_user_logged_in]);

    return (
        <div className={'flex-container justify-center align-center ' + props.className}>
            <Progress
                type='circle'
                percent={returnFloor(progress)}
                success={{ strokeColor: '#802bb1' }}
                width={props.width ? props.width : 35}
                format={progress == 100 ? () => <i class='fa fa-trophy certificate-icon primary-color'></i> : undefined}
            />
        </div>
    );
};

export default CourseProgressCircular;
