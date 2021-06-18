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

### API
In addition to Sarah’s research, I could allow the list of works to grow by allowing users to add new works.
Sarah would prefer an email be sent to her so she can vet, then send the data to me to add to the site.

-- AND/OR --
**Naomi**, would you help me figure out IF I can get composer/title of horn solos from the IMSLP API?
- https://imslp.org/api.php ?	THIS IS CONFUSING!
    - https://www.wikidata.org/wiki/Q523660 
- I found a library for the IMSLP API, but there is not much useful in the docs
- Looking through the code it looks like the library/package can either search by person/composer or title and cannot search by instrument.
    - https://pypi.org/project/imslp/ 
    - It looks like he is using `mwclient` a pypi package for MediaWiki
        - https://pypi.org/project/mwclient/
        - https://mwclient.readthedocs.io/en/latest/
    - Do you think I could use `mwclient` to search MediaWiki directly for "horn solos"??

-- AND/OR --
If I cannot use the IMSLP API, then I could incorporate composers/titles from this page...
https://en.wikipedia.org/wiki/List_of_compositions_for_horn
- It might be cool to include some data found on the composition details page
    - eg. dates/description/movements
- Naomi, How can I get this data and potentially the data on the details pages?
    - Beautiful Soup scraping tool?
    - Do I need to manually add the urls for Beautiful Soup to visit, or can I tell it to look for certain types of links to follow (ie links nested in a particular way)?
    - The IMSLP data may change over time. If desired, how would I keep keep my site up to date with IMSLP’s data?

-- AND/OR --
For my ‘details’ page: I could use the youtube API to gather search results for a given horn solo and...
- display links 
- in-line videos (NAH. Too bulky. The YouTube app is going to be better anyways)
- launch a youtube search in another window using data from the current solo


### Schema (tables):
I’d like to seed my db with Sarah’s research.

Users
- Personal Info
- pw 
- etc.

Works (from Sarah’s data) (& from IMSLP?)
- Title Concerto for Horn
- Composer	Atterberg, Kurt
- Dates	(1887-1974)
- Duration	20:00
- Horn Range	E3 to C6
- Level	DIfficult
- Clef	Treble Clef
- Techniques	Lip Trill
- Era/Style	20th Century
- Country/Region	Sweden
- Accompaniment Available	Orchestra, Piano
- Accompaniment Difficulty	Hard
- year (of composition) ?
- gender (of composer)

Comments
- Connected to works

### Design:
Quick Search - Page
Needs to be the body of the homepage. It’s why people come to the site.
- Composer			- keyword
- Title				- keyword
- Duration			- slider or multi select (5 min intervals, eg 5-10, 10-15)
- Level				- slider or multi select (1-5 scale vs Easy/Medium/Hard?)
- Era/Style			- checkboxes (dynamically)

Advanced search - Page
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

Search Results - Page
- Lists: Composer, Title, Duration, Level, Era/Style
    - Or could be cards
- Click to go to details page 

Details - Page
- Contains all data, comments, YouTube search
- Can add a comment directly here (if logged in)
- Option: can be edited, but only by the creator, unless provided by IMSLP.

Add a new work - Page
- Form is similar to 'Advanced Search', possibly even the same/re-usable
- Sarah would prefer an email be sent to her so she can vet, then send the data to me to add to the site.
- Maybe add an imslp link and/or link to publisher

Notes for Aaron:
Some similar data found at https://colindorman.com/french-horn-music/
A fun UI morsel: tags sample: https://musicbrainz.org/tags

