import { render, screen, act, fireEvent } from '@testing-library/react';
import Auth, { LoginForm, RegisterForm, CMForm } from './Login';
import * as utils from '../utils';

afterEach(() => {
  jest.resetAllMocks();
});

describe('Auth', () => {
  beforeEach(() => {
    render(<Auth setToken={jest.fn()}/>);
  });

  describe('in the initial', () => {
    test('should render the login form', () => {
      expect(screen.getByRole('button', { name: 'Login' })).toBeTruthy();
    });
  });
  
  describe('click the register button', () => {
    beforeEach(() => {
      const openBtn = screen.getByRole('button', {name: 'Create Account'});
      fireEvent.click(openBtn);
    });

    test('should render the registration form modal', async () => {
      expect(await screen.findByRole('button', {name: 'Register'})).toBeTruthy();
    });

    test('click the close button should close the modal', async () => {
      const closeBtn = await screen.findByRole('button', {name: 'Close'});
      fireEvent.click(closeBtn);
      expect(await screen.queryByRole('button', {name: 'Register'})).toBeNull();
    });
  });
});

describe('Form', () => {
  let BtnEle;
  beforeEach(() => {
    render(<CMForm formName="Test" onFinish={jest.fn()}/>);
    BtnEle = screen.getByRole('button', { name: 'Test' });
  });

  describe('submit with empty fields', () => {
    test('should show required messages', async () => {
      fireEvent.submit(BtnEle);
      expect(await screen.findByText('Please input your username!')).toBeVisible();
      expect(await screen.findByText('Please input your password!')).toBeVisible();
    });

    test('should not fetch api', async () => {
      jest
        .spyOn(utils, 'fetchUnAuth');
      await act(async () => {
        fireEvent.submit(BtnEle)
      });
      expect(utils.fetchUnAuth).not.toHaveBeenCalled();
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
    });
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
  });
});

describe('Registration form', () => {
  let regBtn, usernameInput, passwordInput;
  beforeEach(() => {
    render(<RegisterForm open={true} hideModal={jest.fn()}/>);
    regBtn = screen.getByRole('button', { name: 'Register' });
    usernameInput = screen.getByLabelText(/username/i);
    passwordInput = screen.getByLabelText(/password/i);
  });

  describe('submit with valid username and password', () => {
    test('should show success message', async () => {
      jest
        .spyOn(utils, 'fetchUnAuth')
        .mockResolvedValueOnce(Promise.resolve([]));
  
      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: '12345678' } });
        fireEvent.submit(regBtn);
      })

      expect(utils.fetchUnAuth).toHaveBeenCalledTimes(1);
      expect(await screen.findByText('Success!'));
    })
  });

  describe('submit with invalid username and password', () => {
    test('should show error message', async () => {
      jest
        .spyOn(utils, 'fetchUnAuth')
        .mockRejectedValueOnce(Error('test: invalid registeration'));
  
      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: '00000000' } });
        fireEvent.submit(regBtn);
      })

      expect(utils.fetchUnAuth).toHaveBeenCalledTimes(1);
      expect(await screen.findByText('Failed to register!'));
    });
  });
});