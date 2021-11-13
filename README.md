# To do
- [X] Change the whole thing to a node app. Create index.js and have it serve up index.html, so you can host locally using nodemon: it now serves index.html, but e.g. the headers aren't rendered. 
- [X] Added local-web-server as package dependency
- [ ] Spotify-app
    - [ ] Authorization
        - [ ] Use Github secrets to manage spotify app secrets. Test overriding them in local. 
            - [ ] Make sure this is safe: that you can't see it from the client side. First check if this is even at all possible, or desired.
        - [ ] Or create aws serverless lambda function to handle calls to spotify
        - [ ] Use Spotify [OAuth flow with PKCE extension](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/) for web apps: that way you don't have to reveal the secret, only the client id. 
          - [ ] uEe session or local storage, preferably session. No cookies. To store token on client side. 
    - [ ] Retrieve playlists by user id
      - [ ] Call get on user playlists, then store all playlists
      - [ ] For all playlists, get all tracks.
    - [ ] Give back a json or csv. 
- [ ] Use menu button for navigation
- [ ] Something to track traffic

# How to

## Setup development environment
- `npm install`
- Save your Spotify App `Client Id` and `Client Secret` in `local.json`. Don't worry: this file is in `.gitignore`
- `ws` to start up local server on localhost:8000