import { useSnapshot } from 'valtio';
import { Button, FormGroup, InputGroup, Toaster } from '@blueprintjs/core';

import { authState } from '../App';
// TODO implement LOCAL STORAGE
// import useLocalStorage from '../shared/useLocalStorage';

import './Login.css';



const Login = () => {
    const authSnap = useSnapshot(authState);
    
    const handleFormSubmit = (evt) => {
        evt.preventDefault();
        authState.loginGetUser();
        authState.setLoginIsNotOpen();
        const loginToast = Toaster.create();
        loginToast.show({
            intent:'success',
            message: `welcome back`,
            timeout: 3500,
            icon:'emoji',
        });
    };

    const handleCancel = () => authState.setLoginIsNotOpen();

    return (
        <div className="Login">
            <form onSubmit={handleFormSubmit} className='Login-form'>
                <FormGroup label='username' labelFor='username'>
                    <InputGroup id="username" name="username" value={authSnap.unPw.username} onChange={authState.handleLoginFormChange} />
                </FormGroup>
                <FormGroup label='password' labelFor='password'>
                    <InputGroup id="password" name="password" value={authSnap.unPw.password} onChange={authState.handleLoginFormChange} type='password' />
                </FormGroup>
                <FormGroup className='Login-btns'>
                    <Button type='button' intent='danger' onClick={handleCancel}>Cancel</Button>
                    <Button type='submit' intent='primary' className='Login-submit-btn'>Submit</Button>
                </FormGroup>
            </form>
            <Toaster ></Toaster>
        </div>
    );
};

export default Login;

//     return (
// 		<div className="Login">
// 			<h3>Login</h3>
// 			<Form className="border mt-4 p-4" onSubmit={handleSubmit}>
// 				<FormGroup className="mb-3">
// 					<Label for="username" className="my-1">Username</Label>
// 					<Input 
// 						id="username" 
// 						name="username"
// 						type="text"
// 						value={unPw.username} 
// 						onChange={handleChange}
// 						placeholder=""
// 					></Input>
// 				</FormGroup>
// 				<FormGroup className="mb-3">
// 					<Label for="password" className="my-1">Password</Label>
// 					<Input 
// 						id="password" 
// 						name="password"
// 						type="password"
// 						value={unPw.password} 
// 						onChange={handleChange}
// 						placeholder=""
// 					></Input>
// 				</FormGroup>
				
// 				<Button color="primary" className="" >Submit</Button>
// 			</Form>
// 		</div>
        
//     );
// }

// export default Login;
  