import React from 'react';
import { getInputSkeleton, getButtonSkeleton, getAvatarSkeleton } from '../../UI Elements/Skeleton/GeneralSkeleton';
import { useStore } from '../../../Stores/SetStore';
import UpdateProfilePicForm from './UpdateProfilePic/UpdateProfilePic';
import UpdateBasicDetails from './UpdateBasicDetails/UpdateBasicDetails';

const BasicDetails = props => {
    const [AppStore, dispatch] = useStore();

    const getFormSkeleton = () => (
        <>
            <div className='center-align mb-xl'>{getAvatarSkeleton('circle', 80, 80)}</div>
            <div className='profile-form default-card-neu pt-l pb-l pr-xl pl-xl'>
                <div className='center-align'>
                    <div className='mt-xl mb-xl'>{getInputSkeleton('large', 200)}</div>
                    <div className='mt-xl mb-xl'>{getInputSkeleton('large', 200)}</div>
                    <div className='mt-xl mb-xl'>{getInputSkeleton('large', 200)}</div>
                    <div className='mt-xl mb-xl'>{getInputSkeleton('large', 200)}</div>
                    <div className='mt-xl mb-xl'>{getInputSkeleton('large', 200)}</div>
                    <div className='mt-xl mb-xl'>{getInputSkeleton('large', 200)}</div>
                </div>
                {getButtonSkeleton('large', 'default')}
            </div>
        </>
    );

    return (
        <>
            {AppStore.is_user_fetched ? (
                <div className='profile-form default-card-neu pt-l pb-l pr-xl pl-xl'>
                    <UpdateProfilePicForm user={AppStore.user} dispatch={dispatch} />
                    <UpdateBasicDetails user={AppStore.user} dispatch={dispatch} />
                </div>
            ) : (
                getFormSkeleton()
            )}
        </>
    );
};

export default BasicDetails;
