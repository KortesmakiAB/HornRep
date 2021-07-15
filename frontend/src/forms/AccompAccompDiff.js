import { proxy, useSnapshot } from "valtio";
import { FormGroup, Checkbox } from '@blueprintjs/core';

export const accompState = proxy({
    checkboxesAccomp: {
        'orchestra': false,
        'piano': false,
        'unaccompanied': false,
    },
    setCheckboxesAccomp(accomp){ this.checkboxesAccomp[accomp] = !this.checkboxesAccomp[accomp] },

    checkboxesAccompDifficulty: {
        'novice': false,
        'intermediate': false,
        'advanced': false,
    },
    setCheckboxesAccompDifficulty(accompDiff) { this.checkboxesAccompDifficulty[accompDiff] = ! this.checkboxesAccompDifficulty[accompDiff] },
});
const AccompAccompDiff = () => {
    const accompSnap = useSnapshot(accompState);

    const handleAccompCheckboxChange = (evt) => {
        const accompType = evt.target.getAttribute('data-accomp');
        accompState.setCheckboxesAccomp(accompType);
    };
    const handleAccompDiffCheckboxChange = (evt) => {
        const accompDiff = evt.target.getAttribute('data-accomp-diff');
        accompState.setCheckboxesAccompDifficulty(accompDiff);
    };

    return (
        <>
        <FormGroup label="accompaniment" labelFor="accompaniment">
            <Checkbox 
                data-accomp="orchestra" 
                name="accompaniment" 
                label="orchestra" 
                inline="true" 
                value={accompSnap.checkboxesAccomp.orchestra} 
                onChange={handleAccompCheckboxChange} 
            />
            <Checkbox 
                data-accomp="piano" 
                name="accompaniment" 
                label="piano" 
                inline="true" 
                value={accompSnap.checkboxesAccomp.piano} 
                onChange={handleAccompCheckboxChange} 
            />
            <Checkbox 
                data-accomp="unaccompanied" 
                name="accompaniment" 
                label="unaccompanied" 
                inline="true" 
                value={accompSnap.checkboxesAccomp.unaccompanied} 
                onChange={handleAccompCheckboxChange} 
            />
        </FormGroup>
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
        </>
    );
};

export default AccompAccompDiff;