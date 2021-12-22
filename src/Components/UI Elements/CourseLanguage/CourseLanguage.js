import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import { getAPI, interpolate } from '../../../Utils/ApiCalls';
import { FETCH_COURSE_LANGUAGES } from '../../../Constants/Urls';
import { useStore } from '../../../Stores/SetStore';
import { getInputSkeleton } from '../Skeleton/GeneralSkeleton';

const CourseLanguage = props => {
    const [AppStore, _] = useStore();
    const [preferred_language, setPreferredLanguage] = useState(props.preferred_language);
    const [languages, setLanguages] = useState();
    const [loading_language, setLoadingLanguage] = useState(false);

    if (JSON.stringify(props.preferred_language) !== JSON.stringify(preferred_language)) {
        setPreferredLanguage(props.preferred_language);
    }

    useEffect(() => {
        getAPI(interpolate(FETCH_COURSE_LANGUAGES, [props.course_slug]), {}, AppStore.is_user_logged_in)
            .then(response => {
                setLanguages(response);
            })
            .catch(err => {});
    }, []);

    const getLanguageNameFromId = lang_id => {
        let lang = '';
        if (!!languages) {
            languages.forEach(function (language) {
                if (language.id === lang_id) {
                    lang = language.name;
                }
            });
        }
        return lang;
    };

    function changeLanguage(e) {
        let data = {};
        data.id = e.target.value;
        data.name = getLanguageNameFromId(e.target.value);
        setLoadingLanguage(true);
        props
            .changeLanguage(data)
            .then(response => {
                setPreferredLanguage(response);
                setLoadingLanguage(false);
            })
            .catch(err => {
                setLoadingLanguage(false);
            });
    }

    const getLanguages = () => {
        let language_list = [];
        if (!!languages) {
            language_list = languages.map(language => (
                <Radio value={language.id} key={language.id}>
                    {language.name}
                </Radio>
            ));
        }
        return language_list;
    };

    const getSkeleton = () => <span>{getInputSkeleton('small', 100)}</span>;

    return (
        <>
            <div
                className={
                    'language-button flex-container flex-column justify-center align-center default-card-neu center-align ' +
                    props.className
                }>
                <div className='language-button-text mb-s'>Audio Language</div>
                <div className='center-align'>
                    {!!preferred_language ? (
                        <Radio.Group
                            onChange={changeLanguage}
                            defaultValue={!!preferred_language ? preferred_language.id : null}
                            value={!!preferred_language ? preferred_language.id : null}>
                            {getLanguages()}
                        </Radio.Group>
                    ) : (
                        getSkeleton()
                    )}
                </div>
            </div>
        </>
    );
};

export default CourseLanguage;
