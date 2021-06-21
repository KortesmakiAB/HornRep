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

### Obstacle:
- Sarah has data in xls and word.
    - are there Word extraction tools?
    - open word files and write out the content to a txt or into a db?
    - how do I get the xls data into Postgres?
- But maybe it's hosted in a db?
    - how to export the data

### Demographic: 
horn players of any age or ability
ie, professionals & students

### 2 primary changes
- Expanded, more powerful searching of repertoire
    - difficulty
    - nationality
    - style/period
    - duration
    - year (of composition)
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

The data I want is already on 1 IMSLP page. So, scraping seems like the obvious choice.
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
- I’d like to seed my db with Sarah’s research. This will be tricky.

***See pdf for complete schema***

Tables:
- Users
- Works: from Sarah’s data & from IMSLP
- Composers
- Comments

### Design (pages):
**Home**
About
Quick Search - Needs to be the body of the homepage. It’s why people come to the site.
- Composer			- keyword
- Title				- keyword
- Duration			- slider or multi select (5 min intervals, eg 5-10, 10-15)
- Level				- slider or multi select (1-5 scale vs Easy/Medium/Hard?)
- Era/Style			- checkboxes (dynamically)

**Advanced search**
- Composer			- keyword
- Title				- keyword
- Dates	(1887-1974) 		- how?? Is this necessary, given era/style field?
- Duration			- slider or multi select (5 min intervals, eg 5-10, 10-15)
- Horn Range - Highest		- slider or multi select (beginning at g. Default - any)
- Horn Range - Lowest		- slider or multi select ( beginning at g. Default - any)
- Level				- slider or multi select (1-5 scale vs Easy/Medium/Hard?)
- Clef				- do not include
- Techniques			- maybe do not include. Else checkboxes (dynamically)
- Era/Style			- checkboxes (dynamically)
- Country/Region		- checkboxes (dynamically)
- Accompaniment		- checkboxes (Orchestra, Piano, Unaccompanied)
- Accompaniment Difficulty	-  slider or multi select (1 - 5 scale vs Easy/Medium/Hard?)
- Gender			- multi select

**Search Results**
- Lists: Composer, Title, Duration, Level, Era/Style
    - Or could be cards
- Click to go to details page 

**Details**
- Contains all data, comments, YouTube search
- Can add a comment directly here (if logged in)
- Option: can be edited, but only by the creator, unless provided by IMSLP.

**Add a new work**
- Form is similar to 'Advanced Search', possibly even the same/re-usable
- Sarah would prefer an email be sent to her so she can vet, then send the data to me to add to the site.
- Maybe add an imslp link and/or link to publisher

**Sarah's Research**
- list of all of her work

**Report Duplicate Works**

---

Notes for Aaron:
Some similar data found at https://colindorman.com/french-horn-music/
A fun UI morsel: tags sample: https://musicbrainz.org/tags

