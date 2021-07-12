import { Alignment, Button, Dialog, Navbar, Toaster } from '@blueprintjs/core';
import { useSnapshot } from 'valtio';
import { useHistory } from 'react-router-dom';

import { userState, loginState } from '../App';
import Login from '../auth/Login';

import './Nav.css';

const Nav = () => {
    const history = useHistory(); 
    const userSnap = useSnapshot(userState);
    const authSnap = useSnapshot(loginState);

    const handleHomeClick = () => history.push('/');
    const handleBrowseClick = () => history.push('/works/browse');
    const handleLoginClick = () => loginState.setLoginIsOpen();
    const handleLogoutClick = () => {
        const logoutToast = Toaster.create();
        logoutToast.show({
            intent:'warning',
            message: `goodbye ${userSnap.user.username}`,
            timeout: 3500,
            icon:'hand',
        });
        userState.setToken('');
        userState.setUser({});
        userState.setIsNotLoggedIn();
        
    };
    const handleClose = () => loginState.setLoginIsNotOpen();
    
    return (
        <>
        <Navbar className='Nav'>
            <Navbar.Group align={Alignment.LEFT} >
              {/* a logo would go nicely here */}
              {/* <Navbar.Divider /> */}
              <Button className="bp3-minimal" icon="home" text="Home" onClick={handleHomeClick}  />
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT} >
                <Button className="bp3-minimal" icon="box" text="Browse" onClick={handleBrowseClick}/>
                { userSnap.isLoggedIn
                    ? <Button className="bp3-minimal" icon="log-out" text="Logout" onClick={handleLogoutClick}/>
                    : <Button className="bp3-minimal" icon="log-in" text="Login" onClick={handleLoginClick}/>
                }
            </Navbar.Group>
        </Navbar>
        <Dialog 
            isOpen={authSnap.loginIsOpen}
            onClose={handleClose}
            autoFocus={true}
            canOutsideClickClose={false}
            icon='log-in'
            title='login'
        >
            <div>
                <Login />    
            </div>
        </Dialog>
        </>

    );
};

export default Nav;