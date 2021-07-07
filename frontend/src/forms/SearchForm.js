import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { Button, FormGroup, InputGroup, RangeSlider, Checkbox, Collapse, MenuItem, HTMLSelect } from "@blueprintjs/core";
import { MultiSelect } from "@blueprintjs/select";

import { searchFormState } from '../App';
import { createRangeArr } from './range';
import './SearchForm.css';



const QuickSearchForm = () => {
    
    // initial maxDuration is pre-set to 20 for convenience.
    // most people want works shorter than 20 minutes.
    const [sliderArr, setSliderArr] = useState([0, 20]);

    // used state instead of proxy because the keys are static. Don't need access to them from anywhere else.
    const [checkboxesDifficulty, setCheckboxesDifficulty] = useState({
        'novice': false,
        'intermediate': false,
        'advanced': false,
    });
    const [checkboxesAccomp, setCheckboxesAccomp] = useState({
        'orchestra': false,
        'piano': false,
        'unaccompanied': false,
    });
    const [checkboxesAccompDifficulty, setCheckboxesAccompDifficulty] = useState({
        'novice': false,
        'intermediate': false,
        'advanced': false,
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
        let { value } = evt.target;
        const diff = evt.target.getAttribute('data-diff');

        // evt.target returns a string
        let bool = JSON.parse(value);
        setCheckboxesDifficulty(boxes => ({
            ...boxes,
            [diff]: !bool
        }));
    }

    const handleEraStyleCheckboxChange = (evt) => searchFormState.setEraStyleCheckboxState(evt.target.getAttribute('data-eS'));

    const rangeArr = createRangeArr();
    const createHighRangeArr = () => {
        const arr = [];

        // G at top of staff
        let highRangeLowerBound = 43;
        // E above staff
        let highRangeUpperBound = 52;
        
        for (let i = highRangeUpperBound; i >= highRangeLowerBound; i--) {
            arr.push({
                ...rangeArr[i],
                value: i,
            });
        }

        return arr;
    }
    const highRangeArr = createHighRangeArr();
    
    // TODO - const createLowRangeArr = () => {}

    const handleAccompCheckboxChange = (evt) => {
        let { value } = evt.target;
        const accompType = evt.target.getAttribute('data-accomp');

        // evt.target returns a string
        let bool = JSON.parse(value);
        setCheckboxesAccomp(boxes => ({
            ...boxes,
            [accompType]: !bool
        }));
    }

    const handleAccompDiffCheckboxChange = (evt) => {
        let { value } = evt.target;
        const accompDiff = evt.target.getAttribute('data-accompDiff');

        // evt.target returns a string
        let bool = JSON.parse(value);
        setCheckboxesAccompDifficulty(boxes => ({
            ...boxes,
            [accompDiff]: !bool
        }));
    }

    const filterCountry = (query, country) => country.toLowerCase().startsWith(query.toLowerCase());

    const handleCountrySelect = (country) => searchFormState.setCountriesState(country);

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
                icon={ formSnap.countriesState[country] ? "tick" : "blank" }
            />
        );
    };

    const renderTag = (tag) => tag;

    const handleTagRemove = (_tag) => { searchFormState.setCountriesState(_tag) };

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
        for (let key in formSnap.countriesState) {
            if (formSnap.countriesState[key]) countriesResults.push(key);
        }
        const accompResults = [];
        for (let key in checkboxesAccomp) {
            if (checkboxesAccomp[key]) accompResults.push(key);
        }
        const accompDiffResults = [];
        for (let key in checkboxesAccompDifficulty) {
            if (checkboxesAccompDifficulty[key]) accompDiffResults.push(key);
        }

        searchFormState.setFormField('difficulty', difficultyArr);
        searchFormState.setFormField('eraStyle', eraStyleResults);
        searchFormState.setFormField('countries', countriesResults);
        searchFormState.setFormField('accompType', accompResults);
        searchFormState.setFormField('accompDifficulty', accompDiffResults);
        
        searchFormState.worksSearch(searchFormState.formFields);

        // TODO - redirect searchResults
    };

    return (
        <div>
            <form onSubmit={handleFormSubmit} className='QuickSearchForm'>
                <FormGroup label="Title" labelFor="title">
                    <InputGroup id="title" name="title" placeholder="keyword" value={formSnap.formFields.title} onChange={searchFormState.handleFormChange} />
                </FormGroup>
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
                    <Checkbox data-diff="novice" name="difficulty" label="novice" inline="true" value={checkboxesDifficulty.novice} onChange={handleDifficultyCheckboxChange} />
                    <Checkbox data-diff="intermediate" name="difficulty" label="intermediate" inline="true" value={checkboxesDifficulty.intermediate} onChange={handleDifficultyCheckboxChange} />
                    <Checkbox data-diff="advanced" name="difficulty" label="advanced" inline="true" value={checkboxesDifficulty.advanced} onChange={handleDifficultyCheckboxChange} />
                </FormGroup>
                <FormGroup label={ formSnap.checkboxData.eraStyle ? "Era/Style" : null } labelFor="eraStyle">
                    { formSnap.checkboxData.eraStyle
                        ? formSnap.checkboxData.eraStyle.map((eS) => 
                            <Checkbox 
                                key={eS} 
                                data-eS={eS}
                                name="eraStyle" 
                                label={eS} 
                                inline="true" 
                                value={formSnap.eraStyleCheckboxState[eS]} 
                                onChange={handleEraStyleCheckboxChange} 
                            />)
                        : null
                    }
                </FormGroup>

                <FormGroup>
                    <Button 
                        type='button'
                        onClick={() => searchFormState.setAdvancedSearch()} 
                        minimal='true' 
                        rightIcon={ formSnap.isAdvancedSearch ? 'caret-up' : 'caret-down' } 
                        outlined='true'
                        intent='primary'
                    >
                        { formSnap.isAdvancedSearch ? 'Fewer options' : 'More options' } 
                    </Button>
                </FormGroup>
                <Collapse isOpen={formSnap.isAdvancedSearch} keepChildrenMounted={true}>
                    <FormGroup label='Highest Note' labelFor='highestNote' labelInfo='(horn in F)' helperText='beginning at top of treble clef staff'>
                        <HTMLSelect value={formSnap.formFields.highestNote} onChange={searchFormState.setFormField('highestNote', formSnap.formFields.highestNote)}>
                            <option>choose...</option>
                            { highRangeArr.map((note, idx) => 
                                <option key={idx} value={note.value}>{note.abbrevName}</option>
                            )}
                        </HTMLSelect>
                    </FormGroup>
                    <FormGroup label='Lowest Note' labelFor='lowestNote'>
                        <HTMLSelect value={formSnap.formFields.lowestNote} onChange={searchFormState.setFormField('lowestNote', formSnap.formFields.lowestNote)}>
                        </HTMLSelect>
                    </FormGroup>
                    <FormGroup label="Technique" labelFor="techniques" helperText=' eg. lip trill or stopped' >
                        <InputGroup 
                            id="techniques" 
                            name="techniques" 
                            placeholder='keyword' 
                            value={formSnap.formFields.techniques} 
                            onChange={searchFormState.handleFormChange} 
                        />
                    </FormGroup>

                    <FormGroup 
                        label={ formSnap.checkboxData.countries ? "Country/Region" : null } 
                        labelFor="countries"
                    >
                        <MultiSelect
                            items={ formSnap.checkboxData.countries }
                            itemRenderer={renderCountry}
                            onItemSelect={handleCountrySelect}
                            tagRenderer={renderTag}

                            query={ formSnap.countriesQuery }
                            onQueryChange={ searchFormState.setCountriesQuery }
                            itemPredicate={filterCountry}
                            noResults={<MenuItem disabled={true} text="No results." />}
                            resetOnSelect='true'
                            selectedItems={ Object.keys(formSnap.countriesState).filter(c => formSnap.countriesState[c]) }
                            tagInputProps={{
                                onRemove: handleTagRemove,
                            }}
                        >
                        </MultiSelect>
                    </FormGroup>
                    <FormGroup label="Accompaniment" labelFor="accompaniment">
                        <Checkbox data-accomp="orchestra" name="accompaniment" label="Orchestra" inline="true" value={checkboxesAccomp.orchestra} onChange={handleAccompCheckboxChange} />
                        <Checkbox data-accomp="piano" name="accompaniment" label="Piano" inline="true" value={checkboxesAccomp.piano} onChange={handleAccompCheckboxChange} />
                        <Checkbox data-accomp="unaccompanied" name="accompaniment" label="Unaccompanied" inline="true" value={checkboxesAccomp.unaccompanied} onChange={handleAccompCheckboxChange} />
                    </FormGroup>
                    <FormGroup label="Accompaniment Difficulty" labelFor="accompDifficulty">
                        <Checkbox data-accompDiff="novice" name="accompDifficulty" label="novice" inline="true" value={checkboxesAccompDifficulty.novice} onChange={handleAccompDiffCheckboxChange} />
                        <Checkbox data-accompDiff="intermediate" name="accompDifficulty" label="intermediate" inline="true" value={checkboxesAccompDifficulty.intermediate} onChange={handleAccompDiffCheckboxChange} />
                        <Checkbox data-accompDiff="advanced" name="accompDifficulty" label="advanced" inline="true" value={checkboxesAccompDifficulty.advanced} onChange={handleAccompDiffCheckboxChange} />
                    </FormGroup>
                </Collapse>
                <FormGroup>
                    <Button type="submit" intent="primary">Submit</Button>
                </FormGroup>
            </form>
        </div>
    );
};

export default QuickSearchForm;