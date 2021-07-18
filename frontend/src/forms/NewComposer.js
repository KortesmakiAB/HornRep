import { proxy, useSnapshot } from 'valtio';
import { Button, Card, FormGroup, Icon, InputGroup } from '@blueprintjs/core';

import CountrySelect, {countrySelectState} from './CountrySelect';
import GenderSelect, {genderState} from './GenderSelect';
import HornRepApi from '../utilities/api';

import './NewComposer.css';
import { composerSelectState } from './ComposerSelect';
import { collaborateState } from '../addtl-pages/Collaborate';

const initialNewComposerState = {
    fName: '',
    lName: '',
};
export const newComposerState = proxy({
    formFields: {...initialNewComposerState},
    setFormField(field, val) { this.formFields[field] = val },
    resetFormFields(){ this.formFields = {...initialNewComposerState} },

    handleFormChange(evt) {
		const { name, value } = evt.target;
        newComposerState.setFormField(name, value);
    },
});

const NewComposer = () => {
    const newComposerSnap = useSnapshot(newComposerState);
    const countrySelectSnap = useSnapshot(countrySelectState);
    const genderSnap = useSnapshot(genderState);

    function handleNewComposerSubmit(evt) {
        evt.preventDefault();
        // TODO try/catch, esp required Country & Gender
        (async () => {
            newComposerState.setFormField('country', countrySelectSnap.country);
            newComposerState.setFormField('gender', genderSnap.gender);
            const resp = await HornRepApi.newComposer(newComposerState.formFields);
            const newComp = resp.newComposer;
            newComp.compNameLastFirst = `${newComp.lName}, ${newComp.fName}`;
            composerSelectState.composers.push(resp.newComposer);
            newComposerState.resetFormFields();
            genderState.setGender(null);
            collaborateState.setTabId('work');
            // TODO toast
        })();
    }
    
    return (
        <Card className='Card'>
            <form onSubmit={handleNewComposerSubmit}>
                
                <FormGroup label='first name' labelFor='fName'>
                    <InputGroup
                        id='fName'
                        type='text'
                        name='fName'
                        value={newComposerSnap.formFields.fName} 
                        onChange={newComposerState.handleFormChange} 
                        autoComplete='on'
                        required={true}
                    
                    />
                </FormGroup>
                <FormGroup label='last name' labelFor='lName'>
                    <InputGroup
                        id='lName'
                        type='text'
                        name='lName'
                        value={newComposerSnap.formFields.lName} 
                        onChange={newComposerState.handleFormChange} 
                        autoComplete='on'
                        required={true}
                    />
                </FormGroup>
                {/* TODO <H4>Choose a country from this list. Or enter it manually (below).</H4> */}
                <CountrySelect />
                <GenderSelect formParent='NewComposer' />
                <p className='NewComposer-p'>
                    <Icon 
                        icon='issue'
                        intent='warning'
                        className='Icon-m'
                        iconSize={15}
                    />
                    all fields required
                </p>
                <div className='Btn-pair NewComposer-btn'>
                    <Button
                        type='submit'
                        intent='primary'
                        text='add Composer'
                    />
                </div>
            </form>
        </Card>
    );
};

export default NewComposer;