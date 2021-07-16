import { proxy, useSnapshot } from 'valtio';
import { Button, FormGroup, InputGroup, Position, Toaster } from '@blueprintjs/core';
import jwt from 'jsonwebtoken';
import HornRepApi from '../utilities/api';

// TODO implement LOCAL STORAGE
import { TOKEN_STORAGE_KEY, userState } from '../App';
import useLocalStorage, { localStorageState } from '../utilities/useLocalStorage';
import './Login.css';

export const loginState = proxy({
    unPw: {
         email: '',
         password: '',
    },
    setUnPw (name, value) { this.unPw[name] = value },
  
    handleLoginFormChange(evt) {
      const { name, value } = evt.target;
      loginState.setUnPw(name, value);
    },
 
    loginGetUser() {
        // TODO try/catch and handle invalid combos
        (async () => {
        const respToken = await HornRepApi.login(this.unPw);
    
            if (respToken){
                HornRepApi.token = respToken;
                localStorageState.setItem(respToken);
                localStorage.setItem(TOKEN_STORAGE_KEY, respToken);
                // HornRepApi.login() returns token with { id(userId), isAdmin }
                const decodedToken = jwt.decode(respToken);
                const user = await HornRepApi.getUser(decodedToken.id);
                delete user.password
                userState.setUser(user);
            }
        })();
    },
 
   loginIsOpen: false,
   setLoginIsOpen() { this.loginIsOpen = true },
   setLoginIsNotOpen() { this.loginIsOpen = false },
});

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