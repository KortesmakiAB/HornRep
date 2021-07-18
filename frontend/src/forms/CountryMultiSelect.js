import { proxy, useSnapshot } from 'valtio';
import { FormGroup, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';


export const countryMultiSelectState = proxy({
  countriesState: {},
  setCountriesState(key) { this.countriesState[key] = !this.countriesState[key] },

  countriesQuery: '',
  setCountriesQuery(qString) { countryMultiSelectState.countriesQuery = qString },
});

const CountryMultiSelect = () => {
    const multiSelectSnap = useSnapshot(countryMultiSelectState);

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
                icon={ multiSelectSnap.countriesState[country] ? "tick" : "blank" }
            />
        );
    };
    const filterCountry = (query, country) => country.toLowerCase().startsWith(query.toLowerCase());
    const handleCountrySelect = (country) => countryMultiSelectState.setCountriesState(country);
    const renderTag = (tag) => tag;
    const handleTagRemove = (_tag) => { countryMultiSelectState.setCountriesState(_tag) };

    return (
        <FormGroup 
            label='country/region'
            labelFor='countries'
            labelInfo='(of composer)'
            helperText='may make multiple selections'
        >
            <MultiSelect
                items={ Object.keys(multiSelectSnap.countriesState) }
                itemRenderer={renderCountry}
                onItemSelect={handleCountrySelect}
                tagRenderer={renderTag}

                fill={true}
                query={ multiSelectSnap.countriesQuery }
                onQueryChange={ countryMultiSelectState.setCountriesQuery }
                itemPredicate={filterCountry}
                noResults={<MenuItem disabled={true} text="No results." />}
                resetOnSelect={true}
                selectedItems={ Object.keys(multiSelectSnap.countriesState).filter(c => countryMultiSelectState.countriesState[c]) }
                tagInputProps={{
                    onRemove: handleTagRemove,
                }}
            >
            </MultiSelect>
        </FormGroup>
    );
};

export default CountryMultiSelect;