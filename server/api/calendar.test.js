const request = require('supertest');
const router = require('./calendar');
const express = require('express');
const moment = require('moment');

const app = express();
app.use(router);

describe('GET /api/calendar', () => {
  it('returns timeslots', async () => {
    const req = await request(app)
      .get('/api/calendar')
      .expect('Content-Type', /json/)
      .expect(200);

    const event = req.body.events;
    const slot = moment(event[0].start).set(0, 'minutes');

    expect(req.body).not.toMatchObject({
      timeslots: expect.arrayContaining([slot]),
    });

    expect(req.body).not.toMatchObject({
      timeslots: expect.arrayContaining(['2021-11-24T14:00:00.000']),
    });
  });
});
