# HornRep.org


## Description/Goal: 
What if a horn player/teacher, like me, could search for solo repertoire for the horn using filters like, range, duration, difficulty, style, gender of composer, nationality, etc.? These are the questions the app aims to solve. I believe this is a tool that would be extremely valuable across academia, as well as high school students and professionals.

“*HornRep* is a product of Doctor Sarah Schouten's doctoral dissertation. She has vision for a site that will benefit the horn community by allowing players of all skill levels to review, search and find pieces.”

- A colleague of mine wrote her doctoral  dissertation on this topic and “made” a site. It is in ROUGH shape (php on Joomla). 
    - The searching capability is very limited 
    - Awkward UX, homely UI
- My vision is to completely overhaul the site: all new front-end, back-end, and db. I would be keeping the data, ie her research, discarding the rest, and ADDING new functionality. It should also be mobile-first. Original compositions for horn only.
- After speaking with Sarah, she is totally DOWN for this project!
- My sense is that there is a REAL need for this tool. In consultation with 3 horn colleagues in academia, they recognize the utility and benefits this would bring to the horn community. It’s possible nobody ever uses this tool, or I could see a scenario where there are 20k+ users annually. I’m sure current composers would love to see their compositions listed here as well.

### DATA WRANGLING!
- Sarah has data in xls and word.
    - are there Word extraction tools?
    - open word files and write out the content to a txt or into a db?
    - how do I get the xls data into Postgres?
- But maybe it's hosted in a db?
    - how to export the data
- **Handle things like this:** 
    - Medium vs Moderate vs Intermediate, Hard vs Difficult vs Advanced
    - commas `Flutter tongue, stopped horn ` VS forward-slash `	Easy/Moderate`

### Demographic: 
horn players of any age or ability
ie, professionals & students

### 2 primary changes
- Expanded, more powerful searching of repertoire
    - difficulty
    - country/region
    - style/period
    - duration
    - gender (of composer)
    - range
    - unique features (could maybe instead implement a tagging feature here)
    - Youtube clips (if available)
    - Maybe call YouTube API for search results
    - Link to IMSLP.org parts (if available)
    - Link to click which searches IMSLP for composer/title
- “Comment” functionality
    - Logged-in users may add their comments, ie share their experiences
    - User profiles are linked to comments
        - This encourages more honest, quality contributions
        - Allows other users to evaluate the quality of the data, based on the qualifications of the author

### Stack:
Frontend - React
Backend - Node/Express
DB: Postgres
NB - I'd like to include more testing than previous capstone. Unit and integrated for both front and back ends.

### API
(In addition to Sarah’s research, I could allow the list of works to grow by allowing users to add new works. When users submit a new work, Sarah would prefer an email be sent to her so she can vet, then send the data to me to add to the site. Is there a better way?)

##### GOAL: 
Add a complete list of works for solo horn from IMSLP to my project db. This data is listed here: https://en.wikipedia.org/wiki/List_of_compositions_for_horn
The data I NEED is composer/title. But it would a plus to get more, when there is more available. The idea, is that the horn community would fill out/expand the detailed data for each work over time.

**Naomi** TO SCRAPE OR NOT TO SCRAPE, that is the question!

The data I want is already on 1 IMSLP page (see link above). So, scraping seems like the obvious choice.
There is bonus info, eg. dates/description/movements, sometimes listed on composition details pages.

However, I found an Python IMSLP pypi package. I can't figure out how to use it. So I have been emailing the author (CS prof who is also a musician at Princeton). He is wanting to clarify my needs to determine whether or not he/we may need to add to his tool. I think it would be SUPER cool to contribute to the project.

Here is the tool
- https://pypi.org/project/imslp/ 

The main problem is that the IMSLP API, SUCKS!! It provides 2 things, a complete list of known composers, and known works. Yuck.
- https://imslp.org/api.php ?	THIS IS CONFUSING!
    - https://www.wikidata.org/wiki/Q523660 

Deeper level:
- It looks like he is using `mwclient` a pypi package for MediaWiki, where much of the data is stored.
    - https://pypi.org/project/mwclient/
    - https://mwclient.readthedocs.io/en/latest/
- Do you think I could use `mwclient` to search MediaWiki directly for "horn solos"??


##### Also
For my ‘details’ page: I am hoping to use the youtube API to gather search results for a given horn solo and...
- display links 
- in-line videos (NAH. Too bulky. The YouTube app is going to be better anyways)
- launch a youtube search in another window using data from the current solo


### Schema (tables):
- I’d like to seed my db with Sarah’s research. This will be tricky. See Naomi call notes.

Postgres data-types:
Duration - https://www.postgresqltutorial.com/postgresql-interval/
Year - https://www.postgresqltutorial.com/postgresql-date/ 

***See pdf for complete schema***

Tables:
- Users
- Works: from Sarah’s data & from IMSLP
- Composers
- Comments

### Design (pages):
##### Home
About
Quick Search - Needs to be the body of the homepage. It’s why people come to the site.
- Composer			- keyword
- Title				- keyword
- Duration (in minutes) - multi select (5 min intervals, eg 5-10, 10-15)
- Level				- multi select (1-5 scale vs Easy/Medium/Hard  vs Novice, Intermediate/Advanced?)
- Era/Style			- checkboxes (dynamically)

##### Advanced search
UX Notes: group like inputs together: text, multi-select, checkboxes

- Composer			- text (keyword search)
- Title				- text (keyword search)
- minDuration		- text ("HH:MM:SS")
- maxDuration		- text ("HH:MM:SS")
- Horn Range - Highest		- multi select (beginning at g. Default - any)
- Horn Range - Lowest		- multi select ( beginning at g. Default - any)
- Level(difficulty)			- multi select (Easy/Medium/Moderate/Hard/Difficult)(need to fix this issue in data/wrangling stage)
- Techniques		- keyword
- Era/Style			- checkboxes (list from Sarah/me?) (pass as an array)
- Country/Region	- checkboxes (dynamically - user can specify, Sarah can edit, if necessary) (pass as an array)
- Accompaniment		- checkboxes (Orchestra, Piano, Unaccompanied) (pass as an array)
- Accompaniment Difficulty	-  multi select (Easy/Medium/Moderate/Hard/Difficult)(need to fix this issue in data/wrangling stage)

##### Search Results
- Displays only: Composer, Title, Duration, Level, Era/Style
    - Or could be cards
    - however all of the data for each work is passed to the details page via props
- Click to go to details page 

##### Details
- Contains all data, comments, YouTube search
- Can add a comment directly here (if logged in)
- Option: can be edited, but only by the creator, unless provided by IMSLP.

##### Add a new work
- Form is similar to 'Advanced Search', possibly even the same/re-usable
- Sarah would prefer an email be sent to her so she can vet, then send the data to me to add to the site.
- Maybe add an imslp link and/or link to publisher

##### Sarah's Research
- list of all of her work
- Sarah's preferences?

##### Report Duplicate Works

---
# Plan

## Backend:
1. ~~setup - server, app, db, config~~
1. ~~Work.getWork()~~
1. ~~Work.search()~~
1. ~~add a table for "movements"~~
1. ~~Work.getWork() - add movements and comments & tests~~
1. ~~works route - GET 1~~
1. ~~works route - search~~
1. ~~Work.addWork()~~
1. ~~works route - add new~~
1. ~~Work.updateWork()~~
1. ~~works route - patch /:id~~
1. ~~Work.deleteWork()~~
1. ~~works route - delete /:id~~
1. ~~User methods~~
1. ~~Users routes~~
1. ~~Comments methods~~
1. ~~Comments routes~~
1. ~~Composer methods~~
1. ~~Composers routes~~
1. ~~Routes validation~~
1. ~~Routes auth~~
1. FRONT END


#### TODO backedn optional
1. Flag comments as inappropriate (maybe a required task?)
1. Test authentication on routes (can I combine this, somehow to reduce duplication?)
1. Add a way to change: users isAdmin, password

##### Works
- Create
    - anyone can create
    - Sarah want this to be funneled through her, but I disagree
    - If she has her own dedicated page, I think she may be ok
- GET
    - GET 1
    - GET - search()
        - one search route
        - returns array of objects
        - if empty search, returns all results, sorted by: composer, title
- Edit/PATCH
    - work creator or ADMIN can edit, although ADMIN **SHOULD** almost never edit
    - Sarah is notified when new works are added.(add this feature later?)
    - users who don't own a work can email Sarah with suggested edits, she can then edit.  (add this feature later)?
    - edit icon appears if owner/ADMIN
- Delete 
    - creator or ADMIN may delete

##### Auth
- Register/Login

##### Users
- get a user
- Update personal info
- user or ADMIN can delete their account
- reset pw (add this feature later?)
- endpoint for registering ADMIN users?  (add this feature later)

##### Comments
- Create
    - anyone can add a comment
- GET comments
- Edit
    - comment owner may edit
- Delete
    - comment owner or ADMIN may delete
- Flag (add this feature later)
    - anyone can flag as inappropriate
    - what does this look like?

##### Composers
- Create
- GET all composers
- GET composer by id
- Edit
- Delete

---

## Frontend
- See 'Details' (above)
- Blueprint https://blueprintjs.com/docs/#icons
- Valtio https://github.com/pmndrs/valtio

1. ~~Read Valtio docs. How does this change where I keep state = use valtio everywhere~~
1. ~~Sketch state / components~~
1. ~~Scaffold:~~
    1. ~~Switch/Routes~~
        1. ~~create components with dummy div/text~~
        1. ~~create switch~~
1. ~~`<SearchForm>`~~
1. ~~`<WorkList>`~~
1. ~~`<WorkDetails>`~~
1. ~~`<Home>`~~
1. `<Nav>` (responsive - wait til later?)
1. ~~`<EditComment>`~~
1. ~~Browse (2 pages): Title, Composer~~
1. ~~`<Login>`~~
1. ~~`<Signup>`~~

1. Add/Edit/Delete `<Profile>`
1. `<Loading>` 
1. Add/Edit/Delete `<Work>`
1. Add/Edit/Delete `<Composer>`


1. ??
1. ReadMe.md

### Do Later
- Favicon
- LocalStorage
`<Sara>` (wait til responsive nav)

### React Design
React routing
Sketch: components/state/context/etc.
- Keep the curr user data in state in `<App>`
- Form data state on form pages
- etc.


---
Notes for Aaron:
Some similar data found at https://colindorman.com/french-horn-music/
A fun UI morsel: tags sample: https://musicbrainz.org/tags

