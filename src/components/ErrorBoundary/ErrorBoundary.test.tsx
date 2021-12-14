import { render, screen } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const renderProviders = (ui: React.ReactElement) => render(ui, {})
const ERROR_TEXT = "test error";
const Child = () => {
  throw new Error(ERROR_TEXT);
}

describe('Error Boundary', () => {
  it(`should render error boundary component when there is an error`, () => {
    renderProviders(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    );
    const errorMessage = screen.getByText('Что-то пошло не так...');
    expect(errorMessage).toBeDefined();
  })
})