import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleConfigComponent } from './console-config.component';

describe('ConsoleConfigComponent', () => {
  let component: ConsoleConfigComponent;
  let fixture: ComponentFixture<ConsoleConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
