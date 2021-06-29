#### I can't remember...
When writing Model methods, I'm not sure whether or not to write checks for db colums which are "UNIQUE". The db will throw errors anyways if there is a unique violation, so why should I write one?
- Pros: proactive, clear. Any other pros?
- Cons: it adds more (unnecessary?) queries. 

I want a function which converts integers from the query string. Would you have done this differently? (see /helpers/qString). 
I'm using this function in /routes/works.js => `router.get('/' ...`. 
I suppose it would've been simpler to manually parseInt the two properties I needed as integers, but I thought it would be nice to have something reusable.
(Note: Maybe add my solution to Daybook?)
