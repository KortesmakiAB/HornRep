import { useSnapshot } from 'valtio';
import { FormGroup, Checkbox } from '@blueprintjs/core';

import { accompState } from './Accomp';

const AccompAccompDiff = () => {
    const accompSnap = useSnapshot(accompState);

    const handleAccompDiffCheckboxChange = (evt) => {
        const accompDiff = evt.target.getAttribute('data-accomp-diff');
        accompState.setCheckboxesAccompDifficulty(accompDiff);
    };

    return (
        <FormGroup label="accompaniment difficulty" labelFor="accompDifficulty">
            <Checkbox 
                data-accomp-diff="novice" 
                name="accompDifficulty" 
                label="novice" 
                inline="true" 
                value={accompSnap.checkboxesAccompDifficulty.novice} 
                onChange={handleAccompDiffCheckboxChange} 
            />
            <Checkbox 
                data-accomp-diff="intermediate" 
                name="accompDifficulty" 
                label="intermediate" 
                inline="true" 
                value={accompSnap.checkboxesAccompDifficulty.intermediate} 
                onChange={handleAccompDiffCheckboxChange} 
            />
            <Checkbox 
                data-accomp-diff="advanced" 
                name="accompDifficulty" 
                label="advanced" 
                inline="true" 
                value={accompSnap.checkboxesAccompDifficulty.advanced} 
                onChange={handleAccompDiffCheckboxChange} 
            />
        </FormGroup>
    );
};

export default AccompAccompDiff;