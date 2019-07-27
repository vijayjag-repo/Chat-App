const generateMessage = function(username,text){
    return({
        username,
        text: text,
        createdAt: new Date().getTime()
    });
};

const generateLocationMessage = function(username,msg){
    return({
        username,
        url: msg,
        createdAt: new Date().getTime()
    });
};

module.exports = {
    generateMessage,generateLocationMessage
}