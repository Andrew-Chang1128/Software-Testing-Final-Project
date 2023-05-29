import { render, screen, act, fireEvent } from '@testing-library/react';
import Home from './Home';

// mock fetch
beforeEach(() => {
  jest
    .spyOn(window, 'fetch')
    .mockImplementation(() =>
      Promise.resolve({ json: () => Promise.resolve([]) })
  );
});

// reset mocks
afterEach(() => {
  jest.resetAllMocks();
});

// integration test on the search form in Home
describe('Search form', () => {
  beforeEach(() => {
    render(<Home />);
  });

  describe('in the initial render', () => {
    test('should not fetch the search api', () => {
      expect(window.fetch).toHaveBeenCalledTimes(0);  
    });
  });

  describe('with empty input', () => {
    test('should display placeholder message', async () => {
      expect(await screen.findByPlaceholderText('Search by keyword or product ID.')).toBeVisible();
    });
  });

  describe('with user input', () => {
    test('should display a clear button', async () => {
      const inputEle = (await screen.findByTestId('search')).querySelector('input')
      await act(async () => {
        fireEvent.change(inputEle, {target: {value: 'search test'}});
      });
      const clearEle = (await screen.findByRole('img', {name: 'close-circle'}));
      expect(clearEle).toBeVisible();
    });
    
    test('should fetch the search api', async () => {
      const inputEle = (await screen.findByTestId('search')).querySelector('input')
      await act(async () => {
        fireEvent.change(inputEle, {target: {value: 'search test'}});
      });
      expect(window.fetch).toHaveBeenCalledTimes(1);
    });
  });
});

// integration test on the search content in Home
describe('Search content', () => {
  const fakeData = [
    { name: 'product test A', key: '0' },
    { name: 'product test B', key: '1' }
  ]

  beforeEach(() => {
    render(<Home />);
  });

  test('should display the columns of the list', async () => {
    const colNames = ['Name', 'Product ID', 'TW price', 'JP price', 'URL'];
    colNames.forEach(async (c) => {
      expect(await screen.findByText(c)).toBeVisible();
    });
  });

  describe('in the initial render', () => {
    test('should display empty message', async() => {
      expect(await screen.findByText('No data')).toBeVisible();      
    });
  });

  describe('when search box is non-empty', () => {
    test('should display the fetched result', async () => {
      const inputEle = (await screen.findByTestId('search')).querySelector('input')
      window.fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => (fakeData)
      });
      await act(async () => {
        fireEvent.change(inputEle, {target: {value: 'product test'}});
      });
      expect(await screen.findByText(fakeData[0].name)).toBeVisible();      
      expect(await screen.findByText(fakeData[1].name)).toBeVisible();      
    });
  });

  describe('when search box is cleared or empty', () => {
    test('should display empty message', async () => {
      const inputEle = (await screen.findByTestId('search')).querySelector('input')
      window.fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => (fakeData)
      });
      await act(async () => {
        fireEvent.change(inputEle, {target: {value: 'product test'}});
      });
      window.fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ([])
      });
      await act(async () => {
        fireEvent.change(inputEle, {target: {value: ''}});
      });
      expect(await screen.findByText('No data')).toBeVisible();      
    });
  });
})
