import { proxy, useSnapshot } from 'valtio';
import { Button, FormGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

export const eraStyleSelectState = proxy({
    erasStyles: [],

    eraStyle: '',
    setEraStyleState(c) { this.eraStyle = c },
  
    eraStyleQuery: '',
    setEraStyleQuery(qString) { this.eraStyleQuery = qString },
});

const EraStyleSelect = () => {

    const eraStyleSelectSnap = useSnapshot(eraStyleSelectState);

    const renderEraStyle = (eraStyle, {handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                key={eraStyle}
                onClick={handleClick}
                text={eraStyle}
                icon={ eraStyleSelectSnap.eraStyle === eraStyle ? "tick" : "blank" }
            />
        );
    };
    const handleEraStyleSelect = (eraStyle) => {
        if (eraStyle === eraStyleSelectSnap.eraStyle) eraStyleSelectState.setEraStyleState('');
        else eraStyleSelectState.setEraStyleState(eraStyle);
    };
    const filterEraStyle = (query, eraStyle) => eraStyle.toLowerCase().startsWith(query.toLowerCase());


    return (
        <FormGroup 
            label="eraStyle/region"
            labelFor="eraStyle"
            labelInfo='(of composer)'
        >
            <Select
                items={ eraStyleSelectSnap.erasStyles }
                itemRenderer={renderEraStyle}
                onItemSelect={handleEraStyleSelect}
                
                query={ eraStyleSelectSnap.eraStyleQuery }
                onQueryChange={ eraStyleSelectState.setEraStyleQuery }
                itemPredicate={filterEraStyle}
                noResults={<MenuItem disabled={true} text="No results." />}
                resetOnSelect={true}
            >
                <Button text={eraStyleSelectSnap.eraStyle || 'Search for era/style...'} rightIcon="double-caret-vertical"  />
            </Select>
        </FormGroup>
    );
};

export default EraStyleSelect;