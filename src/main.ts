import '@angular/localize/init';

import { enableProdMode } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { getTranslations, ParsedTranslationBundle } from '@locl/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const storageLanguage = localStorage.getItem('language_code');
const language = storageLanguage == null ? 'rs' : storageLanguage;

const translationDataPromise =
  language !== 'en'
    ? getTranslations(`/assets/i18n/${language}.json`)
    : Promise.resolve({} as ParsedTranslationBundle);

translationDataPromise.then((data: ParsedTranslationBundle) => {
  if (data.translations) {
    loadTranslations(data.translations);
  }
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(ref => {
      // tslint:disable-next-line: no-string-literal
      if (window['ngRef']) {
        // tslint:disable-next-line: no-string-literal
        window['ngRef'].destroy();
      }
      // tslint:disable-next-line: no-string-literal
      window['ngRef'] = ref;

      // Otherwise, log the boot error
    })
    .catch(err => console.error(err));
});
