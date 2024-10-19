export function validateAuction({ name, set, year, gradingCompany, grade, price, holo, description,imageURL, endDate }) { //Checks validations frontend
    if (!name || !set || !year || !gradingCompany || !grade || !price || !holo || !imageURL || !endDate || !description) {
        return { valid: false, message: 'All fields are required.' };
    }

    if (grade < 7) {
        return { valid: false, message: 'Grade must be 7 or higher.' };
    }

    if (price <= 0) {
        return { valid: false, message: 'Starting price must be greater than 0.' };
    }

    if (year < 1995) {
        return { valid: false, message: 'Year must be at least 1995.'}
    }

    const now = new Date();
    if (endDate <= now) {
        return { valid: false, message: 'Auction must end in the future.'}
    }
    return { valid: true, message: '' };
}
