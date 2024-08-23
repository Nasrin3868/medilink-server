const slotCollection=require("../model/slotModel")

module.exports ={
    deleteExpiredBookings :async () => {
        const currentTime = new Date();

        //to change the date to local date format from globaldate format
        const utcDate = new Date();
        const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
        // Step 2: Format the local date to the desired string format
        const formattedDateString = localDate.toString();
        console.log('formattedDateString:',formattedDateString);

        try {
          const result = await slotCollection.deleteMany({
            dateOfBooking: { $lte: formattedDateString },booking:false,cancelled:false
          });

          console.log(`${result.deletedCount} booking(s) deleted.`);
        } catch (error) {
          console.error('Error deleting bookings:', error);
        }
      }
}
