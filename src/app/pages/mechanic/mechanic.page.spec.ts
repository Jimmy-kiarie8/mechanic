import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MechanicPage } from './mechanic.page';

describe('MechanicPage', () => {
  let component: MechanicPage;
  let fixture: ComponentFixture<MechanicPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MechanicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
