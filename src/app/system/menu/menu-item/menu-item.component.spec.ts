import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, MenuController } from '@ionic/angular';

import { MenuItemComponent } from './menu-item.component';
import { Menu } from '../menu.model';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

describe('MenuItemComponent', () => {
  let component: MenuItemComponent;
  let fixture: ComponentFixture<MenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuItemComponent],
      providers: [
        { provide: MenuController, useValue: jasmine.createSpyObj(['close']) },
      ],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'something', component: MenuItemComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    component.menuItem = new Menu();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide menu after navigation', () => {
    // TODO: test router was called
    // const item = new Menu();
    // item.url = '/something';
    // component.menuItem = item;
    const menu: any = TestBed.inject(MenuController);
    component.hideMenu();
    expect(menu.close).toHaveBeenCalledTimes(1);
    menu.close.calls.reset();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector('ion-item').click();
    expect(menu.close).toHaveBeenCalledTimes(1);
    // const location = TestBed.inject(Location);
    // location.path(); // ?
  });
});
