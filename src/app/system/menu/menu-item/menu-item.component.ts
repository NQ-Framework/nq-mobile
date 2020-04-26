import { Component, OnInit, Input } from '@angular/core';
import { Menu } from '../menu.model';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
  @Input() public menuItem: Menu;
  constructor(private menu: MenuController) {}

  ngOnInit() {}

  getText(item: Menu): string {
    return Menu.getText(item);
  }
  hideMenu() {
    this.menu.close();
  }
}
