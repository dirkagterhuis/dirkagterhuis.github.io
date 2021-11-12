# To do
- [X] Change the whole thing to a node app. Create index.js and have it serve up index.html, so you can host locally using nodemon: it now serves index.html, but e.g. the headers aren't rendered. 
- [X] Added local-web-server as package dependency
- [ ] Spotify-app
    - [ ] Use Github secrets to manage spotify app secrets. Test overriding them in local. 
    - [ ] Use Spotify OAuth flow. Store stuff on client side.
    - [ ] Retrieve playlists by user id
    - [ ] Give back a json or csv. 

# How to

## Setup development environment
- `npm install`
- Save your Spotify App `Client Id` and `Client Secret` in `local.json`. Don't worry: this file is in `.gitignore`
- `ws` to start up local server on localhost:8000