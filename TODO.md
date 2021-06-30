

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

---
- ~~adjust auth middleware to look at userId and not username~~
- ~~add auth middleware to routes & adjust comments~~
- ~~test routes manually~~

---

updateJSONSchema so that you can't add userId