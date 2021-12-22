# To do
- [ ] Spotify-app
  - Deploy to AWS. Forward from 'own' website to AWS website.
    - [ ] To budget, add action to shutdown EC2 instance when budget is reached.
    - [ ] Use Elastic Beanstalk to host node.js server? [link](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html)
      - [ ] or [link](https://ourcodeworld.com/articles/read/977/how-to-deploy-a-node-js-application-on-aws-ec2-server)
    - [ ] Implement lambda's?
    - [ ] Make something that on Dev, it only retrieves 10 playlists, but on prod, retrieves all
  - [ ] Possibly filter on playlists owned by user? 
  - [ ] Clean up and organize code properly
  - [ ] Give back a json or csv. Allow user to choose.
  - [ ] WIP: Show something to user regarding # of playlists that are about to be extracted, and progress of the whole process. 
- [ ] Use menu button for navigation
- [ ] Something to track traffic
- [ ] Make something to turn .md blogs into content
- [ ] Convert to ts. Add types.
- [ ] Add tests
- [ ] Make site available as both static (github pages) as Node.js app using Express. Something with the index.html embedding the /public/views/index.html, but then with all refs working. Try and determine whether it's static or not, and then serve the correct content accordingly, with the right references. Or: use a view engine and move views to root dir, and update refs. Ideally end op with only 1 views dir and 1 static index.html, referencing the views.
  - Converted website to work both as a static website, and as a Node.JS Express app, such that the website works from Github Pages until it's pushed to AWS. Had some issues with hosting locally using `ws` vs. `nodemon`, but Nodemon definitely had a preference in ease of development as you don't have to restart the server on every change. It did however require the whole app to work as a Node.JS Express app, since you run `nodemon index.ts` and got served by the app, while `ws` just rendered the `index.html` in root.-> Didn't work yet.


# Future features
- [ ] Allow selection of 'own playlists only' vs. 'subscribed playlists too'. 
- [ ] Allow selection of which fields to be retrieved

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

# Troubleshooting
- During auth/login to spotify: redirect isn't working: Solution: add `http://localhost:8000/spotify-app` to the allowed redirect URI's on developer.spotify.com.