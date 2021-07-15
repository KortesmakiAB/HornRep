import { Route, Switch, Redirect } from 'react-router-dom';

import Home from '../addtl-pages/Home';
import Signup from '../auth/Signup';
import Works from '../works/Works';
import WorkDetails from '../works/WorkDetails';
// import Sarah from '../addtl-pages/Sarah';
import Browse from '../Browse/Browse';
import Collaborate from '../addtl-pages/Collaborate';
import LoggedInRoute from './LoggedInRoute';
import Profile from '../addtl-pages/Profile';


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

            <LoggedInRoute exact path='/profile'>
                <Profile />              
            </LoggedInRoute>

            <LoggedInRoute exact path='/collaborate'>
                <Collaborate />              
            </LoggedInRoute> 

            <Redirect to='/' />
        </Switch>
    );
}

export default Routes;

// <LoggedInRoute exact path='/works/add'>
//     <AddWork />
// </LoggedInRoute>

// <LoggedInRoute exact path='/works/:id/edit'>
//     <EditWork />                
// </LoggedInRoute>

// <LoggedInRoute exact path='/composers/add'>
//     <EditComposer />                
// </LoggedInRoute>

// <LoggedInRoute exact path='/composers/:id/edit'>
//     <EditComposer />                
// </LoggedInRoute>

