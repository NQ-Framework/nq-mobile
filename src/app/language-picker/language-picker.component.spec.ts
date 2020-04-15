import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LanguagePickerComponent } from './language-picker.component';

describe('LanguagePickerComponent', () => {
  let component: LanguagePickerComponent;
  let fixture: ComponentFixture<LanguagePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguagePickerComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguagePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should store language in storage', () => {
    const spy = spyOn(localStorage, 'setItem');
    const spyReload = spyOn(component, 'reloadWindow');
    component.changeLanguage('rs');
    expect(spy).toHaveBeenCalledWith('language_code', 'rs');
    expect(spyReload).toHaveBeenCalled();
  });

  it('should recognize active language from storage', () => {
    const spy = spyOn(localStorage, 'getItem').and.returnValue('rs');
    expect(component.languageActive('rs')).toEqual(true);
    expect(component.languageActive('en')).toEqual(false);
    spy.and.returnValue(null);
    expect(component.languageActive('rs')).toEqual(true);
    expect(component.languageActive('en')).toEqual(false);
  });
});
