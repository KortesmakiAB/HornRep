import { useSnapshot } from 'valtio';
import { Card, Elevation, H3, H4, UL } from "@blueprintjs/core";
import { Link } from 'react-router-dom';
import { worksState } from '../App';

import './Works.css';

const Works = () => {
    
    const worksSnap = useSnapshot(worksState);
    
    const cards = worksSnap.worksList.map(w => 
        <Card key={w.id} interactive={true} elevation={Elevation.TWO} className='Card'>
            <Link to={`/works/${w.id}`}><H4>{w.title}</H4></Link>
            <UL>
                <li><b>composer:</b> {w.fName} {w.lName}</li>
                <li><b>duration:</b> "{w.duration}"</li>
                <li><b>level:</b> {w.difficulty}</li>
                <li><b>era/style:</b> {w.eraStyle}</li>
                <Link to={`/works/${w.id}`}>more details...</Link>
            </UL>
        </Card>
    );

    const noResults = (
        <>
        <H4>Sad! No horn solos found.</H4>
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