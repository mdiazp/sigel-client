import { Validators, ValidatorFn } from '@angular/forms';

export class Area {
  constructor(public ID: number,
              public Name: string,
              public Description: string,
              public Location: string) {}

  public IDValidators: ValidatorFn[] = [Validators.required];
  public NameValidators: ValidatorFn[] = [Validators.required];
  public DescriptionValidators: ValidatorFn[] = [Validators.required];
  public LocationValidators: ValidatorFn[] = [Validators.required];
}
