const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/news-app");
mongoose.set("debug", true);
mongoose.Promise = Promise;

const topicSchema = new mongoose.Schema({
    url: String,
    title: String,
    date: {type: Date}
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
