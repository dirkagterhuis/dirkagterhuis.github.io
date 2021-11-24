# To do
- [X] Change the whole thing to a node app. Create index.js and have it serve up index.html, so you can host locally using nodemon: it now serves index.html, but e.g. the headers aren't rendered. 
- [X] Added local-web-server as package dependency
- [ ] Spotify-app
    - General: It's beginning to get awkward to try and to this without a node.js server running, but only from the client. **Go with Node.js: I want to learn it, and move it to TS, so just do it. It also makes this 1000 times easier. While at it, try out AWS or otherwise heroku, since  you want to learn AWS anyway.**
    - Continue making your app with a local dev server, in Node.js/ts, and then at last deploy to AWS. Forward from 'own' website to AWS website.
    - gebleven bij:
      - ik gebruik liever nodemon dan `ws`, maar dan laadt de website lokaal niet goed. Zie errors in console bij laden.
    - [ ] Authorization
      - [X] Implement proper secret management with local variables
      - [ ] Use Spotify [OAuth flow with PKCE extension](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/) for web apps: that way you don't have to reveal the secret, only the client id. 
        - [ ] **// Hier gebleven.** Next: get code after auth, then get token: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/

      - [ ] uEe session or local storage, preferably session. No cookies. To store token on client side. 
    - [ ] Retrieve playlists by user id
      - [ ] Call get on user playlists, then store all playlists
      - [ ] For all playlists, get all tracks.
    - [ ] Give back a json or csv. 
    - [ ] AWS
        - [ ] To budget, add action to shutdown EC2 instance when budget is reached.
        - [ ] Use Elastic Beanstalk to host node.js server? [link](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html)
        - [ ] Implement lambda's?
- [ ] Running express or nodemon doesn't work, but running `ws` does. Huh?
- [ ] Use menu button for navigation
- [ ] Something to track traffic
- [ ] Make something to turn .md blogs into content
- [ ] Convert to ts. Add types.

# How to

## Setup development environment
- `npm install`
- Save your Spotify App `Client Id` and `Client Secret` in `local.yml`. Don't worry: this file is in `.gitignore`:
```yml
localSpotifyAppClientId: "INSERT_CLIENT_ID"
localSpotifyAppClientSecret: "INSERT_CLIENT_SECRET"
```
- `ws` to start up local server on localhost:8000

# Changelog
- Converted to TS due to annoying Node/JS issues in node versions.