# To do
- [ ] Spotify-app
    - [ ] get user input (json or csv) as param and pass it to spotify as request param and forward it to callback, if that's possible
  - [ ] When nodemon doesn't restart after every request: Check if state is different for every client. If so: perhaps use the session id and store it locally to identify a client.
    - [ ] Issue: the state is the same every time, so if another client connects, it won't get status update messages
      - [ ] Also check with spotify docs or the internet whether state should be unique -> I think it should be. Store it with client? -> but client doesn't persist a redirect from spotify app -> spotify auth -> redirect -> but use local storage, not session
      - [ ] Idea: set timeout of like 30 minutes before client is removed? And/Or after download, remove client again. Or use a database... but i don't want to go there. If you do this, mention it in html website: "I don't want to store this in a database, which is why your session is cleared after X minutes". 
      - [ ] and/Or store state on client side.
      - [ ] --> 
        - [ ] Use Cache: Redis or node-cache, or session memory with array of objects but don't forget to clear it. Also store state on client side. 
        - [ ] Write out scenario's:
          - [ ] Socket connects first time, without State in session storage. Create state. If possible, only after login. 
            - [ ] Socket connects with state in session storage, not on auth redirect -> refresh state. -> not really a different scenario than above.
          - [ ] Socket reconnects with new Id after authentication, with State in session storage -> find existing client by State, update socked Id. 
          - [ ] Remove Client after success or timeout: 60 m.
          - [ ] ---> what you're looking for is session management for node/express/socket io 
            - [ ] Gebleven bij: ik ben ver, maar krijg geen req params als ik /login call, WAAROM? Het werkt wel als ik 'hard' naar bijv `http://localhost:8000/login?state=rgxr3` ga... dan moet het in die html js zitten die de form action zet??
            - [ ] als je echt niet verder komt: 
              - [ ] session store: 
                - [ ] https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
                - [ ] https://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x
              - [ ] Redis: https://stackoverflow.com/questions/41985182/redisstore-ignores-host-and-port-fields
              - [ ] is it a bad idea to have client set the state? nb you can still rename state to session id and use a 'server only' state between spotify and server
  - [ ] Give back a json or csv. Allow user to choose.
  - [ ] Go through all comments in the code
  - [ ] Clean up the text in the .html
  - [ ] Make something that on Dev, it only retrieves 10 playlists, but on prod, retrieves all
  - [ ] Clean up and organize code properly
  - Decide whether to host whole site on AWS, or only spotify app.
  - Deploy to AWS. Forward from 'own' website to AWS website, preferably with own domain in the future.
    - [ ] To budget, add action to shutdown EC2 instance when budget is reached.
    - [ ] Use Elastic Beanstalk to host node.js server? [link](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html)
      - [ ] or [link](https://ourcodeworld.com/articles/read/977/how-to-deploy-a-node-js-application-on-aws-ec2-server)
  - [ ] Possibly filter on playlists owned by user? 
- [ ] Use menu button for navigation
- [ ] Something to track traffic
- [ ] Implement lambda's?
- [ ] Make something to turn .md blogs into content
- [ ] Convert to ts. Add types.
- [ ] Add tests
- [ ] cookie notification? Only needed if you track users.
- [ ] Make site available as both static (github pages) as Node.js app using Express. Something with the index.html embedding the /public/views/index.html, but then with all refs working. Try and determine whether it's static or not, and then serve the correct content accordingly, with the right references. Or: use a view engine and move views to root dir, and update refs. Ideally end op with only 1 views dir and 1 static index.html, referencing the views.
  - Converted website to work both as a static website, and as a Node.JS Express app, such that the website works from Github Pages until it's pushed to AWS. Had some issues with hosting locally using `ws` vs. `nodemon`, but Nodemon definitely had a preference in ease of development as you don't have to restart the server on every change. It did however require the whole app to work as a Node.JS Express app, since you run `nodemon index.ts` and got served by the app, while `ws` just rendered the `index.html` in root.-> Didn't work yet.


# Future features
- [ ] Allow selection of 'own playlists only' vs. 'subscribed playlists too'. 
- [ ] Allow selection of which fields to be retrieved.
- [ ] Allow uploading of playlists to a Spotify account. 
- [ ] Possible show the server .json or .csv as a textbox, not as a file to download.

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
- Implemented Socket.io as a framework to push statusupdates from server to client. The alternative was using Server Side Events (SSE). Although the use case is unidirectional and I'm not using binaries in the communication, SSE's have a limit to the number of open connections.

# Troubleshooting
- During auth/login to spotify: redirect isn't working: Solution: add `http://localhost:8000/spotify-app` to the allowed redirect URI's on developer.spotify.com.