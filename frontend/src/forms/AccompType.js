import { useSnapshot } from "valtio";
import { FormGroup, Checkbox } from '@blueprintjs/core';

import { accompState } from './Accomp';

const AccompType = ({ newWork }) => {
    const accompSnap = useSnapshot(accompState);

    const handleAccompTypeCheckboxChange = (evt) => {
        const accompType = evt.target.getAttribute('data-accomp');
        accompState.setCheckboxesAccompType(accompType);
        // don't allow any other type of accompaniment if user checks 'unaccompanied'.
        if (accompType === 'unaccompanied' && accompState.checkboxesAccompType.unaccompanied) accompState.setCheckboxesUnaccomp();
    };

    return (
        <FormGroup label="accompaniment" labelFor="accompaniment">
            <Checkbox 
                data-accomp="unaccompanied" 
                name="accompaniment" 
                label="unaccompanied" 
                inline="true" 
                value={accompSnap.checkboxesAccompType.unaccompanied} 
                onChange={handleAccompTypeCheckboxChange} 
            />
            {
                newWork && accompSnap.checkboxesAccompType.unaccompanied
                ? null
                : (
                    <>
                    <Checkbox 
                        data-accomp="orchestra" 
                        name="accompaniment" 
                        label="orchestra" 
                        inline="true" 
                        value={accompSnap.checkboxesAccompType.orchestra} 
                        onChange={handleAccompTypeCheckboxChange} 
                    />
                    <Checkbox 
                        data-accomp="piano" 
                        name="accompaniment" 
                        label="piano" 
                        inline="true" 
                        value={accompSnap.checkboxesAccompType.piano} 
                        onChange={handleAccompTypeCheckboxChange} 
                    />
                    </>
                )
            }
        </FormGroup>
    );
};

export default AccompType;