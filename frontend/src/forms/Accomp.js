import { proxy, useSnapshot } from 'valtio';

import AccompType from './AccompType';
import AccompDiff from './AccompDiff';

export const accompState = proxy({
    checkboxesAccompType: {
        'orchestra': false,
        'piano': false,
        'unaccompanied': false,
    },
    setCheckboxesAccompType(accomp) { this.checkboxesAccompType[accomp] = !this.checkboxesAccompType[accomp] },
    setCheckboxesUnaccomp() { 
        this.checkboxesAccompType = ({
        'orchestra': false,
        'piano': false,
    })},

    checkboxesAccompDifficulty: {
        'novice': false,
        'intermediate': false,
        'advanced': false,
    },
    setCheckboxesAccompDifficulty(accompDiff) { this.checkboxesAccompDifficulty[accompDiff] = ! this.checkboxesAccompDifficulty[accompDiff] },
});
const Accomp = ({ newWork }) => {
    const accompSnap = useSnapshot(accompState);

    return (
        <>
        <AccompType newWork={newWork} />
        { 
            newWork && accompSnap.checkboxesAccompType.unaccompanied
            ? null 
            : <AccompDiff />
        }
        </>
    );
};

export default Accomp;