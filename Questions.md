#### `<SearchForm>` 
I wanted to have eraStyle be checkboxes which correspond to the era_style's in the db. The db contains a string which may be comma or slash separated. I thought about writing a method to query that data, but it would need to iterate over each character of each string, looking for commas and/or slashes. Maybe regex would be faster? or does it iterate too? Maybe I could change the schema to be an array of string values. But that seemed like too much work also, so I went with a keyword search. If I didn't want a keyword search, what kind of approach would you suggest?

How to add a new Country or Era/Style with MultiSelect and/or Select, 
eg. `<EraStyleMultiSelect>` or `<CountrySelect>`

#### `<useLocalStorage>`
frontent/src/utilities/useLocalStorage
my approach somehow seems clunky. Suggestions?

#### Valtio
I'm not sure I understand the use case for `subscribe()` and `unsubscribe()`. 
eg, `<WorkDetails>` When changing the form input value each keystroke is causing another API call, 2 duplicate calls, actually.

---

(not that important right now...)
#### I can't remember...
When writing Model methods, I'm not sure whether or not to write checks for db columns which are "UNIQUE". The db will throw errors anyways if there is a unique violation, so why should I write one?
- Pros: proactive, clear. Any other pros?
- Cons: it adds more (unnecessary?) queries. 

I want a function which converts integers from the query string. Would you have done this differently? (see /helpers/qString). 
I'm using this function in /routes/works.js => `router.get('/' ...`. 
I suppose it would've been simpler to manually parseInt the two properties I needed as integers, but I thought it would be nice to have something reusable.
(Note: Maybe add my solution to Daybook?)
