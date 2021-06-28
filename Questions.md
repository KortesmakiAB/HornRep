#### I can't remember...
- When writing Model methods, I'm not sure whether or not to write checks for db colums which are "UNIQUE". The db will throw errors anyways if there is a unique violation, so why should I write one?
    - Pros: proactive, clear. Any other pros?
    - Cons: it adds more (unnecessary?) queries. 