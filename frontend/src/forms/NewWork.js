import { proxy, useSnapshot } from 'valtio';
import { Button, Card, FormGroup, Icon, InputGroup, NumericInput, TextArea } from '@blueprintjs/core';

import HighestLowestNotes from './HighestLowestNotes';
import Difficulty from './Difficulty';
import DurationSlider from './DurationSlider';
import Accomp from './Accomp';
import EraStyleSelect from './EraStyleSelect';
import ComposerSelect from './ComposerSelect';
import useFormSubmitHelpers from './useFormSubmitHelpers';
import MovementsForm from './MovementsForm';
import { getYear } from '../utilities/getYear';
import './NewWork.css';


const initialNewWorkFormState = {
    // required
    title: '',
    // optional
    description: '',    // TODO include a note to users re purpose
    techniques: '',     // TODO include a note to users re comma separated: '',         // TODO deal with clef
    clef: '',
    compYr: null,
}
export const newWorkState = proxy({
    formFields: {...initialNewWorkFormState},
    setFormField(field, val) { this.formFields[field] = val },
    resetFormFields(){ this.formFields = {...initialNewWorkFormState} },
});



const NewWork = () => {
    const { newWorkSubmit } = useFormSubmitHelpers();
    const newWorkSnap = useSnapshot(newWorkState);

    const currYear = getYear();
    if (newWorkSnap.formFields.compYr > currYear) newWorkState.setFormField('compYr', currYear);

    function handleFormChange(evt) {
		const { name, value } = evt.target;
        newWorkState.setFormField(name, value);
    }

    // docs advise against using the 1st param, which has the type 'number' and instead choose the 2nd parameter, which has the type 'string'.
    // I am ignoring this advice due to the simplicity of my use. No decimals, fractions, or math needed.
    const handleYearChange = (num, string) => { 
        // user input '-' causes 'NaN
        if (Number.isNaN(num)) newWorkState.setFormField('compYr', '');
        else newWorkState.setFormField('compYr', num);
    };

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
                <FormGroup label='description' labelFor='description'>
                    <TextArea
                        id='description'
                        name='description'
                        placeholder='Describe key features and pertinent details'
                        value={newWorkSnap.formFields.description}
                        onChange={handleFormChange}
                        fill={true}
                    />
                </FormGroup>
                <FormGroup label="techniques" labelFor="techniques"  >
                    <InputGroup 
                        id="techniques" 
                        name="techniques" 
                        type='text'
                        placeholder='eg. lip trill, stopped' 
                        value={newWorkSnap.formFields.techniques} 
                        onChange={handleFormChange}
                    />
                </FormGroup>
                <FormGroup label="clef" labelFor="clef" >
                    <InputGroup 
                        id="clef" 
                        name="clef" 
                        type='text'
                        placeholder='eg. treble, bass' 
                        value={newWorkSnap.formFields.clef} 
                        onChange={handleFormChange}
                    />
                </FormGroup>
                <FormGroup label="year of composition" labelFor="compYr" >
                    <NumericInput
                        id="compYr"
                        name="compYr"
                        placeholder='eg. 1914' 
                        fill={true}
                        value={newWorkSnap.formFields.compYr}
                        onValueChange={handleYearChange}
                    />
                </FormGroup>
                <hr></hr>
                <MovementsForm />
                <div className='Btn-pair'>
                    <Button
                        type='submit'
                        intent='primary'
                        text='add Work'
                    />
                </div>
            </form>
            <div className='NewWork-landscape'>
                <Icon 
                    icon='issue'
                    iconSize={12}
                />
                <small className='NewWork-landscape-small'>
                    mobile users with narrow screen sizes (eg. iPhone 5) should rotate device to 'landscape' mode
                </small>
            </div>
            
        </Card>
    );
};

export default NewWork;