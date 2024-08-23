const cron=require("node-cron")
const slotcollection=require("../model/slotModel")
const bookedSlotCollection=require("../model/bookedSlotModel")
const {update_slot_time_through_email}=require("../helper/generateOtp")

const email_to_notify_booking_time=async()=>{
    console.log('email_to_notify_booking_time_to user and doctor');
    cron.schedule('50,20 8-20 * * *', async() => {
        console.log('Running task every 30 minutes from 8:50 AM to 8:20 PM');
        try{
            const bookedSlots = await bookedSlotCollection
            .find({
              consultation_status: 'pending'
            })
            .populate("slotId")
            .populate("userId")
            .populate("doctorId");

            const now = new Date();
            const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000); // 10 minutes from now

            // Filter the slots after populating
            const upcomingSlot = bookedSlots.filter(slot => {
              const slotTime = new Date(slot.slotId.time);
              return slotTime >= now && slotTime <= tenMinutesFromNow;
            });

            if(upcomingSlot.length>0){
                upcomingSlots.forEach(slot => {
                    update_slot_time_through_email(slot.userId.email, slot.doctorId.email);
                  });
            }
            // const slot=await bookedSlotCollection
            // .find({'slotId.time': { $gte: now, $lte: tenMinutesFromNow },consultation_status:'pending'})
            // .limit(1)
            // .populate("slotId")
            // .populate("userId")
            // .populate("doctorId");
            
        }catch(err){
            console.error('Error cleaning up find slot for email generation:', err);
        }
      });
}

const delete_unbooked_slots=async()=>{
    console.log('delete_unbooked_slots')
    cron.schedule('0,30 9-20 * * *', async() => {
        console.log('Running task every 30 minutes from 9:00 AM to 8:30 PM');
        try {
            // Get the current date and time
            const now = new Date();
            // Find and delete slots that have a time in the past
            const result = await slotcollection.deleteMany({ time: { $lt: now } ,booked:false,cancelled:false});
            console.log('result:',result)
            console.log(`Deleted ${result.deletedCount} past slots`);
        } catch (err) {
            console.error('Error cleaning up past slots:', err);
        }
      });
}

module.exports={email_to_notify_booking_time,delete_unbooked_slots}