import { Route, useHistory } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import { loginState, userState } from '../App';

const LoggedInRoute = ({ exact, path, children }) => {
    const userSnap = useSnapshot(userState);
    const history = useHistory();

    if (!userSnap.isLoggedIn) {
        history.push('/');
        loginState.setLoginIsOpen();
    }

    return (
        <Route exact={exact} path={path} >
            {children}
        </Route>
    );
};

export default LoggedInRoute;