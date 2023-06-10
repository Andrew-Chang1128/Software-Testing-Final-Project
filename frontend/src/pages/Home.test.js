import { render, screen, act, fireEvent } from '@testing-library/react';
import Home from './Home';
import { fetchGet } from '../utils';

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
    test('should fetch the all api', async () => {
      expect(window.fetch).toHaveBeenCalledTimes(1); 
    });
  });

  describe('with empty input', () => {
    test('should display placeholder message', async () => {
      expect(await screen.findByPlaceholderText('Search by product name.')).toBeVisible();
    });
  });

  describe('with user input', () => {
    test('should display a clear button', async () => {
      const inputEle = (await screen.findByTestId('search')).querySelector('input')
      await act(async () => {
        fireEvent.change(inputEle, {target: {value: 'search test'}});
      });
      await act(async () => {
        fireEvent.submit(inputEle);
      });
      const clearEle = (await screen.findByRole('button', {name: 'close-circle'}));
      expect(clearEle).toBeVisible();
    });
    
    test('should fetch the search api', async () => {
      const inputEle = (await screen.findByTestId('search')).querySelector('input')
      await act(async () => {
        fireEvent.change(inputEle, {target: {value: 'search test'}});
      });
      await act(async () => {
        fireEvent.submit(inputEle);
      });
      expect(window.fetch).toHaveBeenCalledTimes(2);
    });
  });
});

// integration test on the search content in Home
describe('Search content', () => {
  const fakeData = {
    key: '0',
    id: '12345',
    tw_name: 'test tw_name',
    jp_name: 'test jp_name',
    tw_price: 'test tw_price',
    jp_price: 'test jp_price',
    tw_url: 'test tw_url',
    jp_url: 'test jp_url'
  };
  

  beforeEach(() => {
    render(<Home />);
  });

  test('should display the columns of the list', async () => {
    const colNames = ['Product ID', 'TW Name', 'JP Name', 'TW Price', 'JP Price'];
    colNames.forEach(async (c) => {
      expect(await screen.findByText(c)).toBeVisible();
    });
  });

  describe('in the initial render', () => {
    test('should display all item', async() => {
      expect(await screen.findByText('No data')).toBeVisible();      
    });
  });

  describe('when search box is non-empty', () => {
    test('should display the fetched result', async () => {
      const inputEle = (await screen.findByTestId('search')).querySelector('input')
      window.fetch.mockResolvedValue({
        status: 200,
        json: async () => (fakeData)
      });
      await act(async () => {
        fireEvent.change(inputEle, {target: {value: fakeData.tw_name}});
      });
      await act(async () => {
        fireEvent.submit(inputEle);
      });
      expect(await screen.findByRole('link', {name: fakeData.tw_name})).toBeInTheDocument();
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
        fireEvent.change(inputEle, {target: {value: 'test'}});
      });
      await act(async () => {
        fireEvent.submit(inputEle);
      });  
      window.fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ([])
      });
      await act(async () => {
        fireEvent.change(inputEle, {target: {value: ''}});
      });
      await act(async () => {
        fireEvent.submit(inputEle);
      });  
      expect(await screen.findByText('No data')).toBeVisible();      
    });
  });
})
