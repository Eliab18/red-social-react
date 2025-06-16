// frontend/web-social-app/src/components/inputPost/createPost.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector, useDispatch } from 'react-redux';
import CreatePost from './createPost'; // Adjust path as necessary

// Mock react-redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('CreatePost Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    // Default useSelector mock, can be overridden in tests
    useSelector.mockImplementation(callback => callback({
      posts: { status: 'idle' }, // For submit button status
      // auth: { token: 'fakeToken' } // If CreatePost uses token directly
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a file input for photo uploads', () => {
    render(<CreatePost />);
    // The input itself might not have a visible label text for screen.getByLabelText if label is visual only
    // Try to find by a more robust query if getByLabelText fails.
    // The component has <label htmlFor="fileInput" ...>Añadir fotos (hasta 5):</label>
    // and <input id="fileInput" ... />
    const fileInput = screen.getByLabelText(/Añadir fotos \(hasta 5\):/i);

    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('multiple');
    expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  it('submit button is disabled if text and photos are empty', () => {
    render(<CreatePost />);
    const submitButton = screen.getByRole('button', { name: /Publicar/i });
    expect(submitButton).toBeDisabled();
  });

  // Further tests could be added for:
  // - Typing text enables the button
  // - Selecting a file enables the button
  // - Clicking submit dispatches createPost with FormData (requires more complex async thunk mocking & user-event)
});
