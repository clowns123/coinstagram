import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookmarksSaga } from '../redux/modules/bookmark';
import { getPostComments } from '../redux/modules/comment';
import { getPostLikesSaga } from '../redux/modules/like';
import { getFeedPostsSaga, getRandomPostsSaga } from '../redux/modules/post';
import { getUserInfoSaga } from '../redux/modules/userInfo';
import RootState from '../type';

function useInit() {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.userInfo);
  const { followers } = useSelector((state: RootState) => state.userInfo);
  const { feedPosts } = useSelector((state: RootState) => state.posts.feedPosts);
  const userId = user && user.user_id;
  const followersInfo = followers.users;

  useEffect(() => {
    if (token === null) return;
    dispatch(getUserInfoSaga());
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(getFeedPostsSaga(userId));
  }, [dispatch, userId, followersInfo]);

  useEffect(() => {
    dispatch(getBookmarksSaga(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    feedPosts.forEach(post => dispatch(getPostLikesSaga(post.id)));
    feedPosts.forEach(post => dispatch(getPostComments(post.id)));
  }, [dispatch, feedPosts]);

  useEffect(() => {
    dispatch(getRandomPostsSaga());
  }, [dispatch]);
}

export default useInit;
