# ngx-cron

🕒 User-friendly cron input...

![](https://content.screencast.com/users/hypercubed/folders/Snagit/media/6ae021c1-738b-4744-a1d1-654578400844/2018-04-19_15-33-16.png)

## Installation instructions

Install `@swimlane/ngx-cron` and peers from `npm`:

```bash
npm install @swimlane/ngx-cron @swimlane/ngx-ui cronstrue --save
```

Add needed the `NgxCronModule` package to imports:

```ts
import { NgxCronModule } from '@swimlane/ngx-cron';

@NgModule({
  ...
  imports: [NgxCronModule]
  ...
})
```

Add the `ngx-cron` component to your page:

```html
<ngx-cron-input
  [(cron)]="cron"
  [allowedPeriods]="allowedPeriods"
  [disabled]="disabled"
  [allowQuartz]="allowQuartz">
</ngx-cron-input>
```

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
