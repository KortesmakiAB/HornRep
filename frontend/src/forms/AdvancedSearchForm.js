
import { subscribe } from 'valtio'
import { searchFormState } from '../App';


const AdvancedSearchForm = () => {
    const unsubscribe = subscribe(searchFormState.formFields, () => console.log('state has changed to', searchFormState.formFields));


    return (
        <div>Advanced Search Form 
            
        </div>
    );
};

export default AdvancedSearchForm;