import { Button, FormGroup, InputGroup, Toaster } from '@blueprintjs/core';
import { Redirect, useHistory } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import jwt from 'jsonwebtoken';

import { signupState, userState } from '../App';
import HornRepApi from '../tools/api';

import './Signup.css';

const Signup = () => {
    const signupSnap = useSnapshot(signupState);
    const userSnap = useSnapshot(userState);
    const history = useHistory();

    const handleSignupSubmit = (evt) => {
        evt.preventDefault();
        (async () => {
            const respToken = await HornRepApi.register(signupSnap.formFields);
      
            if (respToken){
                HornRepApi.token = respToken;
                userState.setToken(respToken);
                // HornRepApi.register() returns token with { id(userId), isAdmin }
                const decodedToken = jwt.decode(respToken)
                const user = await HornRepApi.getUser(decodedToken.id);
                delete user.password
                userState.setUser(user);
                userState.setIsLoggedIn();
                const loginToast = Toaster.create();
                loginToast.show({
                    intent:'success',
                    message: `welcome to HornRep!`,
                    timeout: 3500,
                    icon:'emoji',
                });
            }
        })();
        history.push('./');
    };

    return (
        <>
        { 
            userSnap.isLoggedIn
            ? <Redirect to='./' />
            : (
                <form onSubmit={handleSignupSubmit}>
                    <FormGroup label='first name' labelFor='fName'>
                        <InputGroup id='fName' name='fName' value={signupSnap.formFields.fName} onChange={signupState.handleSignupFormChange} autoComplete='name' required/>
                    </FormGroup>
                    <FormGroup label='last name' labelFor='lName'>
                        <InputGroup id='lName' name='lName' value={signupSnap.formFields.lName} onChange={signupState.handleSignupFormChange} autoComplete='name' required/>
                    </FormGroup>
                    <FormGroup label='username' labelFor='username'>
                        <InputGroup id='username' name='username' value={signupSnap.formFields.username} onChange={signupState.handleSignupFormChange} autoComplete='username' required/>
                    </FormGroup>
                    <FormGroup label='email' labelFor='email'>
                        <InputGroup id='email' type='email' name='email' value={signupSnap.formFields.email} onChange={signupState.handleSignupFormChange} autoComplete='email' required/>
                    </FormGroup>
                    <FormGroup label='password' labelFor='password'>
                        <InputGroup id='password' type='password' name='password' value={signupSnap.formFields.password} onChange={signupState.handleSignupFormChange} autoComplete='new-password' required/>
                    </FormGroup>

                    <div className='Signup-btn'>
                        <Button type='submit' intent='primary' text='create account' />
                    </div>
                </form>
            )
        }
        </>
    );
};

export default Signup;