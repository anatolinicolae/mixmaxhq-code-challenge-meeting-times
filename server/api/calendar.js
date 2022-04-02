const db = require('db');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const express = require('express');
const router = express.Router();

router.get('/api/calendar', async (req, res) => {
  const { hostUserId } = req.query;
  const timeslotLengthMin = 60;

  // Get events from DB
  const events = await db.calendar.findEventsForUser(hostUserId);
  // Convert ranges into moment ranges, to avoid doing this every time in future loops
  const eventsRanges = events.map(e => moment.range(e.start, e.end));

  // Get current day and future 7-day range from tomorrow
  const today = moment().startOf('day');
  const start = today.clone().add(1, 'days');
  const end = today.clone().add(7, 'days');

  // Looop through events and check for overlapping ranges
  const matchEventsToSlot = startAt => {
    const endAt = startAt.clone().add(timeslotLengthMin, 'minutes');
    const slot = moment.range(startAt, endAt);

    // Search for an overlapping range, not finding one means the slot is available
    if (eventsRanges.find(eventRange => slot.overlaps(eventRange)) === undefined) {
      return startAt.format('YYYY-MM-DDTHH:mm:ss.SSS');
    }

    return false;
  };

  // Fetch slots for a single day, starting at 9am ending at 4pm
  const fetchSlotsByDay = day => {
    const startingHour = day.clone().set('hour', 9);
    const endingHour = day.clone().set('hour', 16);

    // Get available slots during the day, by specified time slot length
    const slots = Array.from(moment.range(startingHour, endingHour).by('minutes', { step: timeslotLengthMin }));

    // Filter out slots with overlapping events
    return slots.filter(startAt => matchEventsToSlot(startAt));
  }

  // Fetch slots looping through days, then flatten the array
  const timeslots = Array.from(moment.range(start, end).by('days')).map(day => fetchSlotsByDay(day)).flat();

  res.json({
    name: 'Eng Test User',
    timeslotLengthMin,
    events,
    timeslots,
  });
});

module.exports = router;
