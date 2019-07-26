const generateMessage = function(text){
    return({
        text: text,
        createdAt: new Date().getTime()
    });
};

const generateLocationMessage = function(msg){
    return({
        url: msg,
        createdAt: new Date().getTime()
    });
};

module.exports = {
    generateMessage,generateLocationMessage
}