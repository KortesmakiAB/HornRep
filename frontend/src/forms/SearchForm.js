import { useSnapshot } from 'valtio';
import { Button, FormGroup, InputGroup, Collapse, H3, Card, Icon } from "@blueprintjs/core";
import { useHistory } from 'react-router-dom';

import { searchFormState, worksState } from '../App';
import HighestLowestNotes, { highestLowestState  } from './HighestLowestNotes';
import Difficulty, { difficultyState } from './Difficulty';
import AccompAccompDiff, { accompState } from './AccompAccompDiff';
import Duration from './Duration';
import EraStyle, { eraStyleState } from './EraStyle';
import CountryMultiSelect from './CountryMultiSelect';
import GenderSelect from './GenderSelect';

import './SearchForm.css';


const SearchForm = () => {
    const history = useHistory(); 

    const formSnap = useSnapshot(searchFormState);
    const highestLowestSnap = useSnapshot(highestLowestState);
    const difficultySnap = useSnapshot(difficultyState);
    const accompSnap = useSnapshot(accompState);    
    const eraStyleSnap = useSnapshot(eraStyleState);

    const handleFormSubmit = (evt) => {
        evt.preventDefault();

        const difficultyArr = [];
        for (let key in difficultySnap.checkboxesDifficulty) {
            if (difficultySnap.checkboxesDifficulty[key]) difficultyArr.push(key);
        }
        const eraStyleResults = [];
        for (let key in eraStyleSnap.erasStyles) {
            if (eraStyleSnap.erasStyles[key]) eraStyleResults.push(key);
        }
        const countriesResults = [];
        for (let key in formSnap.countriesState) {
            if (formSnap.countriesState[key]) countriesResults.push(key);
        }
        const accompResults = [];
        for (let key in accompSnap.checkboxesAccomp) {
            if (accompSnap.checkboxesAccomp[key]) accompResults.push(key);
        }
        const accompDiffResults = [];
        for (let key in accompSnap.checkboxesAccompDifficulty) {
            if (accompSnap.checkboxesAccompDifficulty[key]) accompDiffResults.push(key);
        }
        
        if (difficultyArr.length) searchFormState.setFormField('difficulty', difficultyArr);
        if (eraStyleResults.length) searchFormState.setFormField('eraStyle', eraStyleResults);
        if (countriesResults.length) searchFormState.setFormField('countries', countriesResults);
        if (accompResults.length) searchFormState.setFormField('accompType', accompResults);
        if (accompDiffResults.length) searchFormState.setFormField('accompDifficulty', accompDiffResults);
        if (highestLowestSnap.highestNote.value) searchFormState.setFormField('highestNote', highestLowestSnap.highestNote.value);
        if (highestLowestSnap.lowestNote.value) searchFormState.setFormField('lowestNote', highestLowestSnap.lowestNote.value);
        
        worksState.worksSearch(searchFormState.formFields);
        
        searchFormState.resetFormFields();
        history.push('/works');
    };

    return (
        <div>
            <Card className='Card'>
                <div>
                    <H3 className='Card-search' >Search</H3>
                    <Icon icon='search' className='Icon-m'></Icon>
                </div>
                
                <form onSubmit={handleFormSubmit} className='SearchForm'>
                    <Difficulty />
                    <EraStyle />
                    {/* <FormGroup label={ formSnap.checkboxData.eraStyle ? "era/style" : null } labelFor="eraStyle">
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
                    </FormGroup> */}
                    <Duration />
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
                        <CountryMultiSelect />   
                        <GenderSelect formParent='SearchForm' />
                        <HighestLowestNotes />
                        <AccompAccompDiff />
                        
                        
                        <FormGroup label="technique" labelFor="techniques" helperText=' eg. lip trill, stopped' >
                            <InputGroup 
                                id="techniques" 
                                name="techniques" 
                                placeholder='keyword' 
                                value={formSnap.formFields.techniques} 
                                onChange={searchFormState.handleFormChange}
                                autoComplete='on'
                            />
                        </FormGroup>
                        <FormGroup label="title" labelFor="title">
                            <InputGroup id="title" name="title" placeholder="keyword" value={formSnap.formFields.title} onChange={searchFormState.handleFormChange} autoComplete='on' />
                        </FormGroup>
                        <FormGroup label="last name" labelFor="lName">
                            <InputGroup id="lName" name="lName" placeholder="composer" value={formSnap.formFields.lName} onChange={searchFormState.handleFormChange} autoComplete='on' />
                        </FormGroup>
                        <FormGroup label="first name" labelFor="fName">
                            <InputGroup id="fName" name="fName" placeholder="composer" value={formSnap.formFields.fName} onChange={searchFormState.handleFormChange} autoComplete='on' />
                        </FormGroup>
                    </Collapse>
                    <FormGroup className='submit-btn'>
                        <Button type='submit' intent='primary'>Submit</Button>
                    </FormGroup>
                </form>
            </Card>
        </div>
    );
};

export default SearchForm;