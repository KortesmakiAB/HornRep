import { useSnapshot } from 'valtio';
import { Button, FormGroup, InputGroup, Position, Toaster } from '@blueprintjs/core';

import { loginState } from '../App';
// TODO implement LOCAL STORAGE
// import useLocalStorage from '../shared/useLocalStorage';

import './Login.css';


const Login = () => {
    const authSnap = useSnapshot(loginState);
    
    const handleFormSubmit = (evt) => {
        evt.preventDefault();
        loginState.loginGetUser();
        loginState.setLoginIsNotOpen();
        const loginToast = Toaster.create({position: Position.BOTTOM});
        loginToast.show({
            intent:'success',
            message: `welcome back`,
            timeout: 3500,
            icon:'emoji',
        });
    };

    const handleCancel = () => loginState.setLoginIsNotOpen();

    return (
        <div className="Login">
            <form onSubmit={handleFormSubmit} className='Login-form'>
                <FormGroup label='email' labelFor='email'>
                    <InputGroup id="email" type='email' name="email" value={authSnap.unPw.email} onChange={loginState.handleLoginFormChange} autoComplete='email' required={true}/>
                </FormGroup>
                <FormGroup label='password' labelFor='password'>
                    <InputGroup id="password" name="password" value={authSnap.unPw.password} onChange={loginState.handleLoginFormChange} type='password' autoComplete='current-password' required={true}/>
                </FormGroup>
                <div className='Btn-pair'>
                    <Button type='button' intent='danger' onClick={handleCancel}>Cancel</Button>
                    <Button type='submit' intent='primary'>Submit</Button>
                </div>
            </form>
            <div className='Login-signup'>
                <span>create a <a href='/signup'>HornRep account</a></span>
            </div>
            <Toaster ></Toaster>
        </div>
    );
};

export default Login;