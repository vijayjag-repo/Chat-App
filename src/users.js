const users = [];

//addUser, removeUser, getUser, getUsersinRoom
const addUser = function({id,username,room}){
    // clean the data
    username = username.toLowerCase();
    room = room.toLowerCase();

    //validate
    if(!username || !room){
        return({
            error: 'Username and room are required'
        });
    }
    //check for existing user
    const existingUser= users.find(function(user){
        return(user.room===room && user.username===username);
    });

    //validate username
    if(existingUser){
        return({
            error: 'Username is in use!'
        });
    }

    //Store user
    const user = {id,username,room};
    users.push(user)
    return({user});
};

const removeUser = function(id){
    const index = users.findIndex(function(user){
        return(user.id===id);
    });
    if(index!==-1){
        return(users.splice(index,1)[0]);
    }
};

const getUser = function(id){
    return(users.find(function(user){
        return(user.id===id);
    }));
}

const getUsersinRoom = function(room){
    room = room.toLowerCase();
    return(users.filter(function(user){
        return(user.room==room);
    }));
}

module.exports = {addUser,removeUser,getUser,getUsersinRoom};

