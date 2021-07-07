import { useState } from 'react';
import { useSnapshot } from 'valtio'
import { subscribeKey } from 'valtio/utils';
import { Button } from "@blueprintjs/core";

import { searchFormState } from '../App';

import SearchForm from '../forms/SearchForm';



const Home = () => {
    subscribeKey(searchFormState, 'isDataLoaded', (v) => console.log('searchFormState.isDataLoaded has changed to', v))
    
    searchFormState.loadCheckboxData();
    
    const snap = useSnapshot(searchFormState);

    return (
        <div>
            Home

            { snap.isDataLoaded
                ? <SearchForm />    
                : '...Loading TODO' 
            }
            
        </div>
    );
};

export default Home;