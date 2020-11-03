# Nodejs API template

Fairly lightweight setup.

## What's included

- Express server with CORS enabled, helmet and bodyparser, morgan for logs
- MongoDB adapter logic (mongoose wiring, check `/utils/database`)
- Routes sample with async logic (check `/routes/api/v0.1/sample.js`)
- JSDocs and swagger integration for OpenAPI 3, docs are hosted on `/api/v0.1/docs`

## Getting started

- Click on the green `use this template` button and complete the repo generation.
- Modify the `package.json` file to suite your needs.
- Do a `npm i` to generate a `package-lock.json` and you are good to go.

## Future plans

- Simplify the onboarding process, maybe add a cli
- Add boilerplate for other databases as well
- Add some middleware samples
