import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../../services/admin-service.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { ChartOptions } from 'src/app/store/model/commonModel';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  data!: any;
  options!: ChartOptions;
  revenue!:Number
  booked_Slots!:any;
  total_revenue!:number
  total_users!:number
  total_doctors!:number
  total_booking!:number
  total_upcoming_booking!:number
  total_consulted_bookings!:number
  total_not_consulted_bookings!:number
  total_cancelled_bookings!:number
  graph_data_based_on:string='weekly'

  constructor(
    private _adminService:AdminServiceService,
    private _messageService:MessageToasterService
  ){}

  ngOnInit() {
    this.get_Slot_Details()
  }

  updateGraphDetails() {
    this.graph_details(this.graph_data_based_on);
  }

  get_Slot_Details(){
    console.log('  client side');
    const docId=localStorage.getItem('doctorId')
    this._adminService.get_admin_dashboard_details({doctorId:docId}).subscribe({
      next:(Response)=>{
        this.booked_Slots=Response.slotDetails
        this.total_users=Response.user_count
        this.total_doctors=Response.doctor_count
        this.get_dashboard_display_contents()
        this.graph_details(this.graph_data_based_on)
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  get_dashboard_display_contents(){
    this.total_revenue=this.booked_Slots.reduce((acc:number,data:any)=>{
      if(data.consultation_status==='consulted'||data.consultation_status==='not_consulted'){
          return acc+data.slotId.adminPaymentAmount
      }
      return acc
    },0)
    this.total_upcoming_booking=this.booked_Slots.reduce((acc:number,data:any)=>{
      if(data.consultation_status==='pending'){
          return acc+1
      }
      return acc
    },0)
    this.total_booking=this.booked_Slots.reduce((acc:number,data:any)=>{
      if(data.consultation_status==='pending'||data.consultation_status==='consulted'){
          return acc+1
      }
      return acc
    },0)

    this.total_consulted_bookings=this.booked_Slots.reduce((acc:number,data:any)=>{
      if(data.consultation_status==='consulted'){
          return acc+1
      }
      return acc
    },0)
    this.total_not_consulted_bookings=this.booked_Slots.reduce((acc:number,data:any)=>{
      if(data.consultation_status==='not_consulted'){
          return acc+1
      }
      return acc
    },0)
    this.total_cancelled_bookings=this.booked_Slots.reduce((acc:number,data:any)=>{
      if(data.consultation_status==='cancelled'){
          return acc+1
      }
      return acc
    },0)
  }

  graph_details(graph_data_based_on:string){
    if (!this.booked_Slots) {
      this._messageService.showErrorToastr('Error in fetching slot details from server')
      return;
    }
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    let processedData;
    if (graph_data_based_on === 'weekly') {
      processedData = this.processWeeklyData();
    } else {
      processedData = this.processMonthlyData();
    }
    this.data = {
        labels: processedData.labels,
        datasets: [
          {
            type: 'line',
            label: 'Bookings',
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            data: processedData.bookings
          },
          {
            type: 'bar',
            label: 'Consulted',
            backgroundColor: documentStyle.getPropertyValue('--green-500'),
            data: processedData.consulted,
            borderColor: 'white',
            borderWidth: 2
          },
          {
            type: 'bar',
            label: 'Cancelled',
            backgroundColor: documentStyle.getPropertyValue('--orange-500'),
            data: processedData.cancelled
          },
          {
            type: 'bar',
            label: 'Not Consulted',
            backgroundColor: documentStyle.getPropertyValue('--red-500'),
            data: processedData.notConsulted
          }
        ]
    };
    
    this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
  }
  processWeeklyData() {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyData = {
      labels: daysOfWeek,
      bookings: new Array(7).fill(0),
      consulted: new Array(7).fill(0),
      cancelled: new Array(7).fill(0),
      notConsulted: new Array(7).fill(0)
    };

    this.booked_Slots.forEach((slot: any) => {
      const day = new Date(slot.created_time).getDay(); // Get day of the week (0-6, 0 is Sunday)
      const dayIndex = (day + 6) % 7; // Adjust to (0-6, 0 is Monday)
      weeklyData.bookings[dayIndex]++;
      if (slot.consultation_status === 'consulted') {
        weeklyData.consulted[dayIndex]++;
      } else if (slot.consultation_status === 'cancelled') {
        weeklyData.cancelled[dayIndex]++;
      } else if (slot.consultation_status === 'not-consulted') {
        weeklyData.notConsulted[dayIndex]++;
      }
    });
    return weeklyData;
  }
  processMonthlyData() {
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = {
      labels: monthsOfYear,
      bookings: new Array(12).fill(0),
      consulted: new Array(12).fill(0),
      cancelled: new Array(12).fill(0),
      notConsulted: new Array(12).fill(0)
    };

    this.booked_Slots.forEach((slot:any) => {
      const month = new Date(slot.created_time).getMonth(); // Get month (0-11)
      monthlyData.bookings[month]++;
      if (slot.consultation_status === 'consulted') {
        monthlyData.consulted[month]++;
      } else if (slot.consultation_status === 'cancelled') {
        monthlyData.cancelled[month]++;
      } else if (slot.consultation_status === 'not-consulted') {
        monthlyData.notConsulted[month]++;
      }
    });
    return monthlyData;
  }
}
