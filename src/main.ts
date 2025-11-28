// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { App } from './app/app';
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { environment } from './environments/environment';
// bootstrapApplication(App, appConfig).catch((err) => console.error(err));

//* WORKING
// // src/main.ts
// import { bootstrapApplication } from '@angular/platform-browser';
// import { importProvidersFrom } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient } from '@angular/common/http';
// import { provideZoneChangeDetection } from '@angular/core';

// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';

// import { environment } from './environments/environment';
// import { routes } from './app/app.routes';
// import { App } from './app/app';

// bootstrapApplication(App, {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes),
//     provideHttpClient(),
//     // Firebase compat initialization (provides default app used by modular getDatabase())
//     importProvidersFrom(
//       AngularFireModule.initializeApp(environment.firebase),
//       AngularFireDatabaseModule,
//       AngularFireAuthModule,
//       AngularFireStorageModule
//     ),
//   ],
// }).catch((err) => console.error(err));

// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { environment } from './environments/environment';
import { routes } from './app/app.routes';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // Initialize Firebase using compat modules so both compat and modular SDK usage work.
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireDatabaseModule,
      AngularFireAuthModule,
      AngularFireStorageModule
    ),
  ],
}).catch((err) => console.error(err));
