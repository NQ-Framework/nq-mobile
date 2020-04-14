import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-language-picker',
  templateUrl: './language-picker.component.html',
  styleUrls: ['./language-picker.component.scss'],
})
export class LanguagePickerComponent implements OnInit {
  supportedLanguages = [
    { code: 'rs', name: 'Srpski' },
    { code: 'en', name: 'English' },
  ];
  constructor() {}

  ngOnInit() {}
  changeLanguage(language: string) {
    localStorage.setItem('language_code', language);
    location.reload();
  }
}
