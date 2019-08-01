const userService = require('../services/User.service');

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

        const token = this.userService.sign(insertedUser.insertId);
    
        return res.status(200).json({ email: req.body.email, token, });
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

        const token = this.userService.sign(existingUser.id);

        return res.status(200).json({ token, email: req.body.email, });
    }
}

module.exports = new UserController(userService);