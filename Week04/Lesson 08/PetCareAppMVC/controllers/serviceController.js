const petModel = require('../models/petModel');
const serviceModel = require('../models/serviceModel');
const serviceBookingModel = require('../models/serviceBookingModel');

const validationMessage = 'Choose a pet, service, and valid booking date.';
const unavailableMessage = 'That pet or service is unavailable for booking.';
const saveErrorMessage = 'Unable to create the booking. Please try again.';
const successMessage = 'Booking created. Payment is pending; no payment has been processed.';

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isPositiveIntegerId(value) {
  return typeof value === 'string'
    && /^\d+$/.test(value)
    && Number.isSafeInteger(Number(value))
    && Number(value) > 0;
}

function isValidBookingDate(value, today) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < today) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));
  return parsedDate.getUTCFullYear() === year
    && parsedDate.getUTCMonth() === month - 1
    && parsedDate.getUTCDate() === day;
}

function listServices(req, res) {
  const ownerId = req.session.user.id;

  petModel.getPetsByOwner(ownerId, (petError, pets) => {
    if (petError) {
      console.error('Error loading pets for service booking:', petError);
      return res.status(500).send('Unable to load pets.');
    }

    serviceModel.getActiveServices((serviceError, services) => {
      if (serviceError) {
        console.error('Error loading services:', serviceError);
        return res.status(500).send('Unable to load services.');
      }

      const requestedPetId = req.query.petId;
      const ownedPet = pets.find((pet) => String(pet.id) === String(requestedPetId));
      return res.render('services', {
        pets,
        services,
        selectedPetId: ownedPet ? String(ownedPet.id) : '',
        today: localDateString(new Date()),
        messages: req.flash('success'),
        errors: req.flash('error'),
        session: req.session
      });
    });
  });
}

function createBooking(req, res) {
  const { petId, serviceId, bookingDate } = req.body;
  const today = localDateString(new Date());
  if (!isPositiveIntegerId(petId)
      || !isPositiveIntegerId(serviceId)
      || !isValidBookingDate(bookingDate, today)) {
    req.flash('error', validationMessage);
    return res.redirect('/services');
  }

  const ownerId = req.session.user.id;
  serviceBookingModel.createPendingBooking(
    ownerId,
    Number(petId),
    Number(serviceId),
    bookingDate,
    (error, result) => {
      if (error) {
        console.error('Error creating service booking:', error);
        req.flash('error', saveErrorMessage);
        return res.redirect(`/services?petId=${encodeURIComponent(petId)}`);
      }

      if (!result) {
        req.flash('error', unavailableMessage);
        return res.redirect('/services');
      }

      req.flash('success', successMessage);
      return res.redirect('/bookings');
    }
  );
}

function listBookings(req, res) {
  serviceBookingModel.getBookingsByOwner(req.session.user.id, (error, bookings) => {
    if (error) {
      console.error('Error loading booking history:', error);
      return res.status(500).send('Unable to load booking history.');
    }

    return res.render('bookings', {
      bookings,
      messages: req.flash('success'),
      errors: req.flash('error'),
      session: req.session
    });
  });
}

module.exports = {
  listServices,
  createBooking,
  listBookings
};
