import { Alignment, Button, Dialog, Drawer, Navbar, Position, Toaster } from '@blueprintjs/core';
import { useSnapshot } from 'valtio';
import { useHistory } from 'react-router-dom';

import { userState, loginState, navState } from '../App';
import Login from '../auth/Login';

import './Nav.css';


const Nav = () => {
    const history = useHistory(); 
    const userSnap = useSnapshot(userState);
    const authSnap = useSnapshot(loginState);
    const navSnap = useSnapshot(navState);

    const handleDialogueClose = () => loginState.setLoginIsNotOpen();
    const handleBurgerClick = (evt) => navState.setIsMenuOpened();
    const handleHomeClick = () => history.push('/');
    const handleBrowseClick = () => {
        history.push('/works/browse');
        navState.setIsMenuClosed();
    };
    const handleProfileClick = () => {
        history.push('/profile');
        navState.setIsMenuClosed();
    };
    const handleLoginClick = () => { 
        loginState.setLoginIsOpen();
        navState.setIsMenuClosed();
    };
    const handleLogoutClick = () => {
        const logoutToast = Toaster.create({position: Position.BOTTOM});
        logoutToast.show({
            intent:'warning',
            message: `goodbye ${userSnap.user.username}`,
            timeout: 3500,
            icon:'hand',
        });
        userState.setToken('');
        userState.setUser({});
        userState.setIsNotLoggedIn();
        navState.setIsMenuClosed();
        history.push('/');
    };
    
    
    return (
        <>
        <Navbar className='Nav'>
            <Navbar.Group align={Alignment.LEFT} >
              {/* a logo would go nicely here */}
              {/* <Navbar.Divider /> */}
              <Button className="bp3-minimal" icon="home" text="Home" onClick={handleHomeClick}  />
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Button 
                    type='button'
                    className='bp3-minimal' 
                    icon='menu' 
                    onClick={handleBurgerClick} 
                    large={true}
                />
            </Navbar.Group>
        </Navbar>

        <Drawer
            autoFocus='true'
            icon='menu-open'
            isOpen={navSnap.isMenuOpen}
            onClose={() => navState.setIsMenuClosed()}
            title='menu'
            size='40%'
            isCloseButtonShown={false}

        >
            <div className='Nav-drawer-content'>
                <Button className="bp3-minimal Nav-drawer-btn" icon="box" text="Browse" onClick={handleBrowseClick}   />
                { userSnap.isLoggedIn
                    ? <Button className="bp3-minimal Nav-drawer-btn" icon="log-out" text="Logout" onClick={handleLogoutClick}  />
                    : <Button className="bp3-minimal Nav-drawer-btn" icon="log-in" text="Login" onClick={handleLoginClick}  />
                }
                { userSnap.isLoggedIn
                    ? <Button className="bp3-minimal Nav-drawer-btn" icon="user" text="profile" onClick={handleProfileClick}  />
                    : null
                }  
            </div>
        </Drawer>
            
        <Dialog 
            isOpen={authSnap.loginIsOpen}
            onClose={handleDialogueClose}
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