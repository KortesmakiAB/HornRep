import { useSnapshot } from 'valtio'
import { H3, Card, Classes } from "@blueprintjs/core";
import { Link } from 'react-router-dom';

import { searchFormState } from '../App';
import { localStorageState } from '../utilities/useLocalStorage';

import SearchForm from '../forms/SearchForm';

import './Home.css';
import { getYear } from '../utilities/getYear';

const Home = () => {
    const lsSnap = useSnapshot(localStorageState);
    // if there is a token in LS, user should not need to re-login and is considered logged in.
    const isLoggedIn = lsSnap.item;
    searchFormState.loadFormChoicesData();
    
    const snap = useSnapshot(searchFormState);

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
                : (<Card className='Card'>
                    <H3 className={Classes.SKELETON}>What is HornRep?</H3>
                    <p className={Classes.SKELETON}>
                        HornRep is a powerful resource for helping horn players of all skill levels find appropriate solo repertoire. 
                    </p>
                    <p className={Classes.SKELETON}>
                        Think of it as a launching pad for finding the exact work you've been dreaming about...or just casually browse.
                    </p>
                    
                    <p className={Classes.SKELETON}>
                        Use the search form below to be as specific or general as you wish. 
                    </p>
                    
                </Card>)
            }
            {
                isLoggedIn
                ? null
                :
                <Card className='Card'>
                    <div>
                        <span>create a <a href='/signup'>HornRep account</a></span>
                    </div>
                </Card>
            }
            
            <footer><small>web work by Aaron Brant - { getYear() }</small></footer>
        </div>
    );
};

export default Home;