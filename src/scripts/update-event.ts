const CALENDAR_ID = import.meta.env.VITE_CALENDAR_ID;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const EVENT_ID = import.meta.env.VITE_EVENT_ID;
const REFRESH_TOKEN = import.meta.env.VITE_REFRESH_TOKEN;

const refreshTokenUrl = `https://oauth2.googleapis.com/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&refresh_token=${REFRESH_TOKEN}&grant_type=refresh_token`;

const getToken = async () => {
  const response = await fetch(refreshTokenUrl, { method: 'POST' });
  const { access_token } = await response.json();
  return access_token;
};

const getEvent = async () => {
  const accessToken = await getToken();

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events/${EVENT_ID}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    },
  );
  return response.json();
};

export const updateEvent = async (email: string): Promise<boolean> => {
  const accessToken = await getToken();
  const event = await getEvent();
  const { attendees } = event;
  const attendee = { email };

  attendees.push(attendee);
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events/${EVENT_ID}?sendUpdates=all`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attendees,
      }),
    },
  );
  return response.ok;
};
