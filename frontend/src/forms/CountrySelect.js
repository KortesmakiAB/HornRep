import { useSnapshot } from 'valtio';
import { Button, FormGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import { searchFormState } from '../App';
import { newComposerState } from './NewComposer';

const CountrySelect = () => {

    const formSnap = useSnapshot(searchFormState);
    const newComposerSnap = useSnapshot(newComposerState);

    const renderCountry = (country, {handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                key={country}
                onClick={handleClick}
                text={country}
                icon={ newComposerSnap.formFields.country === country ? "tick" : "blank" }
            />
        );
    };
    const handleCountrySelect = (country) => {
        if (country === newComposerSnap.formFields.country) newComposerState.setFormField('country', '');
        else newComposerState.setFormField('country', country);
    };
    const filterCountry = (query, country) => country.toLowerCase().startsWith(query.toLowerCase());


    return (
        <FormGroup 
            label="country/region"
            labelFor="countries"
            labelInfo='(of composer)'
        >
            <Select
                items={ Object.keys(formSnap.countriesState) }
                itemRenderer={renderCountry}
                onItemSelect={handleCountrySelect}
                
                query={ newComposerSnap.countryQuery }
                onQueryChange={ searchFormState.setCountriesQuery }
                itemPredicate={filterCountry}
                noResults={<MenuItem disabled={true} text="No results." />}
            >
                <Button text={newComposerSnap.formFields.country || 'Search for country...'} rightIcon="double-caret-vertical"  />
            </Select>
        </FormGroup>
    );
};

export default CountrySelect;