# ngx-cron

🕒 User-friendly cron input...

![](https://content.screencast.com/users/hypercubed/folders/Snagit/media/6ae021c1-738b-4744-a1d1-654578400844/2018-04-19_15-33-16.png)

## Installation instructions

Install `@swimlane/ngx-cron` and peers from `npm`:

```bash
npm install @swimlane/ngx-cron @swimlane/ngx-ui --save
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
<ngx-cron-input [(cron)]="cron" [allowedPeriods]="allowedPeriods" [disabled]="disabled" [allowQuartz]="allowQuartz">
</ngx-cron-input>
```

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Release

- Checkout master (`git checkout master`)
- Pull master (`git pull`)
- Run tests (`npm test`)
- Examine log to determine next version (X.Y.Z)
- Run `git checkout -b release/X.Y.Z`
- Update version in `projects/swimlane/ngx-cron/package.json`
- Update changelog in `projects/swimlane/ngx-cron/CHANGELOG.md`
- Run `git commit -am "(release): X.Y.Z"`
- Run `git tag X.Y.Z`
- Run `git push origin HEAD --tags`
- Run `npm run publish:lib`
- Run `npm run deploy`
- Submit PR

## Credits

`ngx-cron` is a [Swimlane](http://swimlane.com) open-source project; we believe in giving back to the open-source community by sharing some of the projects we build for our application. Swimlane is an automated cyber security operations and incident response platform that enables cyber security teams to leverage threat intelligence, speed up incident response and automate security operations.
