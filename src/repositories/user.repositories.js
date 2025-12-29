const users = [
    { id: 1, name: "Adam", age: 22 },
    { id: 2, name: "Sara", age: 25 },
    { id: 3, name: "John", age: 20 }
];

const findAll = () => {
    console.log("[repository] fetching all users");
    return users;
};

const findById = (id) => {
    return users.find(u => u.id === id) || null;
};

const findByNameAndAge = (name, age) => {
    return users.find(u => u.name === name && u.age === age) || null;
}


const create = ({ name, age }) => {
    const newUser = {
        id: users.length + 1,
        name,
        age,
    };
    users.push(newUser);
    return newUser;
}

const update = (id, updatedData) => {
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return null;

    users[index] = {
        ...users[index],
        ...updatedData
    };
    return users[index];
};


const remove = (id) => {
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return false;
    const deletedUser = users[index];

    users.splice(index, 1);
    return deletedUser;
}

const count = () => {
    return users.length;
}

module.exports = {
    findAll, findById, create, findByNameAndAge, update, remove, count
}