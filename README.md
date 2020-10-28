# LTI Library Resources

Table of Contents

- [Set up VS Code](#set-up-vs-code)
- [Set up git-secrets hooks](#set-up-git-secrets-hooks)
- [Set up LTI tool](#set-up-lti-tool)
- [Set up MongoDB](#set-up-mongodb)
- [Start up the app](#start-up-the-app)
- [Test it out](#test-it-out)
- [Documentation](#documentation)

## Setup VS Code

1. Download and install VS Code: https://code.visualstudio.com/
2. Install ESlint package: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
3. Install ESlint rules: npx install-peerdeps --global eslint-config-wesbos

## Set up git-secrets hooks

To prevent us from accidentally committing secrets, we will install the [git-secrets](https://github.com/awslabs/git-secrets) hooks.

1. Install git-secrets locally on your machine. See instructions for your platform [here](https://github.com/awslabs/git-secrets#installing-git-secrets).

2. Set up git-secrets for this repo

   - `cd` into the repo
   - Run `git secrets --install`

3. Configure git-secrets by running the following commands:
   - `git secrets --register-aws`
   - `git secrets --add 'SECRET(\s|[a-zA-Z\_])*=\s*.+'`

These rules will prevent any variables prefixed with `SECRET_` from being committed with a value filled in.

## Set up LTI tool

1. Startup your local Moodle on Docker, then log in as admin
2. Go to Site administration > Plugins > Activity modules > External tool > Manage tools
3. Click on configure a tool manually
4. Enter in the following:

   Tool name: <Anything>
   Tool URL: http://localhost:8080
   LTI version: LTI 1.3
   Public key type: RSA key
   Initiate login URL: http://localhost:8080/login
   Redirection URI(s): http://localhost:8080

   Services:

   IMS LTI Assignment and Grade Services: Use this service for grade sync and column management
   IMS LTI Names and Role Provisioning: Use this service to retrieve members' information as per privacy settings
   Tool Settings: Use this service

   Privacy:

   Share launcher's name with tool: Always
   Share launcher's email with tool: Always
   Accept grades from the tool: Always

5. Click "Save changes"
6. Then under "Tools" find LTI app you just created and click on the "View configurations" icon (first icon, next to gear)
7. Copy Client ID value into SECRET_PLATFORM_CLIENTID value in .env file (created below in [Start up the app](#start-up-the-app), Step 1).

## Set up MongoDB

1. Install MongoDB: https://docs.mongodb.com/manual/administration/install-community/
2. Helpful to install MongoDB Compass to ensure your database is running correctly: https://www.mongodb.com/try/download/compass

## Startup app

1. Copy .env-dist to a local .env file. There are some empty secret fields in .env.dist. Ask Rex for the secrets.
2. Set SECRET_LTI_KEY to any random string, and DB_DATABASE to whatever you'd like
3. (Optional) Comment out DEBUG if you do not want to see the LTI provider debugging messages
4. Start app:

   1. `yarn` → This installs all the necessary dependencies.
   2. `yarn dev` → This is set to run migrate-mongo and start up both the client and server.

5. On initial load the app will display the public key in the terminal
6. Copy the key, and remember to remove the `[0]` characters from the start of each row of the key, and include the BEGIN/END PUBLIC KEY lines
7. Back to Moodle: Go to Site administration → Plugins → Activity modules → External tool → Manage tools, and click on the gear icon on the LTI external tool
8. Paste the public key you just copied (with `[0]` removed) into 'Public key'
9. Click "Save changes"

## Test it out

1. Go to a course site
2. Turn editing on and click "Add activity or resource", choose External tool, enter any name, choose your LTI tool from Preconfigured tool, and then click "Save changes"
3. You should see your tool embedded in the site and the app should load up

## Documentation

- LTIjs: https://cvmcosta.me/ltijs/#/provider
- Instructure UI: https://instructure.design/
- Migrate-mongo: https://www.npmjs.com/package/migrate-mongo
- Jest: https://jestjs.io/
- UCLA API: https://kb.sait.ucla.edu/display/KB/API+Knowledgebase