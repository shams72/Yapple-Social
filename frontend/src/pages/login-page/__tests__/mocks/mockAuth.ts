export const mockAuth = {
  isTokenValid: jest.fn().mockReturnValue(false),
  token: null
};

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockAuth
})); 