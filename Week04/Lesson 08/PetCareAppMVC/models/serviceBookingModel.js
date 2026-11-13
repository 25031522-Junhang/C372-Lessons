const connection = require('../config/db');

function getBookingsByOwner(ownerId, callback) {
  const sql = `
    SELECT
      service_bookings.id AS booking_id,
      DATE_FORMAT(service_bookings.booking_date, '%Y-%m-%d') AS booking_date,
      pets.name AS pet_name,
      services.name AS service_name,
      service_bookings.booked_price,
      service_bookings.booking_status,
      payments.payment_status,
      payments.payment_reference,
      service_bookings.created_at
    FROM service_bookings
    JOIN pets ON service_bookings.pet_id = pets.id
    JOIN services ON service_bookings.service_id = services.id
    LEFT JOIN payments ON payments.booking_id = service_bookings.id
    WHERE pets.owner_id = ?
    ORDER BY service_bookings.created_at DESC, service_bookings.id DESC
  `;
  connection.query(sql, [ownerId], callback);
}

function createPendingBooking(ownerId, petId, serviceId, bookingDate, callback) {
  connection.getConnection((connectionError, transactionConnection) => {
    if (connectionError) return callback(connectionError);

    transactionConnection.beginTransaction((beginError) => {
      if (beginError) {
        transactionConnection.release();
        return callback(beginError);
      }

      let completed = false;
      const finish = (error, result) => {
        if (completed) return;
        completed = true;
        transactionConnection.release();
        callback(error, result);
      };

      const rollback = (error, result) => {
        transactionConnection.rollback((rollbackError) => {
          if (rollbackError) console.error('Booking transaction rollback failed:', rollbackError);
          finish(error || rollbackError, rollbackError ? undefined : result);
        });
      };

      const insertBookingSql = `
        INSERT INTO service_bookings
          (pet_id, service_id, booking_status, booked_price, booking_date)
        SELECT pets.id, services.id, 'pending', services.price, ?
        FROM pets
        JOIN services ON services.id = ?
        WHERE pets.id = ?
          AND pets.owner_id = ?
          AND services.is_active = 1
      `;
      transactionConnection.query(
        insertBookingSql,
        [bookingDate, serviceId, petId, ownerId],
        (bookingError, bookingResult) => {
          if (bookingError) return rollback(bookingError);
          if (bookingResult.affectedRows !== 1) return rollback(null, null);

          const bookingId = bookingResult.insertId;
          const insertPaymentSql = `
            INSERT INTO payments (booking_id, amount, payment_status)
            SELECT id, booked_price, 'pending'
            FROM service_bookings
            WHERE id = ?
          `;
          transactionConnection.query(
            insertPaymentSql,
            [bookingId],
            (paymentError, paymentResult) => {
              if (paymentError) return rollback(paymentError);
              if (paymentResult.affectedRows !== 1) {
                return rollback(new Error('Expected exactly one payment record to be inserted.'));
              }

              transactionConnection.commit((commitError) => {
                if (commitError) return rollback(commitError);
                finish(null, { bookingId, paymentId: paymentResult.insertId });
              });
            }
          );
        }
      );
    });
  });
}

module.exports = {
  createPendingBooking,
  getBookingsByOwner
};
