import React, { useState, useEffect } from 'react';
import { Progress, Form, Input, Button, Popconfirm, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getAPI, postAPI, interpolate } from '../../../Utils/ApiCalls';
import { downloadFile, returnFloor, getUserDisplayName, isArrayEmpty } from '../../../Utils/HelperFunctions';
import { CERTIFICATE_GENERATED_STATUS, GET_CERTIFICATE_URL } from '../../../Constants/Urls';
import {
    FINISH_COURSE_FOR_CERTIFICATE_WARNING,
    CONFIRM_CERTIFICATE_NAME_SUBMISSION
} from '../../../Constants/Messages';
import { useStore } from '../../../Stores/SetStore';
import Modal from '../../StatusModal';

const CourseCertificate = props => {
    const [AppStore, _] = useStore();
    const [progress, setProgress] = useState(props.progress);
    const [certificate_name, setCertificateName] = useState(
        AppStore.is_user_fetched
            ? getUserDisplayName(
                  AppStore.user.user.first_name,
                  AppStore.user.user.last_name,
                  AppStore.user.user.username
              )
            : ''
    );
    const [is_eligible, setIsEligible] = useState(props.is_eligible);
    const [open_modal, setOpenModal] = useState(false);
    const [loading_certificate, setLoadingCertificate] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        setProgress(props.progress);
    }, [props.progress]);

    useEffect(() => {
        setIsEligible(props.is_eligible);
    }, [props.is_eligible]);

    const getEligibilityCriterion = () => {
        let criterion = false;
        AppStore.courses.forEach(function (course) {
            if (course.slug === props.course_slug) {
                criterion = course.certificate_eligibility_criterion;
            }
        });
        return criterion;
    };

    const downloadCertificate = () => {
        let data = {};
        data.name_on_certificate = certificate_name;
        setLoadingCertificate(true);
        postAPI(interpolate(GET_CERTIFICATE_URL, [props.course_slug]), data)
            .then(response => {
                downloadFile(response.certificate_url);
                setLoadingCertificate(false);
            })
            .catch(err => {
                setLoadingCertificate(false);
            });
    };

    const onSubmitCertificateName = () => {
        closeCertificateNameModal();
        downloadCertificate();
    };

    const checkGeneratedStatus = () => {
        setLoadingCertificate(true);
        getAPI(interpolate(CERTIFICATE_GENERATED_STATUS, [props.course_slug]))
            .then(response => {
                if (response.generated) {
                    downloadCertificate();
                } else {
                    openCertificateNameModal();
                    setLoadingCertificate(false);
                }
            })
            .catch(err => {
                setLoadingCertificate(false);
            });
    };

    const onDownloadCertificateClick = () => {
        if (is_eligible) {
            checkGeneratedStatus();
        } else {
            if (!isArrayEmpty(AppStore.courses)) {
                message.info(interpolate(FINISH_COURSE_FOR_CERTIFICATE_WARNING, [getEligibilityCriterion() + '%']));
            } else {
                message.info(interpolate(FINISH_COURSE_FOR_CERTIFICATE_WARNING, ['']));
            }
        }
    };

    const openCertificateNameModal = () => {
        setOpenModal(true);
    };

    const closeCertificateNameModal = () => {
        setOpenModal(false);
        form.resetFields();
    };

    return (
        <>
            <div
                className={
                    'certificate-button flex-container justify-center align-center default-card-neu cursor-pointer pt-s pb-s ' +
                    props.className
                }
                onClick={onDownloadCertificateClick}>
                <Progress
                    type='circle'
                    percent={returnFloor(progress)}
                    success={{ strokeColor: '#802bb1' }}
                    width={35}
                    format={
                        progress == 100
                            ? () => <i className='fa fa-trophy certificate-icon primary-color'></i>
                            : undefined
                    }
                />
                <span className='ml'>Get Certificate</span>
                {loading_certificate && <LoadingOutlined className='ml-s' />}
            </div>
            <Modal visible={open_modal} onCancel={closeCertificateNameModal}>
                <h2 className='heading-certificate-modal'>Enter your name to be displayed in the Certificate</h2>
                <p className='text-certificate-modal'>
                    You won't be able to change your name on certificate after submission.
                </p>
                <Form form={form}>
                    <Form.Item
                        className='mt-l'
                        name='name_on_certificate'
                        initialValue={
                            AppStore.is_user_fetched
                                ? getUserDisplayName(
                                      AppStore.user.user.first_name,
                                      AppStore.user.user.last_name,
                                      AppStore.user.user.username
                                  )
                                : ''
                        }
                        value={certificate_name}
                        onChange={obj => setCertificateName(obj.target.value)}>
                        <Input className='form-input' placeholder='Enter your name' />
                    </Form.Item>
                    <div>
                        <Popconfirm
                            title={CONFIRM_CERTIFICATE_NAME_SUBMISSION}
                            onConfirm={onSubmitCertificateName}
                            okText='Yes'
                            cancelText='No'
                            disabled={!certificate_name}>
                            <Button type='primary' disabled={!certificate_name} style={{ height: 38 }}>
                                Submit
                            </Button>
                        </Popconfirm>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default CourseCertificate;
