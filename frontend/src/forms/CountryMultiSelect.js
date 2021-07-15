import { useSnapshot } from 'valtio';
import { FormGroup, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';

import { searchFormState } from '../App';


const CountryMultiSelect = () => {
    const formSnap = useSnapshot(searchFormState);

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
                icon={ formSnap.countriesState[country] ? "tick" : "blank" }
            />
        );
    };
    const filterCountry = (query, country) => country.toLowerCase().startsWith(query.toLowerCase());
    const handleCountrySelect = (country) => searchFormState.setCountriesState(country);
    const renderTag = (tag) => tag;
    const handleTagRemove = (_tag) => { searchFormState.setCountriesState(_tag) };

    return (
        <FormGroup 
            label='country/region'
            labelFor='countries'
            labelInfo='(of composer)'
            helperText='may make multiple selections'
        >
            <MultiSelect
                items={ Object.keys(formSnap.countriesState) }
                itemRenderer={renderCountry}
                onItemSelect={handleCountrySelect}
                tagRenderer={renderTag}

                fill={true}
                query={ formSnap.countriesQuery }
                onQueryChange={ searchFormState.setCountriesQuery }
                itemPredicate={filterCountry}
                noResults={<MenuItem disabled={true} text="No results." />}
                resetOnSelect='true'
                selectedItems={ Object.keys(formSnap.countriesState).filter(c => formSnap.countriesState[c]) }
                tagInputProps={{
                    onRemove: handleTagRemove,
                }}
            >
            </MultiSelect>
        </FormGroup>
    );
};

export default CountryMultiSelect;