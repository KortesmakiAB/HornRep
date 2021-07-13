import { useSnapshot } from 'valtio'
import { H3, Card } from "@blueprintjs/core";
import { Link } from 'react-router-dom';

import { searchFormState, userState } from '../App';

import SearchForm from '../forms/SearchForm';
// import Loading from '../tools/Loading';

import './Home.css';

const Home = () => {
    
    searchFormState.loadCheckboxData();
    
    const snap = useSnapshot(searchFormState);
    const userSnap = useSnapshot(userState);

    return (
        <div>
            <Card className='Card'>
                <H3>What is HornRep?</H3>
                <p>
                    HornRep is a powerful resource for helping horn players of all skill levels find appropriate solo repertoire. 
                </p>
                <p>
                    Think of it as a launching pad for finding the exact work you've been dreaming about...or just casually browse.
                </p>
                
                <p>
                    Use the search form below to be as specific or general as you wish. 
                </p>
                <p>
                    Alternatively, <Link to='/works/browse'>browse</Link> by title or composer.
                </p>
                
            </Card>
            <Card className='Card'>
                <H3>About HornRep</H3>
                <p>
                    HornRep is a product of Doctor Sarah Schouten's doctoral dissertation.
                </p>
                <p>
                    Her vision is to create a tool which benefits the entire horn community.
                </p>
            </Card>
            { 
                snap.isDataLoaded
                ? <SearchForm />    
                : '...Loading TODO' 
                // : <Loading />
            }
            {
                userSnap.isLoggedIn
                ? null
                :
                <Card className='Card'>
                    <div>
                        <span>create a <a href='/signup'>HornRep account</a></span>
                    </div>
                </Card>
            }
            
            <footer><small>web work by Aaron Brant</small></footer>
        </div>
    );
};

export default Home;