const userService = require('../services/User.service');
const { jwt } = require('../utils/index');

class UserController {
    
    constructor (userService) {
        this.userService = userService;
    }

    async registerUser (req, res) {
        console.log('register', req.body)

        const user = await this.userService.getUserByEmail(req.body.email);

        if (user) {
            return res.status(400).json({
                message: 'user already exists!',
            });
        }

        const insertedUser = await this.userService.insertUser(req.body);

        const token = jwt.createAccessToken({ id: insertedUser.insertId });

        const refreshToken = jwt.createRefreshToken();
        try {
            await jwt.storeRefreshToken(insertedUser.insertId, refreshToken);
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                message: 'An error occurred while signing up.',
            });
        }
    
        return res.status(200).json({
            email: req.body.email,
            token,
            refreshToken,
            id: insertedUser.insertId,
        });
    }

    async loginUser (req, res) {
        const existingUser = await this.userService.getUserByEmail(req.body.email);

        if (!existingUser) {
            return res.status(400).json({
                message: 'invalid email/password!',
            });
        }

        const isUserVerified = await this.userService.verifyUser(req.body.password, existingUser.password);

        if (!isUserVerified) {
            return res.status(400).json({
                message: 'invalid email/password!',
            });
        }

        const token = jwt.createAccessToken({ id: existingUser.id });
        const refreshToken = jwt.createRefreshToken();
        try {
            await jwt.storeRefreshToken(existingUser.id, refreshToken);
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                message: 'An error occurred while signing in.',
            });
        }

        return res.status(200).json({
            token,
            email: req.body.email,
            refreshToken,
            id: existingUser.id,
    });
    }
}

module.exports = new UserController(userService);