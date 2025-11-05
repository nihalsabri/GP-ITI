import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tradespeople } from './tradespeople';

describe('Tradespeople', () => {
  let component: Tradespeople;
  let fixture: ComponentFixture<Tradespeople>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tradespeople]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tradespeople);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
