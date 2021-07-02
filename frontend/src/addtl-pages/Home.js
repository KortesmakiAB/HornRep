import AdvancedSearchForm from '../forms/AdvancedSearchForm';
import QuickSearchForm from '../forms/QuickSearchForm';

import { useSnapshot } from 'valtio'
// import { subscribeKey } from 'valtio/utils';
import { searchFormState } from '../App';



const Home = () => {
    // subscribeKey(searchFormState, 'isAdvancedSearch', (v) => console.log('searchFormState.count has changed to', v))
    const snap = useSnapshot(searchFormState);
    
    
    return (
        <div>
            Home
            <button onClick={() => searchFormState.setAdvancedSearch()}>{ snap.isAdvancedSearch ? 'Use Quick Search' : 'Use Advanced Search' }</button>
            { snap.isAdvancedSearch
                ? <AdvancedSearchForm /> 
                : <QuickSearchForm />    
            }
            
            
        </div>
    );
};

export default Home;