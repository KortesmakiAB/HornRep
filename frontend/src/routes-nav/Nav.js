import { Alignment, Button, Navbar } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

import './Nav.css';

const Nav = () => {
    const history = useHistory(); 

    const handleHomeClick = () => history.push('/');
    const handleBrowseClick = () => history.push('/works/browse');
    
    return (
        <Navbar className='Nav'>
            <Navbar.Group align={Alignment.LEFT} >
              {/* a logo would go nicely here */}
              {/* <Navbar.Divider /> */}
              <Button className="bp3-minimal" icon="home" text="Home" onClick={handleHomeClick}  />
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT} >
              <Button className="bp3-minimal" icon="box" text="Browse" onClick={handleBrowseClick}/>
            </Navbar.Group>
        </Navbar>
    );
};

export default Nav;