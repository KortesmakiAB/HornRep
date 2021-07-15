import { useSnapshot } from 'valtio';
import { Button, FormGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import { searchFormState } from '../App';
import { newComposerState } from './NewComposer';


const GenderSelect = ({formParent}) => {
    let form;
    const searchFormSnap = useSnapshot(searchFormState);
    const newComposerSnap = useSnapshot(newComposerState);
    if (formParent === 'SearchForm') form = searchFormSnap
    else if (formParent === 'NewComposer') form = newComposerSnap;

    const genderArr = [{display: 'male', value: 'male'}, {display: 'female', value: 'female'}, {display: 'select', value: null}];
    const handleGenderSelect = (g) => { 
        formParent === 'SearchForm' 
        ? searchFormState.setFormField('gender', g.value) 
        : newComposerState.setFormField('gender', g.value) 
    };
    const renderGender = (gender, { handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                key={gender.display}
                onClick={handleClick}
                text={gender.display}
                icon={ form.formFields.gender === gender.value ? "tick" : "blank" }
            />
        );
    };

    return (
        <FormGroup label='gender' labelFor='gender' >
            <Select
                items={genderArr}
                itemRenderer={renderGender}
                onItemSelect={handleGenderSelect}
                
                filterable={false}
            >
                <Button text={ form.formFields.gender || genderArr[2].display } rightIcon="double-caret-vertical" />
            </Select>
        </FormGroup>
    );
};

export default GenderSelect;