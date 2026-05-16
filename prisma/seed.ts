import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in reverse order of dependencies)
  await prisma.messageEventLog.deleteMany();
  await prisma.reminderEventLog.deleteMany();
  await prisma.appointmentEventLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.billing.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.billingEventLog.deleteMany();
  await prisma.userEventLog.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.specialization.deleteMany();

  console.log('✓ Cleared existing data');

  // Create specializations
  const specializations = await Promise.all([
    prisma.specialization.create({
      data: {
        name: 'Orthodontics',
        type: 'ORTHODONTICS',
      },
    }),
    prisma.specialization.create({
      data: {
        name: 'Endodontics',
        type: 'ENDODONTICS',
      },
    }),
    prisma.specialization.create({
      data: {
        name: 'Periodontics',
        type: 'PERIODONTICS',
      },
    }),
  ]);

  console.log(
    '✓ Created 3 specializations (Orthodontics, Endodontics, Periodontics)',
  );

  // Create users (doctors)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'dr.smith@dentis.com',
        name: 'Dr. John Smith',
        firstName: 'John',
        lastName: 'Smith',
        role: 'DENTIST',
        specializationId: specializations[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'dr.jane@dentis.com',
        name: 'Dr. Jane Doe',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'DENTIST',
        specializationId: specializations[1].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'dr.wilson@dentis.com',
        name: 'Dr. Robert Wilson',
        firstName: 'Robert',
        lastName: 'Wilson',
        role: 'DENTIST',
        specializationId: specializations[2].id,
      },
    }),
  ]);

  console.log('✓ Created 3 doctors');

  // Create patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Bob Williams',
        email: 'bob@example.com',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Carol Davis',
        email: 'carol@example.com',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'David Brown',
        email: 'david@example.com',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Eve Martinez',
        email: 'eve@example.com',
      },
    }),
  ]);

  console.log('✓ Created 5 patients');

  // Create appointments
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        name: 'Regular Checkup',
        type: 'CHECKUP',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        patientId: patients[0].id,
        userId: users[0].id,
        status: 'SCHEDULED',
      },
    }),
    prisma.appointment.create({
      data: {
        name: 'Cleaning',
        type: 'CLEANING',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        patientId: patients[1].id,
        userId: users[1].id,
        status: 'SCHEDULED',
      },
    }),
    prisma.appointment.create({
      data: {
        name: 'Root Canal',
        type: 'ROOT_CANAL',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        patientId: patients[2].id,
        userId: users[2].id,
        status: 'SCHEDULED',
      },
    }),
    prisma.appointment.create({
      data: {
        name: 'Orthodontic Consultation',
        type: 'CONSULTATION',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        patientId: patients[3].id,
        userId: users[1].id,
        status: 'SCHEDULED',
      },
    }),
    prisma.appointment.create({
      data: {
        name: 'Cavity Filling',
        type: 'FILLING',
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        patientId: patients[4].id,
        userId: users[0].id,
        status: 'SCHEDULED',
      },
    }),
  ]);

  console.log('✓ Created 5 appointments');

  // Create reminders for some appointments
  const reminders = await Promise.all([
    prisma.reminder.create({
      data: {
        message: 'This is a reminder for your appointment.',
        appointmentId: appointments[0].id,
        status: 'SENT',
        sentAt: new Date(),
      },
    }),
    prisma.reminder.create({
      data: {
        message: 'Please arrive 10 minutes early.',
        appointmentId: appointments[1].id,
        status: 'PENDING',
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log('✓ Created 2 reminders');

  // Create messages for some appointments
  const messages = await Promise.all([
    prisma.message.create({
      data: {
        message:
          'Hi Alice, just a friendly reminder about your checkup on Friday. See you then!',
        appointmentId: appointments[0].id,
        patientId: patients[0].id,
        status: 'SENT',
        sentAt: new Date(),
      },
    }),
    prisma.message.create({
      data: {
        message:
          'Bob, your cleaning appointment is coming up. Please bring your insurance card if possible.',
        appointmentId: appointments[1].id,
        patientId: patients[1].id,
        status: 'PENDING',
      },
    }),
    prisma.message.create({
      data: {
        message:
          'Carol, we confirmed your root canal for next week. Bring your X-rays from your previous dentist if you have them.',
        appointmentId: appointments[2].id,
        patientId: patients[2].id,
        status: 'PENDING',
      },
    }),
  ]);

  console.log('✓ Created 3 messages');

  // Create billings for some appointments
  const billings = await Promise.all([
    prisma.billing.create({
      data: {
        appointmentId: appointments[0].id,
        amount: 150.0,
        description: 'Checkup and cleaning',
        status: 'DRAFT',
      },
    }),
    prisma.billing.create({
      data: {
        appointmentId: appointments[2].id,
        amount: 500.0,
        description: 'Root canal procedure',
        status: 'PAID',
      },
    }),
  ]);

  console.log('✓ Created 2 billings');

  console.log('✅ Database seed completed successfully!');
  console.log('\nTest Data Summary:');
  console.log(`- Specializations: ${specializations.length}`);
  console.log(`- Doctors (Users): ${users.length}`);
  console.log(`- Patients: ${patients.length}`);
  console.log(`- Appointments: ${appointments.length}`);
  console.log(`- Reminders: ${reminders.length}`);
  console.log(`- Messages: ${messages.length}`);
  console.log(`- Billings: ${billings.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
