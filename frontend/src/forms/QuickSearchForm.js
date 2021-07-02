
import { useSnapshot } from 'valtio';
import { searchFormState } from '../App';


const QuickSearchForm = () => {

    const formSnap = useSnapshot(searchFormState);

    // handle change function (use computed properties)

    const handleFormSubmit = (evt) => {
        evt.preventDefault();
        // console.log('formSnap.formFields',formSnap.formFields)
        searchFormState.worksSearch(formSnap.formFields);
    };

    // use BluePrint components:
    // - Composer			- keyword
    // - Title				- keyword
    // - Duration (in minutes) - multi select (5 min intervals, eg 5-10, 10-15) - maybe try the dual slider?
    // - Level				- multi select (1-5 scale vs Easy/Medium/Hard?) - maybe the slider?
    // - Era/Style			- checkboxes (dynamically)

    return (
        <div>QuickSearchForm
            <form onSubmit={handleFormSubmit}>
                <input id="title" name="title" type="text" value={formSnap.formFields.title} onChange={searchFormState.handleChange}></input>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default QuickSearchForm;