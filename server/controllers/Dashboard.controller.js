const mainController = require('./index');

class DashboardController extends mainController {
    constructor (...args) {
        super(...args);
    }

    async getMainOverview (req, res) {
        const responseFromDB = await this.service.getMainOverview();

        return res.json(responseFromDB)
    }
}

module.exports = DashboardController