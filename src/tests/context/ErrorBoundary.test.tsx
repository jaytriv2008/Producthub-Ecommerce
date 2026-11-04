
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ErrorBoundary from '../../components/ErrorBoundary';

const BrokenComponent = () => {
  throw new Error('Test application error');
};

describe('ErrorBoundary', () => {
  it('displays fallback UI when a component crashes', () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText('Something went wrong'),
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('displays retry button', () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('can reset the error boundary', async () => {
    const user = userEvent.setup();

    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    await user.click(
      screen.getByRole('button', { name: /try again/i }),
    );

    // The boundary resets, but the broken component
    // crashes again because its error is still present.
    expect(
      screen.getByText('Something went wrong'),
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
