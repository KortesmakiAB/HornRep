import { Alignment, Button, Dialog, Drawer, Navbar, Position, Toaster } from '@blueprintjs/core';
import { useSnapshot } from 'valtio';
import { useHistory } from 'react-router-dom';

import { userState, navState } from '../App';
import { loginState } from '../auth/Login';
import Login from '../auth/Login';

import './Nav.css';


const Nav = () => {
    const history = useHistory(); 
    const userSnap = useSnapshot(userState);
    const authSnap = useSnapshot(loginState);
    const navSnap = useSnapshot(navState);

    const handleDialogueClose = () => loginState.setLoginIsNotOpen();
    const handleBurgerClick = () => navState.setIsMenuOpened();
    const handleHomeClick = () => history.push('/');

    const handleMostClicks = (evt) => {
        const buttonText = evt.target.textContent;

        if (buttonText === 'login') loginState.setLoginIsOpen();
        else if (buttonText === 'browse') history.push('/works/browse');
        else if (buttonText === 'profile') history.push('/profile');
        else if (buttonText === 'collaborate') history.push('/collaborate');
        
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
                <Button className="bp3-minimal Nav-drawer-btn" icon="box" text="browse" onClick={handleMostClicks}   />
                {
                    userSnap.isLoggedIn
                    ? <Button className="bp3-minimal Nav-drawer-btn" icon="add" text="collaborate" onClick={handleMostClicks}  />
                    : null
                }
                { userSnap.isLoggedIn
                    ? <Button className="bp3-minimal Nav-drawer-btn" icon="user" text="profile" onClick={handleMostClicks}  />
                    : null
                }
                { userSnap.isLoggedIn
                    ? <Button className="bp3-minimal Nav-drawer-btn" icon="log-out" text="logout" onClick={handleLogoutClick}  />
                    : <Button className="bp3-minimal Nav-drawer-btn" icon="log-in" text="login" onClick={handleMostClicks}  />
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