import * as dotenv from 'dotenv';
import { $Enums, Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { faker } from '@faker-js/faker';
import { titleCase } from '../../helper-utils';

void dotenv.config();
const ENV = {
  NEW_USER_SEEDER_COUNT: process.env.NEW_USER_SEEDER_COUNT,
  ADMIN_USER_SEEDER_COUNT: process.env.ADMIN_USER_SEEDER_COUNT,
  DENTIST_USER_SEEDER_COUNT: process.env.DENTIST_USER_SEEDER_COUNT,
  RECEPTIONIST_USER_SEEDER_COUNT: process.env.RECEPTIONIST_USER_SEEDER_COUNT,
  PATIENT_SEEDER_COUNT: process.env.PATIENT_SEEDER_COUNT,
  APPOINTMENT_SEEDER_COUNT: process.env.APPOINTMENT_SEEDER_COUNT,
  BILLING_SEEDER_COUNT: process.env.BILLING_SEEDER_COUNT,
  USER_PATIENT_SEEDER_COUNT: process.env.USER_PATIENT_SEEDER_COUNT,
  REMINDER_SEEDER_COUNT: process.env.REMINDER_SEEDER_COUNT,
  APPOINTMENT_EVENT_LOG_SEEDER_COUNT:
    process.env.APPOINTMENT_EVENT_LOG_SEEDER_COUNT,
  BILLING_EVENT_LOG_SEEDER_COUNT: process.env.BILLING_EVENT_LOG_SEEDER_COUNT,
  REMINDER_EVENT_LOG_SEEDER_COUNT: process.env.REMINDER_EVENT_LOG_SEEDER_COUNT,
  USER_EVENT_LOG_SEEDER_COUNT: process.env.USER_EVENT_LOG_SEEDER_COUNT,

  DATABASE_URL: process.env.DATABASE_URL,
};

if (
  !ENV.NEW_USER_SEEDER_COUNT ||
  !ENV.ADMIN_USER_SEEDER_COUNT ||
  !ENV.DENTIST_USER_SEEDER_COUNT ||
  !ENV.RECEPTIONIST_USER_SEEDER_COUNT ||
  !ENV.PATIENT_SEEDER_COUNT ||
  !ENV.APPOINTMENT_SEEDER_COUNT ||
  !ENV.BILLING_SEEDER_COUNT ||
  !ENV.USER_PATIENT_SEEDER_COUNT ||
  !ENV.REMINDER_SEEDER_COUNT ||
  !ENV.APPOINTMENT_EVENT_LOG_SEEDER_COUNT ||
  !ENV.BILLING_EVENT_LOG_SEEDER_COUNT ||
  !ENV.REMINDER_EVENT_LOG_SEEDER_COUNT ||
  !ENV.USER_EVENT_LOG_SEEDER_COUNT ||
  !ENV.DATABASE_URL
) {
  throw new Error('Missing environment variables');
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // clean up db before seeding
  await prisma.billing.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.specialization.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.userEventLog.deleteMany();
  await prisma.appointmentEventLog.deleteMany();
  await prisma.billingEventLog.deleteMany();
  await prisma.reminderEventLog.deleteMany();

  // run all migrations first before seeding
  await prisma.$executeRaw`ALTER SEQUENCE "Specialization_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Patient_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Appointment_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Billing_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Reminder_id_seq" RESTART WITH 1;`;
  const specializationTypes = Object.values($Enums.SpecializationType);
  const specialiations: Prisma.SpecializationCreateInput[] = [];

  for (let i = 0; i < specializationTypes.length; i++) {
    specialiations.push({
      name: titleCase(specializationTypes[i]),
      type: specializationTypes[i] as $Enums.SpecializationType,
    });
  }
  await prisma.specialization.createMany({ data: specialiations });

  const newUsers: Prisma.UserCreateInput[] = [];
  for (let i = 0; i < Number(ENV.NEW_USER_SEEDER_COUNT); i++) {
    const fullName = faker.person.fullName();
    const [firstName, lastName] = fullName.split(' ');
    newUsers.push({
      name: fullName,
      firstName: firstName,
      lastName: lastName,
      email: faker.internet.email({ firstName, lastName }),
      role: 'NEW',
    });
  }
  await prisma.user.createMany({ data: newUsers });

  const dentists: Prisma.UserCreateManyInput[] = [];
  for (let i = 0; i < Number(ENV.DENTIST_USER_SEEDER_COUNT); i++) {
    const fullName = faker.person.fullName();
    const [firstName, lastName] = fullName.split(' ');
    dentists.push({
      name: fullName,
      firstName: firstName,
      lastName: lastName,
      email: faker.internet.email({ firstName, lastName }),
      role: 'DENTIST',
      specializationId:
        Math.floor(Math.random() * specializationTypes.length) + 1,
    });
  }
  await prisma.user.createMany({ data: dentists });

  const userPatients: Prisma.UserCreateManyInput[] = [];
  for (let i = 0; i < Number(ENV.USER_PATIENT_SEEDER_COUNT); i++) {
    const fullName = faker.person.fullName();
    const [firstName, lastName] = fullName.split(' ');
    userPatients.push({
      name: fullName,
      firstName: firstName,
      lastName: lastName,
      email: faker.internet.email({ firstName, lastName }),
      role: 'PATIENT',
    });
  }
  await prisma.user.createMany({ data: userPatients });

  const patients: Prisma.PatientCreateInput[] = [];
  for (let i = 0; i < Number(ENV.PATIENT_SEEDER_COUNT); i++) {
    const fullName = faker.person.fullName();
    const [firstName, lastName] = fullName.split(' ');
    patients.push({
      name: fullName,
      email: faker.internet.email({ firstName, lastName }),
    });
  }
  await prisma.patient.createMany({ data: patients });

  const appointments: Prisma.AppointmentCreateManyInput[] = [];
  for (let i = 0; i < Number(ENV.APPOINTMENT_SEEDER_COUNT); i++) {
    const date = faker.date.future();
    appointments.push({
      date: date,
      name: `Appointment for ${date.toDateString()}`,
      patientId:
        Math.floor(Math.random() * Number(ENV.PATIENT_SEEDER_COUNT)) + 1,
      userId:
        Math.floor(Math.random() * Number(ENV.DENTIST_USER_SEEDER_COUNT)) + 1,
    });
  }

  await prisma.appointment.createMany({ data: appointments });

  const billings: Prisma.BillingCreateManyInput[] = [];
  for (let i = 0; i < Number(ENV.BILLING_SEEDER_COUNT); i++) {
    billings.push({
      appointmentId: i + 1,
      amount: parseFloat((Math.random() * 500).toFixed(2)),
      description: `Billing for appointment ${i + 1}`,
    });
  }
  await prisma.billing.createMany({ data: billings });

  const receptionists: Prisma.UserCreateManyInput[] = [];
  for (let i = 0; i < Number(ENV.RECEPTIONIST_USER_SEEDER_COUNT); i++) {
    const fullName = faker.person.fullName();
    const [firstName, lastName] = fullName.split(' ');
    receptionists.push({
      name: fullName,
      firstName: firstName,
      lastName: lastName,
      email: faker.internet.email({ firstName, lastName }),
      role: 'RECEPTIONIST',
      specializationId:
        Math.floor(Math.random() * specializationTypes.length) + 1,
    });
  }
  await prisma.user.createMany({ data: receptionists });

  const admins: Prisma.UserCreateInput[] = [];
  for (let i = 0; i < Number(ENV.ADMIN_USER_SEEDER_COUNT); i++) {
    const fullName = faker.person.fullName();
    const [firstName, lastName] = fullName.split(' ');
    admins.push({
      name: fullName,
      firstName: firstName,
      lastName: lastName,
      email: faker.internet.email({ firstName, lastName }),
      role: 'ADMIN',
    });
  }
  await prisma.user.createMany({ data: admins });

  const reminders: Prisma.ReminderCreateManyInput[] = [];
  for (let i = 0; i < Number(ENV.REMINDER_EVENT_LOG_SEEDER_COUNT); i++) {
    reminders.push({
      appointmentId:
        Math.floor(Math.random() * Number(ENV.APPOINTMENT_SEEDER_COUNT)) + 1,
      message: `Reminder for appointment ${i + 1}`,
    });
  }
  await prisma.reminder.createMany({ data: reminders });

  // event logs
  const userEventLogs: Prisma.UserEventLogCreateManyInput[] = [];
  for (let i = 0; i < Number(ENV.USER_EVENT_LOG_SEEDER_COUNT); i++) {
    userEventLogs.push({
      userId: Math.floor(Math.random() * Number(ENV.NEW_USER_SEEDER_COUNT)) + 1,
      eventType:
        $Enums.EventType[
          faker.helpers.arrayElement(
            Object.keys($Enums.EventType) as Array<
              keyof typeof $Enums.EventType
            >,
          )
        ],
      event: `Event log for user ${i + 1}`,
    });
  }
  await prisma.userEventLog.createMany({ data: userEventLogs });

  const appointMentEventLogs: Prisma.AppointmentEventLogCreateManyInput[] = [];
  for (let i = 0; i < Number(ENV.APPOINTMENT_EVENT_LOG_SEEDER_COUNT); i++) {
    appointMentEventLogs.push({
      appointmentId:
        Math.floor(Math.random() * Number(ENV.APPOINTMENT_SEEDER_COUNT)) + 1,
      eventType:
        $Enums.EventType[
          faker.helpers.arrayElement(
            Object.keys($Enums.EventType) as Array<
              keyof typeof $Enums.EventType
            >,
          )
        ],
      event: `Event log for appointment ${i + 1}`,
    });
  }
  await prisma.appointmentEventLog.createMany({ data: appointMentEventLogs });

  const billingEventLogs: Prisma.BillingEventLogCreateManyInput[] = [];
  for (let i = 0; i < Number(ENV.BILLING_EVENT_LOG_SEEDER_COUNT); i++) {
    billingEventLogs.push({
      billingId:
        Math.floor(Math.random() * Number(ENV.BILLING_SEEDER_COUNT)) + 1,
      eventType:
        $Enums.EventType[
          faker.helpers.arrayElement(
            Object.keys($Enums.EventType) as Array<
              keyof typeof $Enums.EventType
            >,
          )
        ],
      event: `Event log for billing ${i + 1}`,
    });
  }
  await prisma.billingEventLog.createMany({ data: billingEventLogs });

  const reminderEventLogs: Prisma.ReminderEventLogCreateManyInput[] = [];
  for (let i = 0; i < Number(ENV.REMINDER_EVENT_LOG_SEEDER_COUNT); i++) {
    reminderEventLogs.push({
      reminderId:
        Math.floor(Math.random() * Number(ENV.REMINDER_SEEDER_COUNT)) + 1,
      eventType:
        $Enums.EventType[
          faker.helpers.arrayElement(
            Object.keys($Enums.EventType) as Array<
              keyof typeof $Enums.EventType
            >,
          )
        ],
      event: `Event log for reminder ${i + 1}`,
    });
  }
  await prisma.reminderEventLog.createMany({ data: reminderEventLogs });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

process.on('exit', () => {
  void prisma.$disconnect();
  process.exit(0);
});
