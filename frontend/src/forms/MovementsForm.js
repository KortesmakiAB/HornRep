import { proxy, useSnapshot } from 'valtio';
import { FormGroup, H4, Icon, InputGroup, NumericInput, Tab, Tabs } from '@blueprintjs/core';
import Difficulty from './Difficulty';
import DurationSlider from './DurationSlider';
import HighestLowest from './HighestLowestNotes';

const movementsFormState = proxy({
    numMvmts: 0,
    setNumMvmts(num) { this.numMvmts = num },

    formFields: {
        title: {},
        duration: {},
        difficulty: {},
        // highestNote: {},
        // lowestNote: {},
    },
    setFormFields(field, idx, val) { this.formFields[field][idx] = val }


});

const MovementsForm = () => {
    const mvmtsFormSnap = useSnapshot(movementsFormState);

    // docs advise against using the 1st param, which has the type 'number' and instead choose the 2nd parameter, which has the type 'string'.
    // I am ignoring this advice due to the simplicity of my use. No decimals, fractions, or math needed.
    const handleNumMvmtsChange = (num, string) => { 
        // user input '-' causes 'NaN
        if (Number.isNaN(num)) movementsFormState.setNumMvmts('');
        else movementsFormState.setNumMvmts(num);
    };

    const handleFormChange = (evt, mvmtNum) => {
        console.log(evt.target, mvmtNum)
        // movementsFormState.setFormFields()
    };

    const Movement = ({ mvmtNum }) => {
        return (
            <>
            <FormGroup label='title' labelFor={`title${mvmtNum}`}>
                <InputGroup
                    id={`title${mvmtNum}`}
                    name={`title${mvmtNum}`}
                    type='text'
                    value={mvmtsFormSnap.formFields.title[mvmtNum]}
                    onChange={(e) => handleFormChange(e, mvmtNum)}
                />
            </FormGroup>
            <DurationSlider />
            <Difficulty />
            {/* <HighestLowest /> */}
            </>
        );
    };
    
    const displayTabs = (numRows) => {
        const rowsArr = [];
        for (let i = 1; i <= numRows; i++) {
            rowsArr.push(<Tab key={i} id={i} title={`m${i}`} panel={<Movement mvmtNum={i} />} />)
        }
        return rowsArr;
    };

    return(
        <div>
            <H4>add movements</H4>
            <FormGroup label='# of movements (m)' labelFor='numMvmts' >
                <NumericInput
                    id='numMvmts'
                    name='numMvmts'
                    fill={true}
                    value={mvmtsFormSnap.numMvmts}
                    onValueChange={handleNumMvmtsChange}
                    disabled={ mvmtsFormSnap.numMvmts ? true : false}
                />
            </FormGroup>
            <Tabs onChange={(tabId) => console.log(tabId)} >
                { displayTabs(mvmtsFormSnap.numMvmts) }
            </Tabs>
        </div>
    );
};

export default MovementsForm;