import { render, screen, act, fireEvent } from '@testing-library/react';
import App from './App';

/*
  [Test case conventions]
  - format: <Feature> <Scenario> <Expected Result>
  - normal test steps:
    1. arrange: render
    2. act:     user events & fetch elements
    3. assert:  compared elements with expected result
*/

/*
  [App features]
  1. show menu on the side
    1.1 menu item should have length of 3
    1.2 menu item contains text: home, fav, acc
    1.3 menu item focus
    1.4 menu is not collapsed in default
    1.5 menu can be set collapsed with the toggle button
  2. create routes to pages: home, fav, acc
    2.1 check url changes
*/

const targetMenu = [
  {name: 'Home'},
  {name: 'Favorite'},
  {name: 'Account'}
];

test('Menu-item is displayed and show text: home, fav, acc', async () => {
  render(<App />);
  const menuItemEles = await screen.findAllByRole('menuitem');
  expect(menuItemEles.length).toEqual(targetMenu.length);
  menuItemEles.forEach((e, i) => {
    expect(e).toHaveTextContent(targetMenu[i].name);
  });
});

test('Menu-item which is focused should have the focus attribute', async () => {
  render(<App />);
  const menuItemEles = await screen.findAllByRole('menuitem');
  menuItemEles.forEach((e) => {
    act(() => e.focus());
    expect(e).toHaveFocus();
  });
});

test('Toggle-button onclick can set the collapsed attribute of the sider', async () => {
  render(<App />);
  const buttonEle = await screen.findByTestId('button');
  const siderEle = await screen.findByTestId('sider');
  // default: not collapsed
  expect(siderEle).not.toHaveAttribute('class', expect.stringContaining('collapsed'));
  // first click: collapsed
  fireEvent.click(buttonEle);
  expect(siderEle).toHaveAttribute('class', expect.stringContaining('collapsed'));
  // second click: not collapsed
  fireEvent.click(buttonEle);
  expect(siderEle).not.toHaveAttribute('class', expect.stringContaining('collapsed'));
});

test('Sider is collapsed and not showing any text', async () => {
  render(<App />);
  const buttonEle = await screen.findByTestId('button');
  // hide menu
  fireEvent.click(buttonEle);
  targetMenu.forEach((e) => {
    const q = screen.queryByText(e.name);
    expect(q).not.toBeVisible();
  });
});
