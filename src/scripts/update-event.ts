// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { CALENDAR_ID, CLIENT_ID, CLIENT_SECRET, EVENT_ID, REFRESH_TOKEN } = envs;

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
