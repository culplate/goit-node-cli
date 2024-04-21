import fs from 'node:fs/promises';
import { nanoid } from 'nanoid';

const contactsPath = new URL('db/contacts.json', import.meta.url);

export async function listContacts() {
    // Returns array of Contacts' objects
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
}

export async function getContactById(contactId) {
    // Returns an object with given id
    const contacts = await listContacts();
    const contactById = contacts.find(contact => contact.id === contactId);
    return contactById || null;
}

export async function removeContact(contactId) {
    // Returns deleted contact's object or null if contact with such id not exists.
    const contacts = await listContacts();
    const contactIdx = contacts.findIndex(contact => contact.id === contactId);

    if (contactIdx === -1) return null;

    const deletedContact = contacts.splice(contactIdx, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return deletedContact;
}

export async function addContact(name, email, phone) {
    // Returns an object of added contact.
    const contacts = await listContacts();
    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
}
