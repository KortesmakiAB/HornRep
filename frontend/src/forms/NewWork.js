import { proxy, useSnapshot } from 'valtio';
import { Button, Card, FormGroup, InputGroup } from '@blueprintjs/core';

import HighestLowestNotes from './HighestLowestNotes';
import Difficulty from './Difficulty';
import DurationSlider from './DurationSlider';
import Accomp from './Accomp';
import EraStyleSelect from './EraStyleSelect';
import ComposerSelect from './ComposerSelect';
import useFormSubmitHelpers from './useFormSubmitHelpers';
import MovementsForm from './MovementsForm';


const initialNewWorkFormState = {
    // required
    title: '',
    // optional
    techniques: '',     // TODO note re comma separated
    clef: '',
    compYr: '',         // TODO deal with clef
}
export const newWorkState = proxy({
    formFields: {...initialNewWorkFormState},
    setFormField(field, val) { this.formFields[field] = val },
    resetFormFields(){ this.formFields = {...initialNewWorkFormState} },
});


const NewWork = () => {
    const { newWorkSubmit } = useFormSubmitHelpers();
    const newWorkSnap = useSnapshot(newWorkState);

    function handleFormChange(evt) {
		const { name, value } = evt.target;
        newWorkState.setFormField(name, value);
    }

    const handleNewWorkSubmit = (evt) => {
        evt.preventDefault();
        newWorkSubmit();
    };

    return (
        <Card className='Card'>
            <form onSubmit={handleNewWorkSubmit}>
                <FormGroup label='title' labelFor='title' helperText=' *required' >
                    <InputGroup
                        id='title'
                        type='text'
                        name='title'
                        value={newWorkSnap.formFields.title}
                        onChange={handleFormChange}
                        required={true}
                    />
                </FormGroup>
                <ComposerSelect helperText=' *required' />
                <EraStyleSelect />
                <Difficulty />
                <DurationSlider />
                <HighestLowestNotes />
                <Accomp newWork={true} />
                
                <MovementsForm />
                <div className='Btn-pair'>
                    <Button
                        type='submit'
                        intent='primary'
                        text='add Work'
                    />
                </div>
            </form>
        </Card>
    );
};

export default NewWork;