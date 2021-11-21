# To do
- [X] Change the whole thing to a node app. Create index.js and have it serve up index.html, so you can host locally using nodemon: it now serves index.html, but e.g. the headers aren't rendered. 
- [X] Added local-web-server as package dependency
- [ ] Spotify-app
    - General: it's beginning to get awkward to try and to this without a node.js server running, but only from the client. 
      - --> it's so much easier this way. I think. Try and deploy this app in aws or heroku, but keep your front end: redirect to aws. 
    - [ ] AWS
      - [ ] To budget, add action to shutdown EC2 instance when budget is reached.
    - [ ] Authorization
        - [ ] Use Github secrets to manage spotify app secrets. Test overriding them in local. 
            - [ ] Make sure this is safe: that you can't see it from the client side. First check if this is even at all possible, or desired.
        - [ ] Or create aws serverless lambda function to handle calls to spotify
        - [ ] Use Spotify [OAuth flow with PKCE extension](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/) for web apps: that way you don't have to reveal the secret, only the client id. 
          - [ ] HERE: Current error:
          ```Access to fetch at 'https://accounts.spotify.com/authorize?client_id=dd79131036984f2a9bed15ced3265646&response_type=code&scope=playlist-read-private&redirect_uri=http://localhost:8000/views/spotify-app.html&state=555666777&code_challenge_method=S256&code_challenge=%20+' from origin 'http://localhost:8000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
          ```
          -> checkout https://developer.okta.com/blog/2021/08/02/fix-common-problems-cors
        - [ ] **Go with Node.js: I want to learn it, and move it to TS, so just do it. It also makes this 1000 times easier. While at it, try out AWS or otherwise heroku, since  you want to learn AWS anyway.** Just redirect from you website to the spotify part. 
          - [ ] uEe session or local storage, preferably session. No cookies. To store token on client side. 
        - [ ] Use webpack to pass env variables? [link](https://stackoverflow.com/questions/30239060/uncaught-referenceerror-process-is-not-defined)
    - [ ] Retrieve playlists by user id
      - [ ] Call get on user playlists, then store all playlists
      - [ ] For all playlists, get all tracks.
    - [ ] Give back a json or csv. 
- [ ] Use menu button for navigation
- [ ] Something to track traffic
- [ ] Make something to turn .md blogs into content

# How to

## Setup development environment
- `npm install`
- Save your Spotify App `Client Id` and `Client Secret` in `local.json`. Don't worry: this file is in `.gitignore`
- `ws` to start up local server on localhost:8000