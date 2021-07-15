import { proxy, useSnapshot } from 'valtio';
import { Button, Card, FormGroup, Icon, InputGroup } from '@blueprintjs/core';

import CountrySelect, {countrySelectState} from './CountrySelect';
import GenderSelect from './GenderSelect';
import HornRepApi from '../utilities/api';

// import './NewComposer.css';

const initialNewComposerState = {
    fName: '',
    lName: '',
    gender: '',
};
export const newComposerState = proxy({
    formFields: {...initialNewComposerState},
    setFormField(field, val) { this.formFields[field] = val },
    resetFormFields(){ this.formFields = {...initialNewComposerState} },

    handleFormChange(evt) {
		const { name, value } = evt.target;
        newComposerState.setFormField(name, value);
    },

    handleNewComposerSubmit(evt) {
        evt.preventDefault();
        // TODO try/catch
        (async () => {
            newComposerState.setFormField('country', countrySelectState.country);
            const resp = await HornRepApi.newComposer(newComposerState.formFields);
            newComposerState.resetFormFields();
        })();
    },
});

const NewComposer = () => {

    const newComposerSnap = useSnapshot(newComposerState);
    
    return (
        <Card className='Card'>
            <form onSubmit={newComposerState.handleNewComposerSubmit}>
                <p className='NewComposer-p'>
                    <Icon 
                        icon='issue'
                        intent='warning'
                        className='Icon-m'
                        iconSize={15}
                    />
                    all fields required
                </p>
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
                {/* <FormGroup label='country' labelFor='country'>
                    <InputGroup
                        id='country'
                        type='text'
                    
                    />
                </FormGroup> */}
                <GenderSelect formParent='NewComposer' />
                <div className='Btn-pair'>
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