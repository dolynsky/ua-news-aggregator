const Apify = require('apify');
const { URL } = require('url');
const Topic = require('./Topic')
const {
    utils: { log },
} = Apify;



exports.MAIN = async ({ $, request }, { requestQueue }) => {
    const domainParts = request.loadedUrl.match(/(https?:\/\/)(.*?)\/.+/)
    const selector = '.view_news .title_wrapper .title a';
    let hasOld = false;
    $(selector).map(async (i, el) => {
        const url = new URL($(el).attr('href'), domainParts[1] + domainParts[2]);
        console.log("href:", url)
        const has = await Topic.find({url});
        if (has.length == 0) {
            console.log("NOT FOUND");
        } else {
            console.log("FOUND");
            hasOld = true;
        }
    })
    console.log("HAS OLD: ", hasOld)
    await Apify.utils.enqueueLinks({
        $,
        requestQueue,
        selector,
        baseUrl: request.loadedUrl,
        transformRequestFunction: req => {
            req.userData.label = 'DETAIL';
            return req;
        },
    });

    const topicsFromDomain = await Topic.find({domain: domainParts[2]});
    if (topicsFromDomain.length < 100) {
        await Apify.utils.enqueueLinks({
            $,
            requestQueue,
            selector: '.arrow_next a',
            baseUrl: request.loadedUrl,
            transformRequestFunction: req => {
                req.userData.label = 'MAIN';
                return req;
            },
        });
    }
};

exports.DETAIL = async ({ $, request }) => {
    log.debug('Scraping results.');
    const domain = request.loadedUrl.match(/https?:\/\/(.*?)\/.+/)[1]
    const results = {
        url: request.url,
        domain: domain,
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