import { proxy, useSnapshot } from 'valtio';
import { FormGroup, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import { searchFormState } from '../App';


export const eraStyleState = proxy({
    erasStyles: {},
    setErasStyles(key) { this.erasStyles[key] = !this.erasStyles[key] },

    eraStyleQuery: '',
    setEraStyleQuery(q) { this.eraStyleQuery = q },

})

const EraStyle = () => {
    // const handleEraStyleCheckboxChange = (evt) => eraStyleState.setEraStyleCheckboxState(evt.target.getAttribute('data-es'));
    const eraStyleSnap = useSnapshot(eraStyleState);
    const searchFormSnap = useSnapshot(searchFormState);

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
                icon={ eraStyleSnap.erasStyles[eraStyle] ? "tick" : "blank" }
            />
        );
    };
    const filterEraStyle = (query, eraStyle) => eraStyle.toLowerCase().startsWith(query.toLowerCase());
    const handleCountrySelect = (eraStyle) => eraStyleState.setErasStyles(eraStyle);
    const renderTag = (tag) => tag;
    const handleTagRemove = (_tag) => { eraStyleState.setErasStyles(_tag) };

    return (
        <FormGroup 
            label='era/style'
            labelFor='eraStyle'
            helperText='may make multiple selections'
        >
            <MultiSelect
                items={ Object.keys(eraStyleSnap.erasStyles) }
                itemRenderer={renderCountry}
                onItemSelect={handleCountrySelect}
                tagRenderer={renderTag}

                fill={true}
                query={ eraStyleSnap.eraStyleQuery }
                onQueryChange={ eraStyleState.setEraStyleQuery }
                itemPredicate={filterEraStyle}
                noResults={<MenuItem disabled={true} text="No results." />}
                resetOnSelect='true'
                selectedItems={ Object.keys(eraStyleSnap.erasStyles).filter(c => eraStyleSnap.erasStyles[c]) }
                tagInputProps={{
                    onRemove: handleTagRemove,
                }}
            >
            </MultiSelect>
        </FormGroup>
    );
};

export default EraStyle;