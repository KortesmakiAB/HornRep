import { proxy, useSnapshot } from 'valtio';
import { Button, Card, FormGroup, InputGroup } from '@blueprintjs/core';

import HornRepApi from '../utilities/api';
import HighestLowestNotes from './HighestLowestNotes';
import Difficulty from './Difficulty';
import Duration from './Duration';
import AccompAccompDiff from './AccompAccompDiff';

import { userState } from '../App';
// import ComposerSelect from './ComposerSelect';

const initialNewWorkFfState = {
    // required
    title: '',
    compId: '',
    submittedBy: '',
    // optional
    duration: '',
    eraStyle: '',
    highestNote: '',
    lowestNote: '',
    difficulty: '',
    techniques: '',
    clef: '',
    compYr: '',
    accompType: '' ,
    accompDifficulty: '',
}
export const newWorkState = proxy({
    formFields: {...initialNewWorkFfState},
    setFormField(field, val) { this.formFields[field] = val },
    resetFormFields(){ this.formFields = {...initialNewWorkFfState} },

    handleFormChange(evt) {
		const { name, value } = evt.target;
        newWorkState.setFormField(name, value);
    },

    handleNewWorkSubmit(evt) {
        evt.preventDefault();
        // TODO try/catch
        (async () => {
            const resp = await HornRepApi.newWork(userState.user.id, newWorkState.formFields);
            newWorkState.resetFormFields();
        })();
    },
});


const NewWork = () => {

    const newWorkSnap = useSnapshot(newWorkState);

    return (
        <Card className='Card'>
            <form onSubmit={newWorkState.handleNewWorkSubmit}>
                <FormGroup label='title' labelFor='title' >
                    <InputGroup
                        id='title'
                        type='text'
                        name='title'
                        value={newWorkSnap.formFields.title}
                        onChange={newWorkState.handleFormChange}
                    />
                </FormGroup>
                
                <HighestLowestNotes />
                <Difficulty />
                <Duration />
                <AccompAccompDiff />
                <div className='Btn-pair'>
                    <Button
                        intent='primary'
                        text='add Work'
                    />
                </div>
            </form>
        </Card>
    );
};

export default NewWork;