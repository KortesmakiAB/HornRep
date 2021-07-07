import { Suspense } from 'react';
import { useSnapshot } from 'valtio';
import { UL, H2, H3, Callout } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';

import { workDetailsState } from '../App';

// import Loading from '../tools/Loading';

import './Works.css';


const WorkDetails = () => {
    const { id } = useParams();

  
    const WorkDeets = () => {
        workDetailsState.loadWorkDeets(id);
        const workDeetsSnap = useSnapshot(workDetailsState);
        const {title, description, duration, difficulty, eraStyle, compYr, highestNote, clef,
            lowestNote, techniques, fName, lName, country, gender, accompType, accompDifficulty,
        } = workDeetsSnap.workDetails;

        return (
            <>
            <H2>{title}</H2>
            <Callout intent='success' icon={null} >
                {description}
            </Callout>
            <H3>Work</H3>
            <UL>
                { duration ? <li><b>duration:</b> "{duration}"</li> : null }
                { difficulty ? <li><b>level:</b> {difficulty}</li> : null }
                { eraStyle ? <li><b>era/style:</b> {eraStyle}</li> : null }
                { compYr ? <li><b>year of composition:</b> {compYr}</li> : null }
                { highestNote ? <li><b>highest note:</b> {highestNote}</li> : null }
                { lowestNote ? <li><b>lowest note:</b> {lowestNote}</li> : null }
                { techniques ? <li><b>technique(s):</b> {techniques}</li> : null }
                { clef ? <li><b>clef(s):</b> {clef}</li> : null }
                { accompType ? <li><b>accompaniment type:</b> {accompType}</li> : null }
                { accompDifficulty ? <li><b>accompaniment difficulty:</b> {accompDifficulty}</li> : null }
            </UL>
            <H3>Composer</H3>
            <UL>
                <li><b>composer:</b> {fName} {lName}</li>
                <li><b>country/region:</b> {country}</li>
                <li><b>gender:</b> {gender}</li>
            </UL>
            </>
        );
    };


    return (
        <Suspense fallback={<span>TODO Loading component.....................</span>}>
            <WorkDeets />
        </Suspense>
    );
};

export default WorkDetails;