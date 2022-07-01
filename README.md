# Computing 2 Coursework Submission.
**CID**: 02021702

This is the submission template for your Computing 2 Applications coursework submission.

## Notes
When a player rolls a 0, the player cannot move any of the pieces and the turn is immediately passed to the next player. In the web app implementation this means the panel of the opponent immediately lights up (and the panel of the player immediately grays out) after pressing the roll button. However, this behavior is also observed when the player rolls a non-zero number, but none of the pieces can move by that number -- for instance, when the only piece on the board is on the last tile of the player's path, and the player rolls a 2. While this is perfectly in line with the game mechanism (passing the turn to the opponent if the current player cannot make any valid moves), users may not be able to distinguish between whether they rolled a 0 or rolled a non-zero number but do not have any valid moves.

## Checklist
### Install dependencies locally
This template relies on a a few packages from the Node Package Manager, npm.
To install them run the following commands in the terminal.
```properties
npm install
npm install --prefix ./web-app/common
```
These won't be uploaded to your repository because of the `.gitignore`.
I'll run the same commands when I download your repos.

### Game Module – API
*You will produce an API specification, i.e. a list of function names and their signatures, for a Javascript module that represents the state of your game and the operations you can perform on it that advances the game or provides information.*

- [ ] Include a `.js ` module file in `/web-app/common` containing the API using `jsdoc`.
- [ ] Update `/jsdoc.json` to point to this module in `.source.include` (line 7)
- [ ] Compile jsdoc using the run configuration `Generate Docs`
- [ ] Check the generated docs have compiled correctly.

### Game Module – Implementation
*You will implement, in Javascript, the module you specified above. Such that your game can be simulated in code, e.g. in the debug console.*

- [ ] The file above should be fully implemented.

### Unit Tests – Specification
*For the Game module API you have produced, write a set of unit tests descriptions that specify the expected behaviour of one aspect of your API, e.g. you might pick the win condition, or how the state changes when a move is made.*

- [ ] Write unit test definitions in `/web-app/tests`.
- [ ] Check the headings appear in the Testing sidebar.

### Unit Tests – Implementation
*Implement in code the unit tests specified above.*

- [ ] Implement the tests above.

### Web Application
*Produce a web application that allows a user to interface with your game module.*

- Implement in `/web-app/browser`
  - [ ] `index.html`
  - [ ] `default.css`
  - [ ] `main.js`
  - [ ] Any other files you need to include.

### Finally
- [ ] Push to GitHub.
- [ ] Sync the changes.
- [ ] Check submission on GitHub website.
