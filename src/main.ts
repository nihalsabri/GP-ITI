// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { App } from './app/app';
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { environment } from './environments/environment';
// bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';

import { appConfig } from './app/app.config';
import { App } from './app/app';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { environment } from './environments/environment';

bootstrapApplication(App, {
  // keep existing appConfig contents (providers, imports, etc.)
  ...appConfig,
  providers: [
    // preserve any existing providers from appConfig
    ...(appConfig?.providers ?? []),
    // register compat AngularFire modules (initializeApp + database + storage)
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireDatabaseModule,
      AngularFireStorageModule
    ),
  ],
}).catch((err) => console.error(err));
