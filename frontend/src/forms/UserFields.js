import { FormGroup, InputGroup } from '@blueprintjs/core';
import { useSnapshot } from 'valtio';

import { signupState } from '../App';


const UserFields = () => {
    const signupSnap = useSnapshot(signupState);
 
    return (
        <>
        <FormGroup label='first name' labelFor='fName'>
            <InputGroup 
                id='fName' 
                name='fName' 
                value={signupSnap.formFields.fName} 
                onChange={signupState.handleSignupFormChange} 
                autoComplete='name' 
                placeholder='Philip' 
                required 
                disabled={signupSnap.userFieldsDisabled}/>
        </FormGroup>
        <FormGroup label='last name' labelFor='lName'>
            <InputGroup 
                id='lName' 
                name='lName' 
                value={signupSnap.formFields.lName} 
                onChange={signupState.handleSignupFormChange} 
                autoComplete='name' 
                placeholder='Farkas' 
                required 
                disabled={signupSnap.userFieldsDisabled}/>
        </FormGroup>
        <FormGroup label='username' labelFor='username'>
            <InputGroup 
                id='username' 
                name='username' 
                value={signupSnap.formFields.username} 
                onChange={signupState.handleSignupFormChange} 
                autoComplete='username' 
                placeholder='fFarkas14' 
                required 
                disabled={signupSnap.userFieldsDisabled}/>
        </FormGroup>
        <FormGroup label='email' labelFor='email'>
            <InputGroup 
                id='email' type='email' 
                name='email' 
                value={signupSnap.formFields.email} 
                onChange={signupState.handleSignupFormChange} 
                autoComplete='email' 
                placeholder='philip@hornlegends.com' 
                required 
                disabled={signupSnap.userFieldsDisabled}/>
        </FormGroup>
        <FormGroup label='password' labelFor='password'>
            <InputGroup 
                id='password' type='password' 
                name='password' 
                value={signupSnap.formFields.password} 
                onChange={signupState.handleSignupFormChange} 
                autoComplete='new-password' 
                placeholder='' 
                required 
                disabled={signupSnap.userFieldsDisabled}/>
        </FormGroup>
        </>
    );
};

export default UserFields;