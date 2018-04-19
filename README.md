# ngx-cron

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The package artifacts will be stored in the `dist/` directory. Demo will be generated in the `docs/` folder.

## Release

* `npm run lint`
* `npm run build`
* `git add -- docs\`
* `npm version {{-version here-}}`
* `git push --tags`
* `cd dist`
* `npm publish`

## Credits
`ngx-dnd` is a [Swimlane](http://swimlane.com) open-source project; we believe in giving back to the open-source community by sharing some of the projects we build for our application. Swimlane is an automated cyber security operations and incident response platform that enables cyber security teams to leverage threat intelligence, speed up incident response and automate security operations.
