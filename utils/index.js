exports.getHttpDomainName = url => {
    return url.match(/(https?:\/\/.*?)\/.+/)[1];
}

exports.getDomainName = url => {
    return url.match(/(https?:\/\/)(.*?)\/.+/)[2];
}