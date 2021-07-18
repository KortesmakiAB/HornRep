import { useSnapshot } from 'valtio';
import { useHistory } from 'react-router-dom';

import { accompState } from './Accomp';
import { composerSelectState } from './ComposerSelect';
import { countryMultiSelectState } from './CountryMultiSelect';
import { countrySelectState } from './CountrySelect';
import { difficultyState } from './Difficulty';
import { durationState } from './Duration';
import { eraStyleMultiState } from './EraStyleMultiSelect';
import { eraStyleSelectState } from './EraStyleSelect';
import { genderState } from './GenderSelect';
import { highestLowestState } from './HighestLowestNotes';
import { newWorkState } from './NewWork';
import { searchFormState, worksState } from '../App';
import { userState } from '../App';

import HornRepApi from '../utilities/api';



const useFormSubmitHelpers = () => {
    const accompSnap = useSnapshot(accompState);
    const composerSelectSnap = useSnapshot(composerSelectState);
    const countrySelectSnap = useSnapshot(countrySelectState);
    const difficultySnap = useSnapshot(difficultyState);
    const durationSnap = useSnapshot(durationState); 
    const eraStyleMultiSnap = useSnapshot(eraStyleMultiState);
    const eraStyleSelectSnap = useSnapshot(eraStyleSelectState);
    const genderSnap = useSnapshot(genderState);
    const highestLowestSnap = useSnapshot(highestLowestState);
    const multiSelectSnap = useSnapshot(countryMultiSelectState);
    const newWorkSnap = useSnapshot(newWorkState);
    const userSnap = useSnapshot(userState);

    const history = useHistory(); 

    const difficultyArr = [];
    for (let key in difficultySnap.checkboxesDifficulty) {
        if (difficultySnap.checkboxesDifficulty[key]) difficultyArr.push(key);
    }
    const eraStyleMultiResults = [];
    for (let key in eraStyleMultiSnap.erasStyles) {
        if (eraStyleMultiSnap.erasStyles[key]) eraStyleMultiResults.push(key);
    }
    const countriesResults = [];
    for (let key in multiSelectSnap.countriesState) {
        if (multiSelectSnap.countriesState[key]) countriesResults.push(key);
    }
    const accompTypeResults = [];
    for (let key in accompSnap.checkboxesAccomp) {
        if (accompSnap.checkboxesAccomp[key]) accompTypeResults.push(key);
    }
    const accompDiffResults = [];
    for (let key in accompSnap.checkboxesAccompDifficulty) {
        if (accompSnap.checkboxesAccompDifficulty[key]) accompDiffResults.push(key);
    }

    const searchFormSubmit = () => {
        const finalSearchObj = {}
        if (difficultyArr.length) finalSearchObj['difficulty'] = difficultyArr;
        if (eraStyleMultiResults.length) finalSearchObj['eraStyle'] = eraStyleMultiResults;
        if (countriesResults.length) finalSearchObj['countries'] = countriesResults;
        if (accompTypeResults.length) finalSearchObj['accompType'] = accompTypeResults;
        if (accompDiffResults.length && !accompTypeResults.includes('unaccompanied')) finalSearchObj['accompDifficulty'] = accompDiffResults;
        if (highestLowestSnap.highestNote.value) finalSearchObj['highestNote'] = highestLowestSnap.highestNote.value;
        if (highestLowestSnap.lowestNote.value) finalSearchObj['lowestNote'] = highestLowestSnap.lowestNote.value;
        if (genderSnap.gender) finalSearchObj['gender'] = genderSnap.gender;
        if (durationSnap.minDuration) finalSearchObj['minDuration'] = durationSnap.minDuration;
        if (durationSnap.maxDuration) finalSearchObj['maxDuration'] = durationSnap.maxDuration;

        for (let key in searchFormState.formFields){
            if (searchFormState.formFields[key]) finalSearchObj[key] = searchFormState.formFields[key];
        }
        worksState.worksSearch(finalSearchObj);
        searchFormState.resetFormFields();
        history.push('/works');
    };

    const newWorkSubmit = () => {
        // TODO try/catch
        (async () => {
            const newWorkObj = {
                // these 2 are required
                title: newWorkSnap.formFields.title,
                compId: composerSelectSnap.composerObj.id,
            };

            if (eraStyleSelectSnap.length) newWorkObj['eraStyle'] = eraStyleSelectSnap.eraStyle;
            if (difficultyArr.length) newWorkObj['difficulty'] = difficultyArr.join();
            if (durationSnap.minDuration) newWorkObj['minDuration'] = durationSnap.minDuration;
            if (durationSnap.maxDuration) newWorkObj['maxDuration'] = durationSnap.maxDuration;
            if (highestLowestSnap.highestNote.value) newWorkObj['highestNote'] = highestLowestSnap.highestNote.value;
            if (highestLowestSnap.lowestNote.value) newWorkObj['lowestNote'] = highestLowestSnap.lowestNote.value;
            if (accompTypeResults.length) newWorkObj['accompType'] = accompTypeResults.join();
            if (accompDiffResults.length) newWorkObj['accompDifficulty'] = accompDiffResults.join();

            // TODO add movements component results

            // TODO iterate over formFields, taking only the good values

            const resp = await HornRepApi.newWork(userState.user.id, newWorkObj);
            newWorkState.resetFormFields();
            history.push(`works/${resp.newWorkId}`);
        })();

    };

    return { searchFormSubmit, newWorkSubmit };

};

export default useFormSubmitHelpers;