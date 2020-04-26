import { Menu } from './menu.model';

describe('Menu Model', () => {
  it('Instantiates', () => {
    expect(new Menu()).toBeDefined();
  });

  it('Gets text based on current language', () => {
    const item = new Menu();
    item.text = [
      { language: 'rs', text: 'rs text' },
      { language: 'en', text: 'en text' },
    ];
    localStorage.setItem('language_code', 'rs');
    expect(Menu.getText(item)).toEqual('rs text');

    localStorage.setItem('language_code', 'en');
    expect(Menu.getText(item)).toEqual('en text');
  });

  it('Falls back to first language if missing translation', () => {
    const item = new Menu();
    item.text = [{ language: 'en', text: 'en text' }];
    localStorage.setItem('language_code', 'rs');
    expect(Menu.getText(item)).toEqual('en text');
  });

  it('Returns unknown when missing any text properties', () => {
    const item = new Menu();
    expect(Menu.getText(item)).toEqual('Unknown menu label');
    item.text = [];
    expect(Menu.getText(item)).toEqual('Unknown menu label');
    item.text = [{ language: 'any', text: 'some text' }];
    expect(Menu.getText(item)).not.toEqual('Unknown menu label');
  });

  it('falls back to rs when no language is set', () => {
    const item = new Menu();
    item.text = [
      { language: 'rs', text: 'rs text' },
      { language: 'en', text: 'en text' },
    ];
    localStorage.removeItem('language_code');
    expect(Menu.getText(item)).toEqual('rs text');
  });
});
