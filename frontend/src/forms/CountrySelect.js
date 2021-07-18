import { proxy, useSnapshot } from 'valtio';
import { Button, FormGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { searchFormState } from '../App';

export const countrySelectState = proxy({
    countries: [],

    country: '',
    setCountryState(c) { this.country = c },
  
    countryQuery: '',
    setCountryQuery(qString) { countrySelectState.countryQuery = qString },
});

const CountrySelect = () => {

    const countrySelectSnap = useSnapshot(countrySelectState);
    if (!countrySelectSnap.countries.length) searchFormState.loadFormChoicesData();

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
                icon={ countrySelectSnap.country === country ? "tick" : "blank" }
            />
        );
    };
    const handleCountrySelect = (country) => {
        if (country === countrySelectSnap.country) countrySelectState.setCountryState('');
        else countrySelectState.setCountryState(country);
    };
    const filterCountry = (query, country) => country.toLowerCase().startsWith(query.toLowerCase());


    return (
        <FormGroup 
            label="country/region"
            labelFor="country"
            labelInfo='(of composer)'
        >
            <Select
                items={ countrySelectSnap.countries }
                itemRenderer={renderCountry}
                onItemSelect={handleCountrySelect}
                
                query={ countrySelectSnap.countryQuery }
                onQueryChange={ countrySelectState.setCountryQuery }
                itemPredicate={filterCountry}
                noResults={<MenuItem disabled={true} text="No results." />}
                resetOnSelect={true}
                required={true}
            >
                <Button text={countrySelectSnap.country || 'Search for country...'} rightIcon="double-caret-vertical"  />
            </Select>
        </FormGroup>
    );
};

export default CountrySelect;