Work method to get:  
    era_style from works.
    country from composers. 
    with tests.
    `SELECT ARRAY( SELECT era_style FROM works WHERE era_style IS NOT NULL);`
    `SELECT ARRAY( SELECT country FROM composers WHERE country IS NOT NULL);`
    ```
    
~~Write route to call db~~
~~Write frontend api to call route~~
~~Call frontend api from QuickSearchForm~~
~~Create a proxy(or state) to hold these array(s)~~
~~Map over the array to create checkboxes dynamically~~

https://blueprintjs.com/docs/#core/components/collapse