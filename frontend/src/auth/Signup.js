import { Button, Card, Elevation, FormGroup, H3, InputGroup, Toaster } from '@blueprintjs/core';
import { Redirect, useHistory } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import jwt from 'jsonwebtoken';

import { signupState, userState } from '../App';
import HornRepApi from '../tools/api';
import UserFields from '../forms/UserFields';

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
            ? <Redirect to='/' />
            : (
                <>
                <Card elevation={Elevation.TWO} className='Card'>
                    <p>
                        Get involved, creat an account and make your contribution to HornRep.
                    </p>
                </Card>
                <Card elevation={Elevation.TWO} className='Card'>
                    <H3>register</H3>
                    <form onSubmit={handleSignupSubmit}>
                        <UserFields />
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
                        <div className='Signup-btn'>
                            <Button type='submit' intent='primary' text='create account' />
                        </div>
                    </form>
                </Card>
                </>
            )
        }
        </>
    );
};

export default Signup;