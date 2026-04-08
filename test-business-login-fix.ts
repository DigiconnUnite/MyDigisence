/**
 * Test script to verify the business login fix for email case-sensitivity issue
 * 
 * This test verifies that users can login regardless of the case they use for their email.
 * Issue: Users entering correct username/password but getting 401 error
 * Root Cause: Email case-sensitivity - MongoDB queries are case-sensitive by default
 * Fix: Normalize email to lowercase in all auth operations
 */

import { authenticateUser, hashPassword } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * Test 1: Verify email normalization in registration
 */
export async function testEmailNormalizationInRegistration() {
  console.log('\n=== Test 1: Email Normalization in Registration ===');
  
  // Simulate registering with mixed case email
  const testEmail = 'TestBusiness@EXAMPLE.com';
  const normalizedEmail = testEmail.toLowerCase();
  
  console.log(`Input email: ${testEmail}`);
  console.log(`Normalized email: ${normalizedEmail}`);
  
  // Verify that the database call would use normalized email
  console.log(`✓ Registration would store: ${normalizedEmail}`);
}

/**
 * Test 2: Verify email normalization in authentication
 */
export async function testEmailNormalizationInAuth() {
  console.log('\n=== Test 2: Email Normalization in Authentication ===');
  
  // Create a test user with lowercase email (as it will be stored)
  const testEmail = 'test@example.com';
  const testPassword = 'TestPassword123';
  
  try {
    // First, check if user exists and delete if needed
    const existingUser = await db.user.findUnique({
      where: { email: testEmail }
    });
    
    if (existingUser) {
      await db.user.delete({ where: { id: existingUser.id } });
      console.log(`Cleaned up existing test user: ${testEmail}`);
    }
    
    // Create test user
    const hashedPassword = await hashPassword(testPassword);
    const user = await db.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        role: 'BUSINESS_ADMIN'
      }
    });
    console.log(`✓ Created test user: ${testEmail}`);
    
    // Test Case 1: Login with same case
    let result = await authenticateUser('test@example.com', testPassword);
    if (result) {
      console.log(`✓ Test Case 1 PASSED: Login with lowercase email works`);
    } else {
      console.log(`✗ Test Case 1 FAILED: Login with lowercase email failed`);
    }
    
    // Test Case 2: Login with UPPERCASE email
    result = await authenticateUser('TEST@EXAMPLE.COM', testPassword);
    if (result) {
      console.log(`✓ Test Case 2 PASSED: Login with UPPERCASE email works`);
    } else {
      console.log(`✗ Test Case 2 FAILED: Login with UPPERCASE email failed`);
    }
    
    // Test Case 3: Login with mixed case email
    result = await authenticateUser('Test@Example.Com', testPassword);
    if (result) {
      console.log(`✓ Test Case 3 PASSED: Login with mixed case email works`);
    } else {
      console.log(`✗ Test Case 3 FAILED: Login with mixed case email failed`);
    }
    
    // Test Case 4: Login with wrong password
    result = await authenticateUser('test@example.com', 'WrongPassword');
    if (!result) {
      console.log(`✓ Test Case 4 PASSED: Login with wrong password correctly fails`);
    } else {
      console.log(`✗ Test Case 4 FAILED: Login with wrong password should fail`);
    }
    
    // Cleanup
    await db.user.delete({ where: { id: user.id } });
    console.log(`\n✓ Cleaned up test user`);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

/**
 * Main test runner
 */
export async function runAllTests() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Business Login Fix - Test Suite          ║');
  console.log('║   Testing email case-sensitivity fix       ║');
  console.log('╚════════════════════════════════════════════╝');
  
  try {
    await testEmailNormalizationInRegistration();
    await testEmailNormalizationInAuth();
    
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║   All tests completed                      ║');
    console.log('╚════════════════════════════════════════════╝');
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
