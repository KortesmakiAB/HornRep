import { useSnapshot } from 'valtio';
import { Button, FormGroup, InputGroup, Collapse, H3, Card, Icon } from "@blueprintjs/core";

import AccompAccompDiff from './AccompAccompDiff';
import CountryMultiSelect from './CountryMultiSelect';
import Difficulty from './Difficulty';
import Duration from './Duration';
import EraStyleMulti from './EraStyleMultiSelect';
import GenderSelect from './GenderSelect';
import HighestLowestNotes from './HighestLowestNotes';
import { searchFormState } from '../App';
import useFormSubmitHelpers from './useFormSubmitHelpers';
import './SearchForm.css';


const SearchForm = () => {
    const { searchFormSubmit } = useFormSubmitHelpers();
    const formSnap = useSnapshot(searchFormState);
    
    const handleFormSubmit = (evt) => {
        evt.preventDefault();
        searchFormSubmit();
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
                    <EraStyleMulti />
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
                        <GenderSelect />
                        <HighestLowestNotes />
                        <AccompAccompDiff />
                        <FormGroup label="title" labelFor="title">
                            <InputGroup id="title" name="title" placeholder="keyword" value={formSnap.formFields.title} onChange={searchFormState.handleFormChange} autoComplete='on' />
                        </FormGroup>
                        <FormGroup label="last name" labelFor="lName">
                            <InputGroup id="lName" name="lName" placeholder="composer" value={formSnap.formFields.lName} onChange={searchFormState.handleFormChange} autoComplete='on' />
                        </FormGroup>
                        <FormGroup label="first name" labelFor="fName">
                            <InputGroup id="fName" name="fName" placeholder="composer" value={formSnap.formFields.fName} onChange={searchFormState.handleFormChange} autoComplete='on' />
                        </FormGroup>
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