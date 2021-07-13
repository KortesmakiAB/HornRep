import { Route, Switch, Redirect } from 'react-router-dom';

import Home from '../addtl-pages/Home';
import Signup from '../auth/Signup';
import Works from '../works/Works';
import WorkDetails from '../works/WorkDetails';
// import Sarah from '../addtl-pages/Sarah';
import Browse from '../Browse/Browse';


function Routes() {

    return (
        <Switch>
            <Route exact path='/'>
                <Home />
            </Route>

            <Route exact path='/signup'>
                <Signup />
            </Route>

            <Route exact path='/works'>
                <Works />
            </Route>

            {/* <Route exact path='/works/research'>
                <Sarah />
            </Route> */}

            <Route exact path='/works/browse'>
                <Browse />
            </Route>

            <Route exact path='/works/:id'>
                <WorkDetails />
            </Route>

            {/* <ProtectedRoute exact path='/profile'>
                <Profile />              
            </ProtectedRoute>

            <ProtectedRoute exact path='/profile/edit'>
                <EditProfile />              
            </ProtectedRoute>  */}

            <Redirect to='/' />
        </Switch>
    );
}

export default Routes;

// <ProtectedRoute exact path='/works/add'>
//     <AddWork />
// </ProtectedRoute>

// <ProtectedRoute exact path='/works/:id/edit'>
//     <EditWork />                
// </ProtectedRoute>

// <ProtectedRoute exact path='/composers/add'>
//     <EditComposer />                
// </ProtectedRoute>

// <ProtectedRoute exact path='/composers/:id/edit'>
//     <EditComposer />                
// </ProtectedRoute>

