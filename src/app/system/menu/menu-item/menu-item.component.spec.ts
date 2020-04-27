import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, MenuController } from '@ionic/angular';

import { MenuItemComponent } from './menu-item.component';
import { Menu } from '../menu.model';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: '',
})
class DummyComponent {}
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
          { path: '**', component: DummyComponent },
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

  it('should hide menu after navigation', async(async () => {
    const item = new Menu();
    component.menuItem = item;
    const menu: any = TestBed.inject(MenuController);
    component.hideMenu();
    expect(menu.close).toHaveBeenCalledTimes(1);
    menu.close.calls.reset();
    const element = fixture.debugElement.query(By.css('ion-item'))
      .nativeElement as HTMLElement;
    element.click();
    await fixture.whenStable();
    expect(menu.close).toHaveBeenCalledTimes(1);
  }));
});
