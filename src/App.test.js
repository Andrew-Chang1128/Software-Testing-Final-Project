import { render, screen, act, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history'
import { MemoryRouter, Router } from 'react-router-dom';
import React from 'react';
import App, { AppAuth } from './App';

const targetMenu = [
  {name: 'Home', link: '/'},
  {name: 'Favorite', link: '/favorite'},
  {name: 'Account', link: '/account'}
];

test('Menu-item is displayed and show text: home, fav, acc', async () => {
  render(
    <MemoryRouter>
      <AppAuth />
    </MemoryRouter>
  );
  const menuItemEles = await screen.findAllByRole('menuitem');
  expect(menuItemEles.length).toEqual(targetMenu.length);
  menuItemEles.forEach((e, i) => {
    expect(e).toHaveTextContent(targetMenu[i].name);
  });
});

test('Menu-item which is focused should have the focus attribute', async () => {
  render(
    <MemoryRouter>
      <AppAuth />
    </MemoryRouter>
  );
  const menuItemEles = await screen.findAllByRole('menuitem');
  menuItemEles.forEach((e) => {
    act(() => e.focus());
    expect(e).toHaveFocus();
  });
});

test('Toggle-button onclick can set the collapsed attribute of the sider', async () => {
  render(
    <MemoryRouter>
      <AppAuth />
    </MemoryRouter>
  );
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
  render(
    <MemoryRouter>
      <AppAuth />
    </MemoryRouter>
  );
  const buttonEle = await screen.findByTestId('button');
  // hide menu
  fireEvent.click(buttonEle);
  targetMenu.forEach((e) => {
    const q = screen.queryByText(e.name);
    expect(q).not.toBeVisible();
  });
});

test('Menu-item onclick can navigate to the corresponding page', async () => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  render(
    <Router navigator={history} location={history.location}>
      <AppAuth />
    </Router>
  );
  const menuItemEles = await screen.findAllByRole('menuitem');
  expect(history.location.pathname).toBe('/');

  menuItemEles.forEach((e, i) => {
    fireEvent.click(e);
    expect(history.location.pathname).toBe(targetMenu[i].link);
  });
});

test('Navigate to the previous page shows the correct path', async () => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  render(
    <Router navigator={history} location={history.location}>
      <AppAuth />
    </Router>
  );
  const menuItemEles = await screen.findAllByRole('menuitem');
  fireEvent.click(menuItemEles[0]);
  history.go(-1);
  expect(history.location.pathname).toBe('/');
});
