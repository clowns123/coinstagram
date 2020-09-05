const express = require('express');
const pool = require('../config/database');

const { verifyToken } = require('./jwtMiddleware');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * add users_relationship
 * /user/relationship
 * {
 *  followee_id
 * }
 */
router.post('/user/relationship', verifyToken, async (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  const { user_id } = jwt.verify(
    token,
    // eslint-disable-next-line no-undef
    process.env.JWT_SECRET,
  );
  const { followee_id } = req.body;
  if (followee_id === user_id) {
    throw Error('나를 팔로워 할 수 없습니다.');
  }
  let sql = '';
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      sql = 'insert into users_relationship values (?, ?)';
      await connection.query(sql, [user_id, followee_id]);
      //   sql =  'select user_id, user_name from users where user_id in(select followee_id from users_relationship where id = ?);';

      res.send({ success: true });
    } catch (error) {
      await connection.rollback(); // ROLLBACK
      await connection.release();
      console.log(error);
      res.status(500).json('SQL ERROR');
    }
  } catch (error) {
    res.status(500).json('DB CONNECT ERROR');
  }
});

/**
 * delete users_relationship
 * /user/relationship
 * {
 *  followee_id
 * }
 */
router.delete('/user/relationship', verifyToken, async (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  const { user_id } = jwt.verify(
    token,
    // eslint-disable-next-line no-undef
    process.env.JWT_SECRET,
  );
  const { followee_id } = req.body;
  if (followee_id === user_id) {
    throw Error('나를 팔로우 취소 할 수 없습니다.');
  }

  let sql = '';
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      sql = 'select followee_id from users_relationship where follower_id = ?';
      const [compareFollowee] = await connection.query(sql, user_id);

      const [isFollowee] = compareFollowee.filter((followee) => {
        return +followee.followee_id === followee_id;
      });

      if (!isFollowee) {
        throw Error('해당 친구가 없습니다.');
      }

      sql =
        'delete from users_relationship where follower_id = ? and followee_id = ?';
      await connection.query(sql, [user_id, followee_id]);

      res.send({ success: true });
    } catch (error) {
      await connection.rollback(); // ROLLBACK
      await connection.release();
      console.log(error);
      res.status(500).json('SQL ERROR');
    }
  } catch (error) {
    res.status(500).json('DB CONNECT ERROR');
  }
});

/**
 * get login user
 * /user
 */
router.get('/user', verifyToken, async (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  let data = {};
  const userData = jwt.verify(
    token,
    // eslint-disable-next-line no-undef
    process.env.JWT_SECRET,
  );
  const user = userData;

  let sql = '';
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      sql = `select user_id, user_name, user_profile from users where user_id in(select followee_id from users_relationship where follower_id = ?);`;
      const [followee_id] = await connection.query(sql, user.user_id);
      const follower = followee_id.map(({ user_id }) => user_id);

      sql = `select user_id, user_name, user_profile from users where user_id in(select follower_id from users_relationship where followee_id = ?);`;
      const [follower_id] = await connection.query(sql, user.user_id);
      const folloee = follower_id.map((user_id) => user_id);

      data = { user, follower, folloee };
      console.log(data);

      res.send({ success: true });
      77;
    } catch (error) {
      await connection.rollback(); // ROLLBACK
      await connection.release();
      console.log(error);
      res.status(500).json('SQL ERROR');
    }
  } catch (error) {
    res.status(500).json('DB CONNECT ERROR');
  }
});

/**
 *  random user
 * /users/random
 */
router.get('/users/random', async (req, res) => {
  let sql = '';

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      sql = `select user_id, user_name, user_profile from users ORDER BY RAND() LIMIT 5;`;
      const [check] = await connection.query(sql);
      res.send(check);
    } catch (error) {
      await connection.rollback(); // ROLLBACK
      await connection.release();
      console.log(error);
      res.status(500).json('SQL ERROR');
    }
  } catch (error) {
    res.status(500).json('DB CONNECT ERROR');
  }
});

module.exports = router;