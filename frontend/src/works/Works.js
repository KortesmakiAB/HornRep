import { useSnapshot } from 'valtio';
import { Card, H3, H4, Icon } from "@blueprintjs/core";
import { searchFormState, worksState } from '../App';

import WorkCard from './WorkCard';

import './Works.css';

const Works = () => {
    
    const worksSnap = useSnapshot(worksState);
    
    const cards = worksSnap.worksList.map(w => <WorkCard key={w.id} props={w} />);
    const handleQuestClick = () => searchFormState.resetFormFields();

    const noResults = (
        <>
        <H4>Sad! No horn solos found.</H4>
        <a onClick={handleQuestClick} href={'/'}><span>Continue your quest to find great HornRep</span></a>
        </>
    );

    return (
        <>
        <div className='Works'>
            <H3>Search Results</H3>
            <div>
                { worksSnap.worksList.length
                    ? cards
                    : noResults  
                }
            </div>
        </div>
        {
            worksSnap.worksList.length
            ? (
                <Card className='Card search-again'>
                    <p>
                        <Icon icon='search' className='Icon-m' />
                        <a href='/'>Search Again</a>
                    </p>
                </Card>
            )
            : null
        }
        </>
    );
};

export default Works;