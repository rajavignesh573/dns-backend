const userSignupSchema = {
    name: {
        notEmpty: {
            errorMessage: 'Name is required'
        }
    },
    email: {
        notEmpty: {
            errorMessage: 'Email is required'
        },
        isEmail: {
            errorMessage: 'Email should be in a valid format'
        }
    },
    phone: {
        notEmpty: {
            errorMessage: "Phone number is required"
        },
        isLength: {
            options: { min: 10, max: 10 },
            errorMessage: "Provide a valid 10-digit phone number"
        }
    },
    password: {
        notEmpty: {
            errorMessage: 'Password is required'
        },
        isLength: {
            options: { min: 6, max: 18 },
            errorMessage: "password should be between 6 and 18 characters"
        }
    }
};

const userLoginSchema = {
    email: {
        notEmpty: {
            errorMessage: 'Email is required'
        },
        isEmail: {
            errorMessage: 'Email should be in a valid format'
        }
    },
    password: {
        notEmpty: {
            errorMessage: 'Password is required'
        },
        isLength: {
            options: { min: 6, max: 18 },
            errorMessage: "Provide a valid 10-digit phone number"
        }
    }
};

module.exports = { userSignupSchema, userLoginSchema };