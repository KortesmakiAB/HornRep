import { proxy, useSnapshot } from 'valtio';
import { FormGroup, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';

import { searchFormState } from '../App';


export const eraStyleMultiState = proxy({
    erasStyles: {},
    setErasStyles(key) { eraStyleMultiState.erasStyles[key] = !this.erasStyles[key] },

    eraStyleQuery: '',
    setEraStyleQuery(q) { eraStyleMultiState.eraStyleQuery = q },
});

const EraStyleMultiSelect = () => {
    const eraStyleMultiSnap = useSnapshot(eraStyleMultiState);
    const eraStyleArr = Object.keys(eraStyleMultiSnap.erasStyles);
    if (!eraStyleArr.length) searchFormState.loadFormChoicesData();

    const renderCountry = (eraStyle, {handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                key={eraStyle}
                onClick={handleClick}
                text={eraStyle}
                icon={ eraStyleMultiSnap.erasStyles[eraStyle] ? "tick" : "blank" }
            />
        );
    };
    const filterEraStyle = (query, eraStyle) => eraStyle.toLowerCase().startsWith(query.toLowerCase());
    const handleCountrySelect = (eraStyle) => eraStyleMultiState.setErasStyles(eraStyle);
    const renderTag = (tag) => tag;
    const handleTagRemove = (_tag) => { eraStyleMultiState.setErasStyles(_tag) };

    return (
        <FormGroup 
            label='era/style'
            labelFor='eraStyle'
            helperText='may make multiple selections'
        >
            <MultiSelect
                items={ eraStyleArr }
                itemRenderer={renderCountry}
                onItemSelect={handleCountrySelect}
                tagRenderer={renderTag}

                fill={true}
                query={ eraStyleMultiSnap.eraStyleQuery }
                onQueryChange={ eraStyleMultiState.setEraStyleQuery }
                itemPredicate={filterEraStyle}
                noResults={<MenuItem disabled={true} text="No results." />}
                resetOnSelect='true'
                selectedItems={ eraStyleArr.filter(c => eraStyleMultiSnap.erasStyles[c]) }
                tagInputProps={{
                    onRemove: handleTagRemove,
                }}
            >
            </MultiSelect>
        </FormGroup>
    );
};

export default EraStyleMultiSelect;