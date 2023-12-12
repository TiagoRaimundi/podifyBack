const {env} = process as { env: {[key: string]: string}}

export const {MONGO_URI, GOOGLE_USER, GOOGLE_PASS, VERIFICATION_EMAIL, PASSWORD_RESET_LINK, SIGN_IN_URL, JWT_SECRET} = env
