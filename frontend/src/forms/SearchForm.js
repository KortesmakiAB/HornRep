import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { Button, FormGroup, InputGroup, RangeSlider, Checkbox, Collapse, MenuItem, H3, Card } from "@blueprintjs/core";
import { MultiSelect, Select } from "@blueprintjs/select";
import { useHistory } from 'react-router-dom';

import { searchFormState } from '../App';
import { createRangeArr } from './range';
import './SearchForm.css';



const SearchForm = () => {
    
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
    const [highestNote, setHighestNote] = useState({});
    const [lowestNote, setLowestNote] = useState({});

    const history = useHistory();   // creates a history object
    const formSnap = useSnapshot(searchFormState);

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

    const handleEraStyleCheckboxChange = (evt) => searchFormState.setEraStyleCheckboxState(evt.target.getAttribute('data-es'));

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
    
    const genderArr = [{display: 'male', value: 'male'}, {display: 'female', value: 'female'}, {display: 'select', value: null}];
    const renderGender = (gender, { handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                key={gender.display}
                onClick={handleClick}
                text={gender.display}
            />
        );
    };
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
            />
        );
    };

    const handleGenderSelect = (g) => searchFormState.setFormField('gender', g.value);
    const handleHighestSelect = (note) => setHighestNote(() => ({...note}));
    const handleLowestSelect = (note) => setLowestNote(() => ({...note}));

    const handleAccompCheckboxChange = (evt) => {
        let { value } = evt.target;
        const accompType = evt.target.getAttribute('data-accomp');

        // evt.target returns a string
        let bool = JSON.parse(value);
        setCheckboxesAccomp(boxes => ({
            ...boxes,
            [accompType]: !bool
        }));
    };

    const handleAccompDiffCheckboxChange = (evt) => {
        let { value } = evt.target;
        const accompDiff = evt.target.getAttribute('data-accomp-diff');

        // evt.target returns a string
        let bool = JSON.parse(value);
        setCheckboxesAccompDifficulty(boxes => ({
            ...boxes,
            [accompDiff]: !bool
        }));
    };

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
        if (highestNote.value) searchFormState.setFormField('highestNote', highestNote.value);
        if (lowestNote.value) searchFormState.setFormField('lowestNote', lowestNote.value);
        
        searchFormState.worksSearch(searchFormState.formFields);

        history.push('/works');
    };

    return (
        <div>
            <Card className='Card'>
                <H3>Search</H3>
                <form onSubmit={handleFormSubmit} className='SearchForm'>
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
                                    data-es={eS}
                                    name="eraStyle" 
                                    label={eS} 
                                    inline="true" 
                                    value={formSnap.eraStyleCheckboxState[eS]} 
                                    onChange={handleEraStyleCheckboxChange} 
                                />)
                            : null
                        }
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
                        <FormGroup 
                            label={ formSnap.checkboxData.countries ? "Country/Region" : null } 
                            labelFor="countries"
                            labelInfo='(of composer)'
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
                        <FormGroup label='Gender' labelFor='gender' >
                            <Select
                                items={genderArr}
                                itemRenderer={renderGender}
                                onItemSelect={handleGenderSelect}
                                
                                filterable={false}
                            >
                                <Button text={ formSnap.formFields.gender || genderArr[2].display } rightIcon="double-caret-vertical" />
                            </Select>
                        </FormGroup>
                        <FormGroup label='Highest Note' labelFor='highestNote' labelInfo='(horn in F)' helperText='above the treble clef staff'>
                            <Select
                                items={highRangeArr}
                                itemRenderer={renderRange}
                                onItemSelect={handleHighestSelect}
                                
                                filterable={false}
                            >
                                <Button text={ highestNote.label || lowRangeArr[0].label } rightIcon="double-caret-vertical" />
                            </Select>
                        </FormGroup>
                        <FormGroup label='Lowest Note' labelFor='lowestNote' labelInfo='(horn in F)' helperText='descending, beginning G below middle C'>
                            <Select
                                items={lowRangeArr}
                                itemRenderer={renderRange}
                                onItemSelect={handleLowestSelect}
                                
                                filterable={false}
                            >
                                <Button text={ lowestNote.label || lowRangeArr[0].label } rightIcon="double-caret-vertical" />
                            </Select>
                        </FormGroup>
                        <FormGroup label="Accompaniment" labelFor="accompaniment">
                            <Checkbox data-accomp="orchestra" name="accompaniment" label="Orchestra" inline="true" value={checkboxesAccomp.orchestra} onChange={handleAccompCheckboxChange} />
                            <Checkbox data-accomp="piano" name="accompaniment" label="Piano" inline="true" value={checkboxesAccomp.piano} onChange={handleAccompCheckboxChange} />
                            <Checkbox data-accomp="unaccompanied" name="accompaniment" label="Unaccompanied" inline="true" value={checkboxesAccomp.unaccompanied} onChange={handleAccompCheckboxChange} />
                        </FormGroup>
                        <FormGroup label="Accompaniment Difficulty" labelFor="accompDifficulty">
                            <Checkbox data-accomp-diff="novice" name="accompDifficulty" label="novice" inline="true" value={checkboxesAccompDifficulty.novice} onChange={handleAccompDiffCheckboxChange} />
                            <Checkbox data-accomp-diff="intermediate" name="accompDifficulty" label="intermediate" inline="true" value={checkboxesAccompDifficulty.intermediate} onChange={handleAccompDiffCheckboxChange} />
                            <Checkbox data-accomp-diff="advanced" name="accompDifficulty" label="advanced" inline="true" value={checkboxesAccompDifficulty.advanced} onChange={handleAccompDiffCheckboxChange} />
                        </FormGroup>
                        <FormGroup label="Technique" labelFor="techniques" helperText=' eg. lip trill, stopped' >
                            <InputGroup 
                                id="techniques" 
                                name="techniques" 
                                placeholder='keyword' 
                                value={formSnap.formFields.techniques} 
                                onChange={searchFormState.handleFormChange} 
                            />
                        </FormGroup>
                        <FormGroup label="Title" labelFor="title">
                            <InputGroup id="title" name="title" placeholder="keyword" value={formSnap.formFields.title} onChange={searchFormState.handleFormChange} />
                        </FormGroup>
                        <FormGroup label="Last Name" labelFor="lName">
                            <InputGroup id="lName" name="lName" placeholder="composer" value={formSnap.formFields.lName} onChange={searchFormState.handleFormChange} />
                        </FormGroup>
                        <FormGroup label="First Name" labelFor="fName">
                            <InputGroup id="fName" name="fName" placeholder="composer" value={formSnap.formFields.fName} onChange={searchFormState.handleFormChange} />
                        </FormGroup>
                    </Collapse>
                    <FormGroup className='submit-btn'>
                        <Button type="submit" intent="primary">Submit</Button>
                    </FormGroup>
                </form>
            </Card>

        </div>
    );
};

export default SearchForm;