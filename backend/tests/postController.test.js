// backend/tests/postController.test.js
const postController = require('../controllers/postController');
const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

// Mock dependencies
jest.mock('../models/Post');
jest.mock('fs');

// Path helper for fs.unlink assertions
// __dirname in this test file is backend/tests
// The controller calculates path as path.join(__dirname_controller, '..', photoPath)
// which is backend/controllers/../uploads/post_photos/file.jpg -> backend/uploads/post_photos/file.jpg
const expectedBasePathForUnlink = path.resolve(__dirname, '../uploads/post_photos');

describe('Post Controller Tests', () => {
  let mockReq, mockRes, mockIo;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { userId: 'testUserId' },
      params: {},
      files: [],
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockIo = {
      emit: jest.fn(),
    };

    // Reset mocks for Post model
    Post.mockClear();
    Post.findById.mockReset();
    Post.findByIdAndDelete.mockReset();
    Post.find.mockReset();
    // Post.prototype.save needs to be on the prototype for `new Post().save()`
    // If Post is a class mock, its instances will have methods from the mock constructor's prototype
    Post.prototype.save = jest.fn();


    // Reset mocks for fs module
    fs.existsSync.mockReset();
    fs.mkdirSync.mockReset();
    fs.unlink.mockReset();

    // Default mock implementations
    fs.existsSync.mockReturnValue(true); // Assume upload directory exists
    fs.unlink.mockImplementation((path, cb) => cb(null)); // Simulate successful unlink by default

    // Default Post.prototype.save mock
    const defaultSavedPost = {
      _id: 'defaultPostId',
      content: 'Default content',
      user: 'testUserId',
      photos: [],
      populate: jest.fn().mockResolvedValueThis() // Default populate returns itself
    };
    Post.prototype.save.mockResolvedValue(defaultSavedPost);

    // Default Post.findById mock
     Post.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(defaultSavedPost) // Ensure populate is chainable and resolves
    });
  });

  describe('createPost', () => {
    it('should create a post with a single photo', async () => {
      mockReq.body.content = 'Test post with one photo';
      mockReq.files = [{ filename: 'photo1.jpg', fieldname: 'photos' }]; // fieldname is used by controller to construct path

      const expectedPhotoPath = 'uploads/post_photos/photo1.jpg';
      const savedPostWithPhoto = {
        _id: 'newPostId1',
        content: mockReq.body.content,
        user: mockReq.user.userId,
        photos: [expectedPhotoPath],
      };

      Post.prototype.save.mockResolvedValue(savedPostWithPhoto);
      Post.findById.mockReturnValue({ // Mock findById to return an object that has populate
          populate: jest.fn().mockResolvedValue({ ...savedPostWithPhoto, user: { _id: mockReq.user.userId, username: 'testuser' } })
      });

      await postController.createPost(mockReq, mockRes, mockIo);

      // Verify a new Post instance was created with the correct photo path
      // This is an indirect check via what was saved.
      // A direct check on `new Post(...)` arguments is harder without more complex mocking.
      expect(Post.prototype.save).toHaveBeenCalled();

      const emittedPost = mockIo.emit.mock.calls[0][1];
      expect(emittedPost.photos).toEqual([expectedPhotoPath]);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      const responseJson = mockRes.json.mock.calls[0][0];
      expect(responseJson.photos).toEqual([expectedPhotoPath]);
      expect(responseJson.user.username).toBe('testuser');
      expect(mockIo.emit).toHaveBeenCalledWith('new_post', expect.objectContaining({ photos: [expectedPhotoPath] }));
    });

    it('should create a post with multiple photos', async () => {
      mockReq.body.content = 'Test post with multiple photos';
      mockReq.files = [
        { filename: 'photoA.jpg', fieldname: 'photos' },
        { filename: 'photoB.png', fieldname: 'photos' },
      ];

      const expectedPhotoPaths = ['uploads/post_photos/photoA.jpg', 'uploads/post_photos/photoB.png'];
      const savedPostWithPhotos = {
        _id: 'newPostId2',
        content: mockReq.body.content,
        user: mockReq.user.userId,
        photos: expectedPhotoPaths,
      };
      Post.prototype.save.mockResolvedValue(savedPostWithPhotos);
      Post.findById.mockReturnValue({
          populate: jest.fn().mockResolvedValue({ ...savedPostWithPhotos, user: { _id: mockReq.user.userId, username: 'testuser' } })
      });

      await postController.createPost(mockReq, mockRes, mockIo);

      expect(Post.prototype.save).toHaveBeenCalled();
      const emittedPost = mockIo.emit.mock.calls[0][1];
      expect(emittedPost.photos).toEqual(expectedPhotoPaths);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      const responseJson = mockRes.json.mock.calls[0][0];
      expect(responseJson.photos).toEqual(expectedPhotoPaths);
      expect(mockIo.emit).toHaveBeenCalledWith('new_post', expect.objectContaining({ photos: expectedPhotoPaths }));
    });

    it('should create a post with no photos (text only)', async () => {
      mockReq.body.content = 'Test post with text only';
      mockReq.files = []; // No files

      const savedPostTextOnly = {
        _id: 'newPostId3',
        content: mockReq.body.content,
        user: mockReq.user.userId,
        photos: [], // Expect empty array or undefined based on model
      };
      Post.prototype.save.mockResolvedValue(savedPostTextOnly);
       Post.findById.mockReturnValue({
          populate: jest.fn().mockResolvedValue({ ...savedPostTextOnly, user: { _id: mockReq.user.userId, username: 'testuser' } })
      });

      await postController.createPost(mockReq, mockRes, mockIo);

      expect(Post.prototype.save).toHaveBeenCalled();
      const emittedPost = mockIo.emit.mock.calls[0][1];
      // photos might be undefined if not set, or empty array by default in model
      expect(emittedPost.photos || []).toEqual([]);


      expect(mockRes.status).toHaveBeenCalledWith(201);
      const responseJson = mockRes.json.mock.calls[0][0];
      expect(responseJson.photos || []).toEqual([]);
      expect(mockIo.emit).toHaveBeenCalledWith('new_post', expect.objectContaining({ photos: [] }));
    });

    it('should return 400 if content is empty and no photos are provided', async () => {
      mockReq.body.content = ' '; // Empty or whitespace content
      mockReq.files = [];

      await postController.createPost(mockReq, mockRes, mockIo);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'El contenido es requerido' });
      expect(Post.prototype.save).not.toHaveBeenCalled();
    });
  });

  describe('deletePostById', () => {
    it('should delete a post with photos and remove photos from filesystem', async () => {
      const photoPaths = ['uploads/post_photos/photoA.jpg', 'uploads/post_photos/photoB.jpg'];
      const mockPostToDelete = {
        _id: 'postIdToDelete1',
        user: 'testUserId', // Assuming this is toString() representation or direct ID
        photos: photoPaths,
      };
      Post.findById.mockResolvedValue(mockPostToDelete); // findById returns the document
      Post.findByIdAndDelete.mockResolvedValue(mockPostToDelete); // findByIdAndDelete returns the deleted doc

      mockReq.params.id = 'postIdToDelete1';

      await postController.deletePostById(mockReq, mockRes, mockIo);

      expect(Post.findById).toHaveBeenCalledWith('postIdToDelete1');
      expect(Post.findByIdAndDelete).toHaveBeenCalledWith('postIdToDelete1');
      expect(fs.unlink).toHaveBeenCalledTimes(photoPaths.length);
      expect(fs.unlink).toHaveBeenCalledWith(path.join(expectedBasePathForUnlink, 'photoA.jpg'), expect.any(Function));
      expect(fs.unlink).toHaveBeenCalledWith(path.join(expectedBasePathForUnlink, 'photoB.jpg'), expect.any(Function));
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post removed successfully' });
      expect(mockIo.emit).toHaveBeenCalledWith('post_deleted', { postId: 'postIdToDelete1' });
    });

    it('should delete a post with no photos and not call fs.unlink', async () => {
      const mockPostToDelete = {
        _id: 'postIdToDelete2',
        user: 'testUserId',
        photos: [],
      };
      Post.findById.mockResolvedValue(mockPostToDelete);
      Post.findByIdAndDelete.mockResolvedValue(mockPostToDelete);

      mockReq.params.id = 'postIdToDelete2';
      await postController.deletePostById(mockReq, mockRes, mockIo);

      expect(Post.findById).toHaveBeenCalledWith('postIdToDelete2');
      expect(Post.findByIdAndDelete).toHaveBeenCalledWith('postIdToDelete2');
      expect(fs.unlink).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post removed successfully' });
      expect(mockIo.emit).toHaveBeenCalledWith('post_deleted', { postId: 'postIdToDelete2' });
    });

    it('should return 404 if post to delete is not found', async () => {
      Post.findById.mockResolvedValue(null); // Post not found
      mockReq.params.id = 'nonExistentPostId';

      await postController.deletePostById(mockReq, mockRes, mockIo);

      expect(Post.findById).toHaveBeenCalledWith('nonExistentPostId');
      expect(Post.findByIdAndDelete).not.toHaveBeenCalled();
      expect(fs.unlink).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post not found' });
      expect(mockIo.emit).not.toHaveBeenCalled();
    });

    it('should return 401 if user is not authorized to delete the post', async () => {
      const mockPostOfOtherUser = {
        _id: 'postIdToDelete3',
        user: 'anotherUserId', // Belongs to a different user
        photos: [],
      };
      Post.findById.mockResolvedValue(mockPostOfOtherUser);
      mockReq.params.id = 'postIdToDelete3';
      // mockReq.user.userId is 'testUserId'

      await postController.deletePostById(mockReq, mockRes, mockIo);

      expect(Post.findById).toHaveBeenCalledWith('postIdToDelete3');
      expect(Post.findByIdAndDelete).not.toHaveBeenCalled();
      expect(fs.unlink).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not authorized to delete this post' });
      expect(mockIo.emit).not.toHaveBeenCalled();
    });
     it('should return 404 for delete if post ID format is invalid', async () => {
        Post.findById.mockImplementation(() => {
            const err = new Error("Invalid ID");
            err.kind = 'ObjectId';
            throw err;
        });
        mockReq.params.id = 'invalidPostIdFormat';

        await postController.deletePostById(mockReq, mockRes, mockIo);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post not found (invalid ID format)' });
    });
  });
});
