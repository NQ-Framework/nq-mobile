export class Menu {
  text: { language: string; text: string }[];
  url?: string;
  enabled = true;
  icon?: string;
  order = 0;
  type: 'navbutton' | 'label' = 'navbutton';

  static getText(item: Menu): string {
    if (!item.text || !item.text.length) {
      return $localize`Unknown menu label`;
    }
    const language = localStorage.getItem('language_code') || 'rs';
    const found = item.text.find((t) => t.language === language);
    return found ? found.text : item.text[0].text;
  }
}
