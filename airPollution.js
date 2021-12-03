const Airly = require('airly');

const airly = new Airly('GF7Xo6OiN4Dys54NGYuhS18VQb1qIvtG');

(async () => {
    try {
        const data = await airly.installationInfo(240);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
})();