import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAddbannerComponent } from './lead-addbanner.component';

describe('LeadAddbannerComponent', () => {
  let component: LeadAddbannerComponent;
  let fixture: ComponentFixture<LeadAddbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadAddbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadAddbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
