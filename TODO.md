

- ~~copy User.Authenticate~~
    - ~~write tests/copy~~
- ~~remove isAdmin from User.register model and route.~~
    - ~~it's automatically false.~~
    - ~~may not need to update tests~~
- ~~auth routes~~
    - ~~copy auth/token over to users routes~~
        - ~~clear up app.js (delete auth)~~
        - ~~delete auth.js routes~~
    - ~~import or make schema~~
- ~~copy /helpers/tokens~~
    - ~~add user.id to token~~


- remove userId from model methods as appropriate? or pass it automatically from route?
    - we don't want people to add their user id manually. Not even admin. Right(?)
    - update tests accordingly
THEN
- add auth middleware to routes
- test routes manually