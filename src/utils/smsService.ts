// Mock SMS/Email service for appointment reminders
export interface ReminderData {
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  phoneNumber?: string;
  email?: string;
}

export const smsService = {
  sendSMSReminder: async (data: ReminderData): Promise<boolean> => {
    // Mock SMS sending - in production, integrate with SMS provider like Twilio
    console.log(`SMS Reminder sent to ${data.phoneNumber}:`);
    console.log(`Hi ${data.patientName}, this is a reminder for your appointment with Dr. ${data.doctorName} on ${data.appointmentDate} at ${data.appointmentTime}. Please arrive 15 minutes early.`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },

  sendEmailReminder: async (data: ReminderData): Promise<boolean> => {
    // Mock email sending - in production, integrate with email service
    console.log(`Email Reminder sent to ${data.email}:`);
    console.log(`Subject: Appointment Reminder - ${data.appointmentDate}`);
    console.log(`Dear ${data.patientName}, this is a friendly reminder about your upcoming appointment...`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },

  scheduleReminder: async (appointmentId: number, reminderTime: Date): Promise<boolean> => {
    // Mock scheduling - in production, use a job queue or scheduler
    console.log(`Reminder scheduled for appointment ${appointmentId} at ${reminderTime}`);
    return true;
  },
};