# To do
- [ ] Spotify-app
    - Continue making your app with a local dev server, in Node.js/ts, and then at last deploy to AWS. Forward from 'own' website to AWS website.
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
- `npm run dev` to start up local server on localhost:8000

# Changelog
- Converted to TS due to annoying Node/JS issues in node versions.
- Static website vs. Node.JS app: Went with Node.js: I want to learn it, and move it to TS, so just do it. It also makes this 1000 times easier and the learning more meaningfull than writing some vanilla static website that does everything itself without using NPM libraries. While at it, try out AWS or otherwise Heroku, since  you want to learn AWS anyway.
- Converted website to work both as a static website, and as a Node.JS Express app, such that the website works from Github Pages until it's pushed to AWS. Had some issues with hosting locally using `ws` vs. `nodemon`, but Nodemon definitely had a preference in ease of development as you don't have to restart the server on every change. It did however require the whole app to work as a Node.JS Express app, since you run `nodemon index.ts` and got served by the app, while `ws` just rendered the `index.html` in root.