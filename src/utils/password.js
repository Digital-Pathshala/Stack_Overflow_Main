import bcrypt from "bcryptjs"

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password, salt)
}

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

export const validatePasswordStrength = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const errors = []

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`)
  }
  if (!hasUpperCase) {
    errors.push("Password must contain at least one uppercase letter")
  }
  if (!hasLowerCase) {
    errors.push("Password must contain at least one lowercase letter")
  }
  if (!hasNumbers) {
    errors.push("Password must contain at least one number")
  }
  if (!hasSpecialChar) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}