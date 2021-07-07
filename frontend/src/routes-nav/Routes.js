import { Route, Switch, Redirect } from 'react-router-dom';

import Home from '../addtl-pages/Home';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import Works from '../works/Works';
import WorkDetails from '../works/WorkDetails';
import Sarah from '../addtl-pages/Sarah';
import WorksByTitle from '../addtl-pages/WorksByTitle';
import WorksByComposer from '../addtl-pages/WorksByComposer';



function Routes() {

    return (
        <Switch>
            <Route exact path='/'>
                <Home />
            </Route>

            <Route exact path='/login'>
                <Login />
            </Route>

            <Route exact path='/signup'>
                <Signup />
            </Route>

            <Route exact path='/works'>
                <Works />
            </Route>

            <Route exact path='/works/research'>
                <Sarah />
            </Route>

            <Route exact path='/works/title'>
                <WorksByTitle />
            </Route>

            <Route exact path='/works/composer'>
                <WorksByComposer />
            </Route>

            <Route exact path='/works/:id'>
                <WorkDetails />
            </Route>


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

// <ProtectedRoute exact path='/profile'>
//      <Profile />              
// </ProtectedRoute>

// <ProtectedRoute exact path='/profile/edit'>
//      <EditProfile />              
// </ProtectedRoute> 