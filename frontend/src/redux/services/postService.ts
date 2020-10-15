import axios from 'axios';
import { CountState, EachPostState } from '../../type';

const baseUrl = '/post';

interface IPostService {
  getRandomPosts: (token: string | null, count: number) => Promise<EachPostState[]>;
  getFollowersPosts: (token: string | null) => Promise<EachPostState[]>;
  getUserPosts: (token: string | null, user_id: string) => Promise<EachPostState[]>;
  getSelectedPost: (token: string | null, post_id: number) => Promise<EachPostState>;
  getSpecificPost: (token: null | string, post_id: number) => Promise<EachPostState>;
  deletePost: (token: string | null, post_id: number) => void;
  getCountPost: (token: string | null, post_id: number) => Promise<CountState>;
  changePost: (token: string | null, post_id: number, post_context: string, post_image: Array<string> | null) => void;
}

const PostService: IPostService = class {

  static async getRandomPosts(token: string | null, count: number) {
    const res = await axios.get<EachPostState[]>(`/api${baseUrl}s/${count}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('getRandomPosts', res.data);
    return res.data;
  }

  static async getFollowersPosts(token: string | null) {
    const res = await axios.get<EachPostState[]>(`/api/user/relationship${baseUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('getFollowersPosts', res.data);
    return res.data;
  }

  static async getUserPosts(token: string | null, user_id: string) {
    const res = await axios.get<EachPostState[]>(`/api/user${baseUrl}/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('getUserPosts', res.data);
    return res.data;
  }

  static async getSelectedPost(token: string | null, post_id: number) {
    const res = await axios.get<EachPostState>(`/api${baseUrl}/${post_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('getSelectedPost', res.data);
    return res.data;
  }

  static async getSpecificPost(token: null | string, post_id: number) {
    const res = await axios.get<EachPostState>(`/api${baseUrl}/${post_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }

  static async deletePost(token: string | null, post_id: number) {
    await axios.delete(`/api${baseUrl}/${post_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static async getCountPost(token: string | null, post_id: number) {
    const res = await axios.get<CountState>(`/api${baseUrl}/count/${post_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }

  static async changePost(token: string | null, post_id: number, post_context: string, post_image: Array<string> | null) {
    console.log(post_image);

    const res = await axios.put(
      `/api/post/chagne/${post_id}`,
      {
        post_context,
        post_image,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res;
  }
};

export default PostService;
