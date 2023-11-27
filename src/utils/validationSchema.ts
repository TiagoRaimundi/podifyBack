import * as yup from 'yup'

export const CreateUserSchema = yup.object().shape({
    name: yup.string().trim().required("Name is missing!").min(3, "Name is too short!").max(20, "Name is too long!"),
    email: yup.string().required("Email is missing!").email("Invalid email id!"),    
    password: yup.string().trim().required("Password is missing"!).min(8, "Password is too short!").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "Password is too simple!")
})

CreateUserSchema.validate()