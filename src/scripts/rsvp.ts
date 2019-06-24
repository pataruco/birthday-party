import Joi from '@hapi/joi';
import { updateEvent } from './update-event';

const form = document.getElementById('js-form') as HTMLFormElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const messageElement = document.getElementById(
  'js-rsvp-message',
) as HTMLParagraphElement;

const schema = Joi.string()
  .email()
  .required();

const messages = {
  request: `Updating guess list 📡...`,
  success: `Great see you then 🎊🎉`,
  failure: `Something went wrong, please try again 😱`,
  validation: `Please enter a valid email 📩`,
};

const addAttendee = async (event: Event) => {
  renderMessage(messages.request);
  event.preventDefault();
  if (emailInput.checkValidity()) {
    const { value } = emailInput;
    const { error } = Joi.validate(value, schema);
    if (error) {
      renderMessage(messages.validation);
      document.body.classList.toggle('event-validation-error');
      emailInput.value = '';
      return;
    }
    const isEventUpdated = await updateEvent(value);

    if (isEventUpdated) {
      form.remove();
      document.body.classList.toggle('event-update-success');
      renderMessage(messages.success);
    } else {
      document.body.classList.toggle('event-update-failure');
      renderMessage(messages.failure);
    }
  }
};

const focusState = (event: Event) => {
  emailInput.value = '';
  const classesNames = [
    'event-update-success',
    'event-update-failure',
    'event-validation-error',
  ];
  classesNames.forEach(name => document.body.classList.remove(name));
  form.classList.add('focus');
};

const blurState = (event: Event) => {
  const classesNames = [
    'event-update-success',
    'event-update-failure',
    'event-validation-error',
  ];
  classesNames.forEach(name => document.body.classList.remove(name));

  if (emailInput.value.length === 0) {
    form.classList.remove('focus');
  }
};

const renderMessage = (message: string) => {
  messageElement.innerText = '';
  messageElement.innerText = message;
};

form.addEventListener('submit', addAttendee);
emailInput.addEventListener('focus', focusState);
emailInput.addEventListener('blur', blurState);
