import { validationShemaSignIn, validationShemaSignUp } from '../helper/ValidationObjects';

// test suite for form validation rules
describe('Validation Schemas', () => {
  describe('Sign In Schema', () => {
    // test that valid username and password pass validation
    it('accepts valid username and password', async () => {
      const validInput = {
        username: 'testuser',
        password: 'password123',
      };
      
      await expect(validationShemaSignIn.validate(validInput)).resolves.toBeTruthy();
    });

    it('rejects empty username field', async () => {
      const invalidInput = {
        username: '',
        password: 'password123',
      };
      
      await expect(validationShemaSignIn.validate(invalidInput)).rejects.toThrow('Required');
    });

    it('rejects password shorter than 6 characters', async () => {
      const invalidInput = {
        username: 'testuser',
        password: '12345',
      };
      
      await expect(validationShemaSignIn.validate(invalidInput)).rejects.toThrow('Must be 6 characters or more');
    });
  });

  describe('Sign Up Schema', () => {
    // test that valid registration info passes validation
    it('accepts valid registration info', async () => {
      const validInput = {
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User',
      };
      
      await expect(validationShemaSignUp.validate(validInput)).resolves.toBeTruthy();
    });

    it('rejects display name shorter than 4 characters', async () => {
      const invalidInput = {
        username: 'testuser',
        password: 'password123',
        displayName: 'Ted',
      };
      
      await expect(validationShemaSignUp.validate(invalidInput)).rejects.toThrow('Must be 4 characters or more');
    });
  });
}); 