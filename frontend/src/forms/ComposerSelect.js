import { proxy, useSnapshot } from 'valtio';
import { Button, FormGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

export const composerSelectState = proxy({
    composers: [],

    composerObj: '',
    setComposerState(c) { this.composerObj = c },
  
    composerQuery: '',
    setComposerQuery(qString) { composerSelectState.composerQuery = qString },
});

const ComposerSelect = ({ helperText }) => {

    const composerSelectSnap = useSnapshot(composerSelectState);

    const renderComposer = (composer, {handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                key={composer.id}
                onClick={handleClick}
                text={composer.compNameLastFirst}
                icon={ composerSelectSnap.composerObj.id === composer.id ? "tick" : "blank" }
            />
        );
    };
    const handleComposerSelect = (composer) => {
        if (composer.id === composerSelectSnap.composerObj.idObj) composerSelectState.setComposerState({});
        else composerSelectState.setComposerState(composer);
    };
    const filterComposer = (query, composer) => composer.compNameLastFirst.toLowerCase().startsWith(query.toLowerCase());


    return (
        <FormGroup 
            label="composer"
            labelFor="composer"
            helperText={helperText}
        >
            <Select
                items={ composerSelectSnap.composers }
                itemRenderer={renderComposer}
                onItemSelect={handleComposerSelect}
                
                query={ composerSelectSnap.composerQuery }
                onQueryChange={ composerSelectState.setComposerQuery }
                itemPredicate={filterComposer}
                noResults={<MenuItem disabled={true} text="No results." />}
                resetOnSelect={true}
            >
                <Button text={composerSelectSnap.composerObj.compNameLastFirst || 'Search for composer...'} rightIcon="double-caret-vertical"  />
            </Select>
        </FormGroup>
    );
};

export default ComposerSelect;