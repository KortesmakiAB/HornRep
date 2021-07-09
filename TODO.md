### `<Works>`
- Display list of works
- Displays only: Composer, Title, Duration, Level, Era/Style
- Use cards for mobile friendly
- links to `<WorkDetails>`
- handle 'No Results' (sep component?)

### `<WorkDetails>`
- write frontend api to call backend for 1 work details
- call that api
    - somehow wait until the data is loaded to render
    - need a global `<Loading>` which uses a BP spinner
        - add this to `<Home>` as well
        - BP skeleton is also an issue, but prob too much work right now
- display
    - MOVEMENTS
    - COMMENTS

---
- Media query - fix <`Card>` width at large size to not be so wide
- add colors to community buttons (3)
- add space to comment form buttons 2
- edit and delete comments
    - use blueprint icons
---

### login
- add form
- plumb api
- `<WorkDetails>`
    - add snapshot username to handleCommentSubmit for route auth
    - get date
    - add way to check for logged in user to Community Card (2 spots)
        - check for token?



