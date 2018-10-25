import { Validators, ValidatorFn } from '@angular/forms';
import {
  User
} from '@app/models/core';

export class Local {
  constructor(public ID: number,
              public AreaID: number,
              public Name: string,
              public Description: string,
              public Location: string,
              public WorkingMonths: string,
              public WorkingWeekDays: string,
              public WorkingBeginTimeHours: number,
              public WorkingBeginTimeMinutes: number,
              public WorkingEndTimeHours: number,
              public WorkingEndTimeMinutes: number,
              public EnableToReserve: boolean) {}

  public IDValidators: ValidatorFn[] = [Validators.required];
  public AreaIDValidators: ValidatorFn[] =  [Validators.required];
  public NameValidators: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(100),
  ];
  public DescriptionValidators: ValidatorFn[] = [
    Validators.required,
    Validators.maxLength(1024),
  ];
  public LocationValidators: ValidatorFn[] = [
    Validators.required,
    Validators.maxLength(1024),
  ];
  public WorkingMonthsValidators: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(12),
    Validators.maxLength(12),
  ];
  public WorkingWeekDaysValidators: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(7),
    Validators.maxLength(7),
  ];
  public WorkingBeginTimeHoursValidators: ValidatorFn[] = [
    Validators.required,
    Validators.min(0),
    Validators.max(23),
  ];
  public WorkingBeginTimeMinutesValidators: ValidatorFn[] = [
    Validators.required,
    Validators.min(0),
    Validators.max(59),
  ];
  public WorkingEndTimeHoursValidators: ValidatorFn[] = [
    Validators.required,
    Validators.min(0),
    Validators.max(23),
  ];
  public WorkingEndTimeMinutesValidators:  ValidatorFn[] = [
    Validators.required,
    Validators.min(0),
    Validators.max(59),
  ];

  public EnableValidators: ValidatorFn[] = [Validators.required];

  public toString(): string {
    return `
ID = ` + this.ID.toString() + `
AreaID = ` + this.AreaID.toString() + `
Name = ` + this.Name + `
Description = ` + this.Description + `
Location = ` + this.Location + `
WorkingMonths = ` + this.WorkingMonths + `
WorkingWeekDays = ` + this.WorkingWeekDays + `
WorkingBeginTimeHours` + this.WorkingBeginTimeHours.toString() + `
WorkingBeginTimeMinutes` + this.WorkingBeginTimeMinutes.toString() + `
WorkingEndTimeHours` + this.WorkingEndTimeHours.toString() + `
WorkingEndTimeMinutes` + this.WorkingEndTimeMinutes.toString() + `
EnableToReserve` + this.EnableToReserve;
  }
}
