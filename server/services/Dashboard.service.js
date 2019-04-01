const mainService = require('./index');

class DashboardService extends mainService {
    constructor (name) {
        super(name);
    }

    async getMainOverview () {
        return (await this.db._promisify(
            'call get_main_overview()'
        ))[0];
    }   
}

module.exports = DashboardService