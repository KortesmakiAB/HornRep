import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { Button, FormGroup, InputGroup, RangeSlider, Checkbox, Collapse } from "@blueprintjs/core";

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

    // used state here because the keys are static. Don't need access to them from anywhere else.
    const [checkboxesAccomp, setCheckboxesAccomp] = useState({
        'orchestra': false,
        'piano': false,
        'unaccompanied': false,
    });


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

    const handleAccompCheckboxChange = (evt) => {
        let { id, value } = evt.target;

        // evt.target returns a string
        let bool = JSON.parse(value);
        setCheckboxesAccomp(boxes => ({
            ...boxes,
            [id]: !bool
        }));
    }

    const handleEraStyleCheckboxChange = (evt) => {
        let { id } = evt.target;
        searchFormState.setEraStyleCheckboxState(id);
    }

    const handleCountriesCheckboxChange = (evt) => {
        let { id } = evt.target;
        searchFormState.setCountriesCheckboxState(id);
    }

    const formSnap = useSnapshot(searchFormState);

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
        const countriesResults = [];
        for (let key in formSnap.countriesCheckboxState) {
            if (formSnap.countriesCheckboxState[key]) countriesResults.push(key);
        }
        const accompResults = [];
        for (let key in checkboxesAccomp) {
            if (checkboxesAccomp[key]) accompResults.push(key);
        }

        searchFormState.setFormField('difficulty', difficultyArr);
        searchFormState.setFormField('eraStyle', eraStyleResults);
        searchFormState.setFormField('countries', countriesResults);
        searchFormState.setFormField('accompType', accompResults);
        
        searchFormState.worksSearch(searchFormState.formFields);
    };

    return (
        <div>QuickSearchForm
            <form onSubmit={handleFormSubmit} className='QuickSearchForm'>
                <FormGroup label="Title" labelFor="title">
                    <InputGroup id="title" name="title" placeholder="keywords" value={formSnap.formFields.title} onChange={searchFormState.handleFormChange} />
                </FormGroup>
                {/* TODO put composer first/last on one line ? */}
                <FormGroup label="Last Name" labelFor="lName">
                    <InputGroup id="lName" name="lName" placeholder="composer" value={formSnap.formFields.lName} onChange={searchFormState.handleFormChange} />
                </FormGroup>
                <FormGroup label="First Name" labelFor="fName">
                    <InputGroup id="fName" name="fName" placeholder="composer" value={formSnap.formFields.fName} onChange={searchFormState.handleFormChange} />
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
                <FormGroup label={ formSnap.checkboxData.eraStyle ? "Era/Style" : null } labelFor="eraStyle">
                    { formSnap.checkboxData.eraStyle
                        ? formSnap.checkboxData.eraStyle.map((eS) => 
                            <Checkbox 
                                key={eS} 
                                id={eS} 
                                name="eraStyle" 
                                label={eS} 
                                inline="true" 
                                value={formSnap.eraStyleCheckboxState[eS]} 
                                onChange={handleEraStyleCheckboxChange} 
                            />)
                        : null
                    }
                </FormGroup>

                <Button 
                    onClick={() => searchFormState.setAdvancedSearch()} 
                    minimal='true' 
                    rightIcon={ formSnap.isAdvancedSearch ? 'caret-up' : 'caret-down' } 
                    outlined='true'
                >
                    { formSnap.isAdvancedSearch ? 'Fewer options' : 'More options' } 
                </Button>
                <Collapse isOpen={formSnap.isAdvancedSearch} keepChildrenMounted={true}>
                    <FormGroup>Range - TODO</FormGroup>
                    <FormGroup label="Technique" labelFor="techniques" helperText=' eg. lip-trill or stopped-horn' >
                        <InputGroup 
                            id="techniques" 
                            name="techniques" 
                            placeholder='keywords' 
                            value={formSnap.formFields.techniques} 
                            onChange={searchFormState.handleFormChange} 
                        />
                    </FormGroup>
                    <FormGroup label={ formSnap.checkboxData.countries ? "Country/Region" : null } labelFor="countries"    >
                        { formSnap.checkboxData.countries
                            ? formSnap.checkboxData.countries.map((c) => 
                                <Checkbox 
                                    key={c} 
                                    id={c} 
                                    name="countries" 
                                    label={c} 
                                    inline="true" 
                                    value={formSnap.countriesCheckboxState[c]} 
                                    onChange={handleCountriesCheckboxChange} 
                                />)
                            : null
                        }
                    </FormGroup>
                    <FormGroup label="Accompaniment" labelFor="accompaniment">
                        <Checkbox id="orchestra" name="accompaniment" label="Orchestra" inline="true" value={checkboxesAccomp.orchestra} onChange={handleAccompCheckboxChange} />
                        <Checkbox id="piano" name="accompaniment" label="Piano" inline="true" value={checkboxesAccomp.piano} onChange={handleAccompCheckboxChange} />
                        <Checkbox id="unaccompanied" name="accompaniment" label="Unaccompanied" inline="true" value={checkboxesAccomp.unaccompanied} onChange={handleAccompCheckboxChange} />
                    </FormGroup>
                </Collapse>
                <Button type="submit" intent="primary">Submit</Button>
            </form>
        </div>
    );
};

export default QuickSearchForm;