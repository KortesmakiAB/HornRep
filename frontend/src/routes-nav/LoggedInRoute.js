import { Route, useHistory } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import { loginState } from '../auth/Login';
import { localStorageState } from '../utilities/useLocalStorage';

const LoggedInRoute = ({ exact, path, children }) => {
    const lsSnap = useSnapshot(localStorageState);
    // if there is a token in LS, user should not need to re-login and is considered logged in.
    const isLoggedIn = lsSnap.item;
    const history = useHistory();
    
    if (!isLoggedIn) {
        loginState.setLoginIsOpen();
        history.push('/');
    }

    return (
        <Route exact={exact} path={path} >
            {children}
        </Route>
    );
};

export default LoggedInRoute;