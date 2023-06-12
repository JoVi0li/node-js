const ContactsRepository = require('../repositories/ContactRepository');

class ContactController {
  async index(request, response) {
    const contacts = await ContactsRepository.findAll();
    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;
    const contacts = await ContactsRepository.findById(id);
    if(!contacts) {
      return response.status(404).json({ error: 'User not found' });
    }
    response.json(contacts);
  }

  store() {

  }

  update() {

  }

  async delete(request, response) {
    const { id } = request.params;
    const contacts = await ContactsRepository.findById(id);
    if(!contacts) {
      return response.status(404).json({ error: 'User not found' });
    }
    await ContactsRepository.delete(id);
    response.sendStatus(204);
  }
}

module.exports = new ContactController();
