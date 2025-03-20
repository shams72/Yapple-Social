import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import { Login } from '../login.page';
import { BrowserRouter } from 'react-router-dom';
import { WebSocketContext, toastContext } from '../../../store';
import userEvent from '@testing-library/user-event';

// Mock the App module
jest.mock('../../../App', () => ({
  API_URL: '/api',
  WEB_SOCKET_URL: 'ws://localhost:3000'
}));

// Mock the community context module
jest.mock('../../../context/communityContext', () => ({
  CommunityContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children
  }
}));

// Mock the useAuth hook
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    isTokenValid: jest.fn().mockReturnValue(false),
    token: null
  })
}));

// Mock the contexts
const mockWebSocket = {
  websocket: {
    sendJsonMessage: jest.fn(),
    sendMessage: jest.fn(),
    lastMessage: null,
    lastJsonMessage: null,
    readyState: 1,
    getWebSocket: jest.fn(),
  },
};

const mockToast = {
  setOpen: jest.fn(),
  open: false,
  alertColor: 'success' as const,
  message: '',
};

const MockProviders = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <WebSocketContext.Provider value={mockWebSocket}>
      <toastContext.Provider value={mockToast}>
        {children}
      </toastContext.Provider>
    </WebSocketContext.Provider>
  </BrowserRouter>
);

jest.mock('../login.module.css', () => ({
  container: 'container',
  'right-panel-active': 'right-panel-active',
  'form-container': 'form-container',
  'sign-up-container': 'sign-up-container',
  'sign-in-container': 'sign-in-container',
  titleAuthMode: 'titleAuthMode',
  inputField: 'inputField',
  ghost: 'ghost',
  'overlay-container': 'overlay-container',
  overlay: 'overlay',
  'overlay-panel': 'overlay-panel',
  'overlay-left': 'overlay-left',
  'overlay-right': 'overlay-right'
}));

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getSubmitButton = () => {
    const signInContainer = screen.getByTestId('sign-in-container');
    return within(signInContainer).getByRole('button', { name: /submit|sign in/i });
  };

  it('renders sign in form by default', () => {
    render(
      <MockProviders>
        <Login />
      </MockProviders>
    );
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  });

  it('switches to sign up form when clicking Sign Up button', async () => {
    render(
      <MockProviders>
        <Login />
      </MockProviders>
    );

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    await act(async () => {
      fireEvent.click(signUpButton);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter display name')).toBeInTheDocument();
    });
  });

  it('shows validation errors when submitting empty form', async () => {
    render(
      <MockProviders>
        <Login />
      </MockProviders>
    );

    const submitButton = getSubmitButton();
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getAllByText('Required')).toHaveLength(2);
    });
  });

  it('validates password length', async () => {
    render(
      <MockProviders>
        <Login />
      </MockProviders>
    );

    const passwordInput = screen.getByPlaceholderText('Enter password');
    await act(async () => {
      await userEvent.type(passwordInput, '12345');
    });

    const submitButton = getSubmitButton();
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Must be 6 characters or more')).toBeInTheDocument();
    });
  });
}); 