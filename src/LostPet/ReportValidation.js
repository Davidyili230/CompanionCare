import validator from "validator"
import { parsePhoneNumberWithError } from "libphonenumber-js"

export function isValidEmail(email) {
    if(validator.isEmail(email)) {
        return true;
    }

    return false;
}

export function isValidPhoneNumber(phoneNumber) {
    try {
        const contactNumber = parsePhoneNumberWithError(phoneNumber, "US");
        return contactNumber.isValid();
    } catch {
        return false;
    }   
}