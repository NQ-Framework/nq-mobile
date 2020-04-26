import { Menu } from './menu.model';

export const loggedOutMenu: Menu[] = getMenu();

function getMenu(): Menu[] {
  const menuItems: Menu[] = [];
  let menuItem = new Menu();
  menuItem.text = [
    { language: 'rs', text: 'O Aplikaciji' },
    { language: 'en', text: 'About' },
  ];
  menuItem.icon = 'information-circle';
  menuItem.url = '/about';
  menuItems.push(menuItem);

  menuItem = new Menu();
  menuItem.text = [
    { language: 'rs', text: 'Uputstvo' },
    { language: 'en', text: 'User manual' },
  ];
  menuItem.icon = 'help';
  menuItem.url = '/help';
  menuItems.push(menuItem);
  return menuItems;
}
