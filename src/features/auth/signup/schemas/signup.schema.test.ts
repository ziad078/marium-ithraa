import { describe, it, expect } from 'vitest'
import { createBeneficiaryOrganizationSchema } from './signup.schema'

describe('Signup Schema', () => {
  const t = (key: string) => key

  it('should validate a valid organization signup', () => {
    const schema = createBeneficiaryOrganizationSchema(t)
    const result = schema.safeParse({
      accountType: 'organization',
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test123!',
      phone: '+1234567890',
      organizationName: 'Test Org',
      organizationType: 'school',
    })

    expect(result.success).toBe(true)
  })

  it('should fail for invalid email', () => {
    const schema = createBeneficiaryOrganizationSchema(t)
    const result = schema.safeParse({
      accountType: 'organization',
      name: 'Test User',
      email: 'invalid-email',
      password: 'Test123!',
      phone: '+1234567890',
      organizationName: 'Test Org',
      organizationType: 'school',
    })

    expect(result.success).toBe(false)
  })

  it('should fail for weak password', () => {
    const schema = createBeneficiaryOrganizationSchema(t)
    const result = schema.safeParse({
      accountType: 'organization',
      name: 'Test User',
      email: 'test@example.com',
      password: 'weak',
      phone: '+1234567890',
      organizationName: 'Test Org',
      organizationType: 'school',
    })

    expect(result.success).toBe(false)
  })
})
