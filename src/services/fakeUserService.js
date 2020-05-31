let lastId = 10;

const users = [
  {
    _id: 1,
    username: "kenjohnp",
    password: "kenjohn",
    firstname: "Kenjohn",
    lastname: "Pacana",
    role: "admin",
  },
  {
    _id: 2,
    username: "reginep",
    password: "regine",
    firstname: "Regine",
    lastname: "Ramos",
    role: "cashier",
  },
  {
    _id: 3,
    username: "vincentp",
    password: "vincent",
    firstname: "Vincent Ray",
    lastname: "Padegdeg",
    role: "cashier",
  },
  {
    _id: 4,
    username: "ronsanguyo",
    password: "vincent",
    firstname: "Ron",
    lastname: "Sanguyo",
    role: "cashier",
  },
  {
    _id: 5,
    username: "jaytiempo",
    password: "vincent",
    firstname: "Jay",
    lastname: "Tiempo",
    role: "cashier",
  },
  {
    _id: 6,
    username: "jankyleching",
    password: "vincent",
    firstname: "Jan Kyle",
    lastname: "Ching",
    role: "cashier",
  },
  {
    _id: 7,
    username: "vergelioflores",
    password: "vincent",
    firstname: "Vergelio",
    lastname: "Flores",
    role: "cashier",
  },
  {
    _id: 8,
    username: "ronyka",
    password: "vincent",
    firstname: "Ronyka",
    lastname: "Tarriela",
    role: "cashier",
  },
  {
    _id: 9,
    username: "robinbago",
    password: "vincent",
    firstname: "Robin",
    lastname: "Bago",
    role: "cashier",
  },
];

export const getUsers = () => {
  return users;
};

export const getUser = (id) => {
  return users.find((u) => u._id == id);
};

export const saveUser = (user) => {
  const userInDb = users.find((u) => u._id == user._id);
  if (!userInDb) {
    const newUser = { ...user };

    newUser._id = lastId++;

    users.push(newUser);
  } else {
    userInDb.firstname = user.firstname;
    userInDb.lastname = user.lastname;
    userInDb.username = user.username;
    userInDb.password = user.password;
    userInDb.role = user.role;
  }

  return users;
};

export const deleteUser = (id) => {
  const userInDb = users.find((u) => u._id === id);
  users.splice(users.indexOf(userInDb), 1);
  return userInDb;
};
