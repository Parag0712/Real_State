export function validateField(value, fieldName) {
    if (value.trim() === "") {
        return res.status(400).json(`${fieldName} is required`)
    }
}
