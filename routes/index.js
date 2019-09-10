const vinbazar = require("./vinbazar").default;
const mywincomua = require("./mywincomua").default;

const routers = {
    "vinbazar.com": vinbazar,
    "www.myvin.com.ua": mywincomua,
}

exports.default = routers;