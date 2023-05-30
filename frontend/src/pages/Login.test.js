import { render, screen, act, fireEvent } from '@testing-library/react';
import Auth, { LoginForm } from './Login';
import * as utils from '../utils';

afterEach(() => {
  jest.resetAllMocks();
});

describe('Auth', () => {
  describe('in the initial', () => {
    test('should render the login form', () => {
      render(<Auth setToken={jest.fn()}/>);
      expect(screen.getByRole('button', { name: 'Login' })).toBeTruthy();
    });
  });
});

describe('Login form', () => {
  let mockSetToken;
  let loginBtn, usernameInput, passwordInput;
  beforeEach(() => {
    mockSetToken = jest.fn()
    render(<LoginForm setToken={mockSetToken}/>);
    loginBtn = screen.getByRole('button', { name: 'Login' });
    usernameInput = screen.getByLabelText(/username/i);
    passwordInput = screen.getByLabelText(/password/i);
  });

  describe('submit with empty fields', () => {
    test('should show required messages', async () => {
      fireEvent.submit(loginBtn);
      expect(await screen.findByText('Please input your username!')).toBeVisible();
      expect(await screen.findByText('Please input your password!')).toBeVisible();
    });

    test('should not fetch login api', async () => {
      jest
        .spyOn(utils, 'fetchUnAuth');
      await act(async () => {
        fireEvent.submit(loginBtn)
      });
      expect(utils.fetchUnAuth).not.toHaveBeenCalled();
    });
  });
  
  describe('submit with valid username and password', () => {
    test('should set token', async () => {
      jest
        .spyOn(utils, 'fetchUnAuth')
        .mockResolvedValueOnce(Promise.resolve('testtoken'));
  
      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: '12345678' } });
        fireEvent.submit(loginBtn);
      })

      expect(utils.fetchUnAuth).toHaveBeenCalledTimes(1);
      expect(mockSetToken).toHaveBeenCalledWith('testtoken');
    })
  });

  describe('submit with invalid username or password', () => {
    test('should show error message', async () => {
      jest
        .spyOn(utils, 'fetchUnAuth')
        .mockRejectedValueOnce(Error('test: invalid login')); 
      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: '00000000' } });
        fireEvent.submit(loginBtn);
      });
      expect(utils.fetchUnAuth).toHaveBeenCalledTimes(1);
      expect(await screen.findByText('Failed to login!'));
    });
  })
});

