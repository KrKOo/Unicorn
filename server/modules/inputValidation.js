import Joi from '@hapi/joi'

export const registerValidation = data => {
    const schema = {
        username: Joi.string().min(4).max(20).required().label("Your username does not meet the requirements."),
        email: Joi.string().email({ minDomainSegments: 2 }).label("You must enter a valid e-mail."),
        password: Joi.string().min(8).required().label("Your password must be at least 8 characters long.")
    }
    return Joi.validate(data, schema);
}

export const loginValidation = data => {
    const schema = {
        username: Joi.string().min(4).max(20).required().label("Your username does not meet the requirements."),
        password: Joi.string().min(8).required().label("Your password must be at least 8 characters long.")
    }
    return Joi.validate(data, schema);
}