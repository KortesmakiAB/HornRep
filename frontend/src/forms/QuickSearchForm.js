import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { Button, FormGroup, InputGroup, RangeSlider, Checkbox, Collapse, Icon } from "@blueprintjs/core";

import { searchFormState } from '../App';
import './QuickSearchForm.css';



const QuickSearchForm = () => {
    
    // initial maxDuration is pre-set to 20 for convenience.
    // most people want works shorter than 20 minutes.
    const [sliderArr, setSliderArr] = useState([0, 20]);

    // used state here because the keys are static. Don't need access to them from anywhere else.
    const [checkboxesDifficulty, setCheckboxesDifficulty] = useState({
        'novice': false,
        'intermediate': false,
        'advanced': false,
    });
    

    // const [collapseIsOpen, setCollapseIsOpen] = useState(false);

    

    // object containing 'HH:MM:SS' values which correspond to num of minutes (from form data) as keys
    const duration = {};
    const sliderMax = 40;
    for (let i= 1; i <= sliderMax; i++) {
        if (i < 10) duration[i] = `00:0${i}:00`;
        else duration[i] = `00:${i}:00`;
    }
    
    const handleSliderRelease = (minMaxArr) => {
        const minKey = minMaxArr[0];
        const maxKey = minMaxArr[1];
        searchFormState.setFormField('minDuration', duration[minKey]);
        searchFormState.setFormField('maxDuration', duration[maxKey]);
    };

    const handleDifficultyCheckboxChange = (evt) => {
        let { id, value } = evt.target;

        // evt.target returns a string
        let bool = JSON.parse(value);
        setCheckboxesDifficulty(boxes => ({
            ...boxes,
            [id]: !bool
        }));
    }

    const handleEraStyleCheckboxChange = (evt) => {
        let { id } = evt.target;
        searchFormState.setEraStyleCheckboxState(id);
    }

    const handleFormSubmit = (evt) => {
        evt.preventDefault();

        const difficultyArr = [];
        for (let key in checkboxesDifficulty) {
            if (checkboxesDifficulty[key]) difficultyArr.push(key);
        }
        const eraStyleResults = [];
        for (let key in formSnap.eraStyleCheckboxState) {
            if (formSnap.eraStyleCheckboxState[key]) eraStyleResults.push(key);
        }

        searchFormState.setFormField('difficulty', difficultyArr);
        searchFormState.setFormField('eraStyle', eraStyleResults);
        
        searchFormState.worksSearch(searchFormState.formFields);
    };

    const formSnap = useSnapshot(searchFormState);
        
    return (
        <div>QuickSearchForm
            <form onSubmit={handleFormSubmit} className='QuickSearchForm'>
                <FormGroup label="Title" labelFor="title">
                    <InputGroup id="title" name="title" placeholder="Keywords" value={formSnap.formFields.title} onChange={searchFormState.handleFormChange} />
                </FormGroup>
                {/* TODO put composer first/last on one line ? */}
                <FormGroup label="Last Name" labelFor="lName">
                    <InputGroup id="lName" name="lName" placeholder="Composer" value={formSnap.formFields.lName} onChange={searchFormState.handleFormChange} />
                </FormGroup>
                <FormGroup label="First Name" labelFor="fName">
                    <InputGroup id="fName" name="fName" placeholder="Composer" value={formSnap.formFields.fName} onChange={searchFormState.handleFormChange} />
                </FormGroup>
                <FormGroup label="Duration" labelFor="duration" labelInfo="(complete work)" helperText="*Does not search individual movement duration.">
                    <RangeSlider 
                        id="duration" 
                        name="duration" 
                        intent="primary"
                        max={sliderMax}
                        value={sliderArr} 
                        onChange={(valArr) => setSliderArr(() => valArr)} 
                        onRelease={handleSliderRelease} 
                        labelStepSize={5}
                        stepSize={1}
                    />
                </FormGroup>
                <FormGroup label="Difficulty" labelFor="difficulty">
                    <Checkbox id="novice" name="difficulty" label="novice" inline="true" value={checkboxesDifficulty.novice} onChange={handleDifficultyCheckboxChange} />
                    <Checkbox id="intermediate" name="difficulty" label="intermediate" inline="true" value={checkboxesDifficulty.intermediate} onChange={handleDifficultyCheckboxChange} />
                    <Checkbox id="advanced" name="difficulty" label="advanced" inline="true" value={checkboxesDifficulty.advanced} onChange={handleDifficultyCheckboxChange} />
                </FormGroup>
                <FormGroup label="Era/Style" labelFor="eraStyle">
                    { formSnap.checkboxData.eraStyle.map((eS) => <Checkbox key={eS} id={eS} name="eraStyle" label={eS} inline="true" value={formSnap.eraStyleCheckboxState[eS]} onChange={handleEraStyleCheckboxChange} />)}
                </FormGroup>
                {/* <Icon icon='chevron-down' tagName='span' />
                <Collapse isOpen={collapseIsOpen} keepChildrenMounted={true}>
                    [11:53:30] Finished 'typescript-bundle-blueprint' after 769 ms
                    <br />
                    [11:53:30] Starting 'typescript-typings-blueprint'...
                    <br />
                    [11:53:30] Finished 'typescript-typings-blueprint' after 198 ms
                    <br />
                    [11:53:30] write ./blueprint.css
                    <br />
                    [11:53:30] Finished 'sass-compile-blueprint' after 2.84 s
                </Collapse> */}
                <Button type="submit" intent="primary">Submit</Button>
            </form>
        </div>
    );
};

export default QuickSearchForm;