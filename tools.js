const Apify = require('apify');
const routes = require('./routes').default;
const { getDomainName } = require("./utils");
const {
    utils: { log },
} = Apify;

const INPUT = [
    "https://vinbazar.com/news/all/",
    "https://www.myvin.com.ua/news/all"
]

exports.getSources = async () => {
    log.debug('Getting sources.');
    const input = INPUT;//await Apify.getInput();
    return input.map(url => ({
        url: `${url}`,
        userData: {
            label: 'MAIN',
            state: 'INITIAL'
        },
    }));
};

exports.createRouter = globalContext => {
    return async function(routeName, requestContext) {
        const domainName = getDomainName(requestContext.request.loadedUrl);
        const route = routes[domainName][routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route for ${domainName}: ${routeName}`);
        return route(requestContext, globalContext);
    };
};