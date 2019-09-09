const Apify = require('apify');
const Topic = require('./Topic')
const {
    utils: { log },
} = Apify;



exports.MAIN = async ({ $, request }, { requestQueue }) => {
    const links = await Apify.utils.enqueueLinks({
        $,
        requestQueue,
        selector: '.view_news .title_wrapper .title a',
        baseUrl: request.loadedUrl,
        transformRequestFunction: req => {
            req.userData.label = 'DETAIL';
            return req;
        },
    });
};

exports.DETAIL = async ({ $, request }) => {
    log.debug('Scraping results.');
    const results = {
        url: request.url,
        title: $('.page_title').text(),
        date: new Date(parseInt($('.date_timestamp').text()) * 1000)
    };

    const topics = await Topic.find({url: request.url});
    if (!topics.length) {
        await Topic.create(results);
    }

    log.debug('Pushing data to dataset.');
    // await Apify.pushData(results);
};