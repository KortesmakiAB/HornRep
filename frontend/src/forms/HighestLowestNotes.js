import { proxy, useSnapshot } from 'valtio';
import { Button, FormGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import { createRangeArr } from '../utilities/range';


export const highestLowestState = proxy({
    highestNote: '',
    setHighestNote(nObj){ this.highestNote = nObj },
    
    lowestNote: '',
    setLowestNote(nObj){ this.lowestNote = nObj },
})

const HighestLowest = () => {
    const highestLowestSnap = useSnapshot(highestLowestState);

    const rangeArr = createRangeArr();
    const createHighRangeArr = () => {
        const arr = [];

        // G at top of staff
        let highRangeLowerBound = 43;
        // E above staff
        let highRangeUpperBound = 52;
        
        for (let i = highRangeUpperBound; i >= highRangeLowerBound; i--) {
            arr.push({
                label: rangeArr[i].abbrevName,
                value: i,
            });
        }

        arr.push({
            label: 'select',
            value: null,
        })

        return arr;
    }
    const highRangeArr = createHighRangeArr();
    
    const createLowRangeArr = () => {
        const arr = [];

        // G below middle C
        let lowRangeUpperBound = 19;
        // Shost 5 pedal E
        let lowRangeLowerBound = 4;
        
        arr.push({
            label: 'select',
            value: null,
        });
        
        for (let i = lowRangeUpperBound; i >= lowRangeLowerBound; i--) {
            arr.push({
                label: rangeArr[i].abbrevName,
                value: i,
            });
        }

        return arr;
    }
    const lowRangeArr = createLowRangeArr();

    const renderRange = (note, { handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                key={note.value}
                onClick={handleClick}
                text={note.label}
                icon={
                    (highestLowestSnap.highestNote.value === note.value || highestLowestSnap.lowestNote.value === note.value) 
                    ? 'tick' 
                    : 'blank'
                }
            />
        );
    };
    const handleHighestSelect = (note) => highestLowestState.setHighestNote(note);
    const handleLowestSelect = (note) => highestLowestState.setLowestNote(note);

    return (
        <>
        <FormGroup 
            label='highest note' 
            labelFor='highestNote' 
            labelInfo='(horn in F)' 
            helperText='above the treble clef staff'>
            <Select
                items={highRangeArr}
                itemRenderer={renderRange}
                onItemSelect={handleHighestSelect}
                
                filterable={false}
            >
                <Button 
                    text={ highestLowestSnap.highestNote.label || highRangeArr[highRangeArr.length - 1].label } 
                    rightIcon="double-caret-vertical" 
                />
            </Select>
        </FormGroup>
        <FormGroup 
            label='lowest note' 
            labelFor='lowestNote' 
            labelInfo='(horn in F)' 
            helperText='descending, beginning G below middle C'>
            <Select
                items={lowRangeArr}
                itemRenderer={renderRange}
                onItemSelect={handleLowestSelect}
                
                filterable={false}
            >
                <Button 
                    text={ highestLowestSnap.lowestNote.label || lowRangeArr[0].label } 
                    rightIcon="double-caret-vertical" 
                />
            </Select>
        </FormGroup>
        </>
    );
};

export default HighestLowest;