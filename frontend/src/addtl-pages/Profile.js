import { useState, useEffect, } from 'react';
import { Button, Card, Elevation, FormGroup, H3, InputGroup, } from '@blueprintjs/core';
import { useSnapshot } from 'valtio';

import { profileFormState, userState } from '../App';
import HornRepApi from '../utilities/api';

const Profile = () => {
    const userSnap = useSnapshot(userState)
    const initialState = {
        fName: userSnap.user.fName,
        lName: userSnap.user.lName,
        username: userSnap.user.username,
        email: userSnap.user.email,
    }
    const [profileFormFields, setProfileFormFields] = useState(initialState)
    
    const profileFormSnap = useSnapshot(profileFormState)
    
    const handleProfileFormChange = (evt) => {
        const { name, value } = evt.target;
        setProfileFormFields(ff => ({
            ...ff,
            [name]: value
        }));
    };

    const handleProfileUpdate = (evt) => {
        evt.preventDefault();
        
        // TODO try/catch and deal with unique username
        // "duplicate key value violates unique constraint"
        (async () => {
            const resp = await HornRepApi.updateProfile(userState.user.id, profileFormFields);
            userState.setUser(resp);
            setProfileFormFields(() => ({ ...initialState }));
        })();
        profileFormState.setUserFieldsDisabledTrue();
    };

    const handleProfileCancel = () =>{
        profileFormState.setUserFieldsDisabledTrue();
        setProfileFormFields(() => ({ ...initialState }));
    };

    const handleEditClick = () => profileFormState.setUserFieldsDisabledFalse();

    useEffect(() => {
        profileFormState.setUserFieldsDisabledTrue();
    }, []);

    return (
        <Card elevation={Elevation.TWO} className='Card'>
            <H3>User Profile</H3>
            <form onSubmit={handleProfileUpdate}>
                <FormGroup label='first name' labelFor='fName'>
                    <InputGroup 
                        id='fName' 
                        name='fName' 
                        value={ profileFormFields.fName } 
                        onChange={handleProfileFormChange} 
                        autoComplete='name' 
                        placeholder='Philip' 
                        required 
                        disabled={profileFormSnap.userFieldsDisabled}/>
                </FormGroup>
                <FormGroup label='last name' labelFor='lName'>
                    <InputGroup 
                        id='lName' 
                        name='lName' 
                        value={ profileFormFields.lName } 
                        onChange={handleProfileFormChange} 
                        autoComplete='name' 
                        placeholder='Farkas' 
                        required 
                        disabled={profileFormSnap.userFieldsDisabled}/>
                </FormGroup>
                <FormGroup label='username' labelFor='username'>
                    <InputGroup 
                        id='username' 
                        name='username' 
                        value={ profileFormFields.username } 
                        onChange={handleProfileFormChange} 
                        autoComplete='username' 
                        placeholder='fFarkas14' 
                        required 
                        disabled={profileFormSnap.userFieldsDisabled}/>
                </FormGroup>
                <FormGroup label='email' labelFor='email'>
                    <InputGroup 
                        id='email' type='email' 
                        name='email' 
                        value={ profileFormFields.email } 
                        onChange={handleProfileFormChange} 
                        autoComplete='email' 
                        placeholder='philip@hornlegends.com' 
                        required 
                        disabled={profileFormSnap.userFieldsDisabled}/>
                </FormGroup>
                <div className='Signup-btn Btn-pair'>
                    { 
                        profileFormSnap.userFieldsDisabled
                        ? <Button type='button' intent='success' text='edit profile' outlined={true} onClick={handleEditClick} />
                        : 
                        <>
                        <Button type='button' intent='danger' text='cancel' onClick={handleProfileCancel } />
                        <Button type='submit' intent='primary' text='update profile' />
                        </>
                    }
                </div>
            </form>
        </Card>
    );
};

export default Profile;