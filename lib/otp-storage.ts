// Simple in-memory storage for OTPs (in production, use Redis or database)
const otpStorage = new Map<string, { otp: string; timestamp: number }>()

export function storeOTP(phone: string, otp: string): void {
  otpStorage.set(phone, {
    otp,
    timestamp: Date.now(),
  })

  // Clean up expired OTPs (older than 10 minutes)
  setTimeout(
    () => {
      otpStorage.delete(phone)
    },
    10 * 60 * 1000,
  )
}

export function getOTP(phone: string): string | null {
  const stored = otpStorage.get(phone)

  if (!stored) {
    return null
  }

  // Check if OTP is expired (10 minutes)
  if (Date.now() - stored.timestamp > 10 * 60 * 1000) {
    otpStorage.delete(phone)
    return null
  }

  return stored.otp
}

export function removeOTP(phone: string): void {
  otpStorage.delete(phone)
}
