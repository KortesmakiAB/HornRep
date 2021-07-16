import { proxy, useSnapshot } from 'valtio';
import { Button, FormGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

export const genderState = proxy({
    gender: '',
    setGender(g) { this.gender = g.value }
});


const GenderSelect = () => {
    const genderSnap = useSnapshot(genderState);
 
    const genderArr = [{display: 'male', value: 'male'}, {display: 'female', value: 'female'}, {display: 'select', value: null}];
    const handleGenderSelect = (g) => { genderState.setGender(g) }
 
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
                icon={ genderSnap.gender === gender.value ? "tick" : "blank" }
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
                <Button text={ genderSnap.gender || genderArr[2].display } rightIcon="double-caret-vertical" />
            </Select>
        </FormGroup>
    );
};

export default GenderSelect;