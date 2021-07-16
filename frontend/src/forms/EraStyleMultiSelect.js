import { proxy, useSnapshot } from 'valtio';
import { FormGroup, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';


export const eraStyleMultiState = proxy({
    erasStyles: {},
    setErasStyles(key) { this.erasStyles[key] = !this.erasStyles[key] },

    eraStyleQuery: '',
    setEraStyleQuery(q) { this.eraStyleQuery = q },
})

const EraStyleMultiSelect = () => {
    // const handleEraStyleCheckboxChange = (evt) => eraStyleMultiState.setEraStyleCheckboxState(evt.target.getAttribute('data-es'));
    const eraStyleMultiSnap = useSnapshot(eraStyleMultiState);

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
                items={ Object.keys(eraStyleMultiSnap.erasStyles) }
                itemRenderer={renderCountry}
                onItemSelect={handleCountrySelect}
                tagRenderer={renderTag}

                fill={true}
                query={ eraStyleMultiSnap.eraStyleQuery }
                onQueryChange={ eraStyleMultiState.setEraStyleQuery }
                itemPredicate={filterEraStyle}
                noResults={<MenuItem disabled={true} text="No results." />}
                resetOnSelect='true'
                selectedItems={ Object.keys(eraStyleMultiSnap.erasStyles).filter(c => eraStyleMultiSnap.erasStyles[c]) }
                tagInputProps={{
                    onRemove: handleTagRemove,
                }}
            >
            </MultiSelect>
        </FormGroup>
    );
};

export default EraStyleMultiSelect;