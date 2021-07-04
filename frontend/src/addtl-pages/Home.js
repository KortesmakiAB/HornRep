import { useState } from 'react';
import { useSnapshot } from 'valtio'
import { subscribeKey } from 'valtio/utils';
import { Button } from "@blueprintjs/core";

import { searchFormState } from '../App';

import AdvancedSearchForm from '../forms/AdvancedSearchForm';
import QuickSearchForm from '../forms/QuickSearchForm';



const Home = () => {
    subscribeKey(searchFormState, 'isDataLoaded', (v) => console.log('searchFormState.isDataLoaded has changed to', v))
    
    searchFormState.loadCheckboxData();
    
    const snap = useSnapshot(searchFormState);
    
    return (
        <div>
            Home

            { snap.isDataLoaded
                ? <QuickSearchForm />    
                : '...Loading TODO' 
            }
            <Button onClick={() => searchFormState.setAdvancedSearch()} intent='success' outlined='true'>{ snap.isAdvancedSearch ? 'Use Quick Search' : 'Use Advanced Search' }</Button>
        </div>
    );
};

export default Home;