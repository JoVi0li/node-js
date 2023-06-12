const { v4 } = require('uuid');

let contacts = [
  {
    id: v4(),
    name: 'João Vitor',
    email: 'joao@email.com',
    phone: '11989915406',
    category: v4(),
  },
  {
    id: v4(),
    name: 'Felipe Augusto',
    email: 'felipe@email.com',
    phone: '11989915403',
    category: v4(),
  },
  {
    id: v4(),
    name: 'Mari',
    email: 'maria@email.com',
    phone: '11989915432',
    category: v4(),
  },
]

class ContactRepository {
  findAll() {
    return new Promise((resolve, reject) => {resolve(contacts);});
  }

   findById(id) {
    return new Promise((resolve, reject) => {
      resolve(contacts.find((contact) => contact.id === id));
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      contacts = contacts.filter((contact) => contact.id !== id);
      resolve();
    });
  }

}

module.exports = new ContactRepository();
