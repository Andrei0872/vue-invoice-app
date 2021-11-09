const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const key = require('../key');
const redisClient = require('../redis/client');

// In seconds.
const EXPIRY_TIME = 3 * 24 * 60 * 60;

const createRefreshToken = () => randToken.generate(16);

const storeRefreshToken = (userId, token) => redisClient.set(userId, token, 'EX', EXPIRY_TIME);

const verifyRefreshToken = async (userId, tokenToVerify) => {
  const expectedToken = await redisClient.get(userId);
  if (!expectedToken) {
    throw new Error('The refresh token does not exist.');
  }

  if (expectedToken !== tokenToVerify) {
    throw new Error('The provided token and the stored one do not match.');
  }
};

const revokeRefreshToken = userId => redisClient.del(userId);

const createAccessToken = payload => jwt.sign(payload, key.tokenKey, { algorithm: 'HS256', expiresIn: '2h' });

const exchangeRefreshToken = async (req, res) => {
  const commonErrorMessage = 'An error occurred while exchanging the refresh token.';

  const existingRefreshToken = req.headers['x-refresh-token'];
  const userId = req.body.id;

  try {
    await verifyRefreshToken(userId, existingRefreshToken);
  } catch (err) {
    console.log(err);

    revokeRefreshToken(userId);

    return res.status(401).json({
      message: commonErrorMessage,
    });
  }

  const refreshToken = createRefreshToken();
  try {
    await storeRefreshToken(userId, refreshToken);
  } catch (err) {
    console.log(err);

    revokeRefreshToken(userId);

    return res.status(500).json({
      message: commonErrorMessage,
    });
  }

  const token = createAccessToken({ id: userId });
  return res.status(200).json({
    token,
    refreshToken,
    id: userId,
  });
};

module.exports = {
  createRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  createAccessToken,
  exchangeRefreshToken,
};