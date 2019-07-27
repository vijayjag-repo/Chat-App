const users = [];

//addUser, removeUser, getUser, getUsersinRoom
const addUser = function({id,username,room}){
    //clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

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

addUser({
    id: 22,
    username: 'vijay',
    room: '21'
});

console.log(users);

const removedUser = removeUser(22);
console.log(users);
console.log(removedUser);
