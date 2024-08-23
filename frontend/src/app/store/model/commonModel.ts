// import { ObjectId } from 'mongoose';

// interface Slot {
//   docId: ObjectId;
//   time: Date;
//   booked?: boolean;
//   bookingAmount: number;
//   adminPaymentAmount: number;
//   cancelled?: boolean;
//   created_time: Date;
// }

export interface HttpResponseModel{
    message:string,
    error:string,
    slot?:Object,
}

export interface otpdata{
    email:string,
    new_email?:string|null,
    otp:string,
    role?:string
  }

export interface UpdatePasswordRequest{
    email:string,
    password:string
}

export interface ChartOptions {
    maintainAspectRatio: boolean;
    aspectRatio: number;
    plugins: {
      legend: {
        labels: {
          color: string;
        };
      };
    };
    scales: {
      x: {
        ticks: {
          color: string;
        };
        grid: {
          color: string;
        };
      };
      y: {
        ticks: {
          color: string;
        };
        grid: {
          color: string;
        };
      };
    };
  }
