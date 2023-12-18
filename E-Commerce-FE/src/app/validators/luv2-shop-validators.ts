import { FormControl, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";

export class Luv2ShopValidators {
    // White space validation
    static notOnlyWhitespace(control: FormControl) : ValidationErrors | null {

        // check if the string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {

            // invalid, return error object
            return {'notOnlyWhitespace' : true}
        } else {

            // valid, return null
            return null;
        }
    }
}
