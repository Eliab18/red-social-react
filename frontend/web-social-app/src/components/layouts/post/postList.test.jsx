// frontend/web-social-app/src/components/layouts/post/postList.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector, useDispatch } from 'react-redux';
import PostList from './postList';

// Mock react-redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock PostOptionsMenu as it's a child component and not the focus of these tests
jest.mock('./PostOptionsMenu', () => () => <div data-testid="post-options-menu-mock"></div>);


describe('PostList Component', () => {
  let mockDispatch;
  const baseMockAuthState = { user: { _id: 'testUserId' }, token: 'fakeToken' };

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    // Default useSelector mock, can be overridden in tests
    useSelector.mockImplementation(callback => callback({
      posts: { posts: [], status: 'idle', error: null },
      auth: baseMockAuthState,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders posts with photos and correct image URLs', () => {
    const mockPosts = [
      { _id: '1', content: 'Post 1', user: { username: 'User1' }, createdAt: new Date().toISOString(), photos: ['uploads/post_photos/photo1.jpg'], likes: [] },
      { _id: '2', content: 'Post 2', user: { username: 'User2' }, createdAt: new Date().toISOString(), photos: ['uploads/post_photos/photo2.png', 'uploads/post_photos/photo3.jpeg'], likes: [] },
    ];
    useSelector.mockImplementation(callback => callback({
      posts: { posts: mockPosts, status: 'succeeded', error: null },
      auth: baseMockAuthState,
    }));

    render(<PostList />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3); // 1 from post1, 2 from post2

    expect(images[0]).toHaveAttribute('src', 'http://localhost:5000/uploads/post_photos/photo1.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Post photo 1');
    expect(images[1]).toHaveAttribute('src', 'http://localhost:5000/uploads/post_photos/photo2.png');
    expect(images[1]).toHaveAttribute('alt', 'Post photo 2');
    expect(images[2]).toHaveAttribute('src', 'http://localhost:5000/uploads/post_photos/photo3.jpeg');
    expect(images[2]).toHaveAttribute('alt', 'Post photo 3');
  });

  it('renders posts without photos correctly', () => {
    const mockPosts = [
      { _id: '1', content: 'Post 1 no photo', user: { username: 'User1' }, createdAt: new Date().toISOString(), photos: [], likes: [] },
      { _id: '2', content: 'Post 2 no photo', user: { username: 'User2' }, createdAt: new Date().toISOString(), likes: [] }, // no photos array
    ];
    useSelector.mockImplementation(callback => callback({
      posts: { posts: mockPosts, status: 'succeeded', error: null },
      auth: baseMockAuthState,
    }));

    render(<PostList />);
    const images = screen.queryAllByAltText(/Post photo \d+/i);
    expect(images).toHaveLength(0);
  });

  it('handles loading state', () => {
    useSelector.mockImplementation(callback => callback({
      posts: { posts: [], status: 'loading', error: null },
      auth: baseMockAuthState,
    }));
    render(<PostList />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // Assuming loading indicator has role="status" or similar accessible role
  });

  it('handles error state', () => {
    useSelector.mockImplementation(callback => callback({
      posts: { posts: [], status: 'failed', error: 'Failed to fetch posts' },
      auth: baseMockAuthState,
    }));
    render(<PostList />);
    expect(screen.getByText(/Error: Failed to fetch posts/i)).toBeInTheDocument();
  });

  it('handles no posts available', () => {
    useSelector.mockImplementation(callback => callback({
      posts: { posts: [], status: 'succeeded', error: null },
      auth: baseMockAuthState,
    }));
    render(<PostList />);
    expect(screen.getByText(/No hay publicaciones aún/i)).toBeInTheDocument();
  });
   it('calls fetchPosts on mount if token is present', () => {
    render(<PostList />);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    // You might want to check what action was dispatched if you have multiple thunks
    // For now, just checking if dispatch was called due to useEffect.
  });
});
