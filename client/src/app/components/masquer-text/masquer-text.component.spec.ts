import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasquerTextComponent } from './masquer-text.component';

describe('MasquerTextComponent', () => {
  let component: MasquerTextComponent;
  let fixture: ComponentFixture<MasquerTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasquerTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasquerTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
