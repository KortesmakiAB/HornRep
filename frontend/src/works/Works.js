import { useSnapshot } from 'valtio';
import { H3, H4 } from "@blueprintjs/core";
import { Link } from 'react-router-dom';
import { worksState } from '../App';

import WorkCard from './WorkCard';

import './Works.css';

const Works = () => {
    
    const worksSnap = useSnapshot(worksState);
    
    const cards = worksSnap.worksList.map(w => <WorkCard key={w.id} props={w} />);

    const noResults = (
        <>
        <H4>Sad! No horn solos found.</H4>
        {/* TODO use history.push instead?? to reset search or at least a handle click to reset search fields */}
        <Link to={'/'}><span>Continue your quest to find great HornRep</span></Link>
        </>
    );

    return (
        <div className='Works'>
            <H3>Search Results</H3>
            <div>
                { worksSnap.worksList.length
                    ? cards
                    : noResults  }
            </div>
        </div>
    );
};

export default Works;