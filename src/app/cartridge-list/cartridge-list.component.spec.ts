import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartridgeListComponent } from './cartridge-list.component';

describe('CartridgeListComponent', () => {
  let component: CartridgeListComponent;
  let fixture: ComponentFixture<CartridgeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartridgeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartridgeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
