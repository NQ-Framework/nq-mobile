import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuComponent } from './menu.component';
import { of, BehaviorSubject, Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { loggedOutMenu } from './loggedOutMenu';
import { Menu } from './menu.model';
import { first } from 'rxjs/operators';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuComponent],
      providers: [
        {
          provide: AngularFirestore,
          useValue: jasmine.createSpyObj(['collection']),
        },
        {
          provide: AngularFireAuth,
          useValue: { authState: of(null) },
        },
      ],
      imports: [IonicModule.forRoot(), RouterTestingModule],
    }).compileComponents();
  }));

  it('should load logged out menu', async(async () => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    const result = await component.menu$.pipe(first()).toPromise();
    expect(result).toBe(loggedOutMenu);
  }));

  it('should load menu from firestore', async(async () => {
    const mockMenuItem = new Menu();
    mockMenuItem.icon = 'test';
    const mockMenu: Menu[] = [mockMenuItem, mockMenuItem];
    const auth: any = TestBed.inject(AngularFireAuth);
    auth.authState = new BehaviorSubject({ uid: 'user id' });

    const firestore: any = TestBed.inject(AngularFirestore);
    const valueChangesSpy = jasmine.createSpyObj(['valueChanges']);
    valueChangesSpy.valueChanges.and.returnValue(new Subject());
    firestore.collection.and.returnValue(valueChangesSpy);
    localStorage.removeItem('menu_structure');

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    valueChangesSpy.valueChanges().next(mockMenu);

    const result = await component.menu$.pipe(first()).toPromise();
    expect(result).toBe(mockMenu);
  }));

  it('should load menu from local storage', async(async () => {
    const mockExistingMenuItem = new Menu();
    mockExistingMenuItem.icon = 'existing';
    const mockMenuItem = new Menu();
    mockMenuItem.icon = 'new';
    const mockExistingMenu: Menu[] = [mockExistingMenuItem];
    const mockMenu: Menu[] = [mockMenuItem];
    const auth: any = TestBed.inject(AngularFireAuth);
    auth.authState = new BehaviorSubject({ uid: 'user id' });
    const firestore: any = TestBed.inject(AngularFirestore);
    const valueChangesSpy = jasmine.createSpyObj(['valueChanges']);
    valueChangesSpy.valueChanges.and.returnValue(new Subject());
    firestore.collection.and.returnValue(valueChangesSpy);
    localStorage.setItem('menu_structure', JSON.stringify(mockExistingMenu));
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    const result1 = await component.menu$.pipe(first()).toPromise();
    expect(result1[0].icon).toBe(mockExistingMenu[0].icon);
    valueChangesSpy.valueChanges().next(mockMenu);
    const result2 = await component.menu$.pipe(first()).toPromise();
    expect(result2[0].icon).toBe(mockMenu[0].icon);
  }));
});
