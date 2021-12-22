import React, { useState, useEffect, useRef } from 'react';
import { Button, Upload, Modal, message } from 'antd';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import {
    UPDATE_PROFILE_PIC_SUCCESS,
    REMOVE_PROFILE_PIC_SUCCESS,
    CONFIRM_DELETE_PROFILE_PIC
} from '../../../../Constants/Messages';
import { UPDATE_PROFILE_PIC, REMOVE_PROFILE_PIC } from '../../../../Constants/Urls';
import { FILE_SIZE_LIMIT } from '../../../../Constants/Values';
import { interpolate, multipartAPI, postAPI } from '../../../../Utils/ApiCalls';
import { getProfileAvatar } from '../../../../Utils/HelperFunctions';

const UpdateProfilePicForm = props => {
    const [profile_pic_file, setProfilePicFile] = useState([]);
    const [profile_pic_filename, setProfilePicFilename] = useState('');
    const [updating_profile_pic, setUpdatingProfilePic] = useState(false);
    const [deleting_profile_pic, setDeletingProfilePic] = useState(false);
    const isFirst = useRef(true); // to prevent useEffect for image upload from rendering on component mount

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        if (profile_pic_file && profile_pic_file.length > 0) {
            uploadProfilePic();
        }
    }, [profile_pic_file]);

    const uploadProfilePic = () => {
        setUpdatingProfilePic(true);
        let data = new FormData();
        let url = interpolate(UPDATE_PROFILE_PIC, [props.user.user.id]);
        data.append('image', profile_pic_file[0]);
        multipartAPI(url, data)
            .then(d => {
                setProfilePicFilename('');
                setProfilePicFile([]);
                props.dispatch('updateProfilePicUrl', d.profile_pic + '?cache=' + Date.now(), props.user);
                message.success(UPDATE_PROFILE_PIC_SUCCESS);
                setUpdatingProfilePic(false);
            })
            .catch(err => {
                setProfilePicFilename('');
                setProfilePicFile([]);
                setUpdatingProfilePic(false);
            });
    };

    const deleteProfilePic = () => {
        setDeletingProfilePic(true);
        postAPI(interpolate(REMOVE_PROFILE_PIC, [props.user.user.id]))
            .then(d => {
                props.dispatch('updateProfilePicUrl', d.profile_pic, props.user);
                message.success(REMOVE_PROFILE_PIC_SUCCESS);
                setDeletingProfilePic(false);
            })
            .catch(err => {
                setDeletingProfilePic(false);
            });
    };

    const confirmDeleteProfilePic = () => {
        Modal.confirm({
            content: CONFIRM_DELETE_PROFILE_PIC,
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => deleteProfilePic()
        });
    };

    return (
        <div className='mb-l'>
            <div className='center-align' key={Date.now()}>
                {getProfileAvatar(
                    props.user.user.first_name,
                    props.user.user.last_name,
                    props.user.user.username,
                    props.user.profile_pic,
                    80
                )}
            </div>
            <span className='pic-upload-button'>
                <Upload
                    accept='.png, .jpg, .jpeg'
                    showUploadList={false}
                    beforeUpload={(event, file) => {
                        const is_filesize_valid = file[0].size / 1024 / 1024 < FILE_SIZE_LIMIT;
                        if (!is_filesize_valid) {
                            message.error('Image must smaller than ' + FILE_SIZE_LIMIT + 'MB!');
                            return false;
                        }
                        setProfilePicFilename(file[0].name);
                        setProfilePicFile(file);
                        return false;
                    }}
                    multiple={false}>
                    <Button
                        loading={updating_profile_pic}
                        size='small'
                        className='mt'
                        onClick={e => e.preventDefault()}>
                        Update Profile Picture
                    </Button>
                </Upload>
            </span>
            {props.user.profile_pic && (
                <span>
                    <DeleteOutlined className='delete-pic-icon cursor-pointer ml' onClick={confirmDeleteProfilePic} />
                    {deleting_profile_pic && <LoadingOutlined />}
                </span>
            )}
            <div className='center-align'>{profile_pic_filename}</div>
        </div>
    );
};

export default UpdateProfilePicForm;
