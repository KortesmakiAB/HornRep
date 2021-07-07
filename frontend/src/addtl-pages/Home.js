import { useSnapshot } from 'valtio'

import { searchFormState } from '../App';

import SearchForm from '../forms/SearchForm';
// import Loading from '../tools/Loading';


const Home = () => {
    
    searchFormState.loadCheckboxData();
    
    const snap = useSnapshot(searchFormState);

    return (
        <div>
            Home

            { snap.isDataLoaded
                ? <SearchForm />    
                : '...Loading TODO' 
                // : <Loading />
            }
            
        </div>
    );
};

export default Home;