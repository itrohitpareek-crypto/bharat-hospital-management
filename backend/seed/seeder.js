// Run with: node seed/seeder.js
// Seeds an initial Admin account, sample Doctors, Departments and Medicines
// so you can log in and explore the app immediately.

const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Department = require("../models/Department");
const Medicine = require("../models/Medicine");
const HospitalSettings = require("../models/HospitalSettings");

const doctorSeedData = [
  { name: "Dr. Abdul Ghafar Khan", email: "Ghafar@gmail.com", specialization: "General physician", department: "Physicology", experience: 18, fee: 800, photo: "doctor-ghafar.jpeg" },
  { name: "Dr. Shyam Sundar Nowal", email: "Shyam@gmail.com", specialization: "Nephrologist Consultant", department: "Nephrology", experience: 10, fee: 800, photo: "doctor-shyam.jpg" },
  { name: "Dr. Darshan Patel", email: "Darshan@gmail.com", specialization: "Laproscopic surgeon", department: "Neurology", experience: 9, fee: 900, photo: "doctor-darshan.jpeg" },
  { name: "Dr. Ramesh Nandlal Joshi", email: "Ramesh@gmail.com", specialization: "senior specialist Surgeon", department: "Gynecology & Obstetrics Dapartment", experience: 13, fee: 1000, photo: "doctor-ramesh.jpeg" },
  { name: "Dr. Jay Pittman", email: "Jay@gmail.com", specialization: "General surgeon", department: "Cardiology", experience: 25, fee: 600, photo: "doctor-pittman.jpeg" },
  { name: "Dr. Ritu Gaur", email: "Ritu@gmail.com", specialization: "Neurosurgeon", department: "Neurology", experience: 11, fee: 700, photo: "doctor-ritu.jpeg" },
  { name: "Dr. Rizwana Khan", email: "Rizwana@gmail.com", specialization: "BDS MIDA", department: "Dermitologist", experience: 18, fee: 500, photo: "doctor-rizwana.jpg" },
];

// Departments are auto-derived from the doctors above, so this list always
// stays in sync with whatever department names you use for your doctors.
const departments = [...new Set(doctorSeedData.map((d) => d.department))].map((name) => ({ name, description: "" }));

const medicineSeedData = [
  { name: "Paracetamol 500mg", category: "Analgesic", price: 20, stock: 500, reorderLevel: 50 },
  { name: "Amoxicillin 250mg", category: "Antibiotic", price: 45, stock: 300, reorderLevel: 40 },
  { name: "Cetirizine 10mg", category: "Antihistamine", price: 15, stock: 200, reorderLevel: 30 },
  { name: "Metformin 500mg", category: "Antidiabetic", price: 35, stock: 250, reorderLevel: 40 },
  { name: "Ibuprofen 400mg", category: "Analgesic", price: 25, stock: 8, reorderLevel: 50 },
  { name: "Omeprazole 20mg", category: "Antacid", price: 30, stock: 150, reorderLevel: 30 },
];

const runSeeder = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Department.deleteMany({});
    await Medicine.deleteMany({});
    await HospitalSettings.deleteMany({});

    console.log("Creating hospital settings...");
    await HospitalSettings.create({
      hospitalName: "Bharat Hospital",
      email: "bmh.srdr@gmail.com",
      phone: "+91 096677 29111",
      address: "Police station ke samne wali road, ward no 25, bukalsar bas , sardarshahar,churu Raj,India",
      logo: "/uploads/profiles/hospital-logo.jpg",
    });

    console.log("Creating departments...");
    await Department.insertMany(departments);

    console.log("Creating admin account...");
    await User.create({
      name: "Admin User",
      email: "admin@bharat.com",
      password: "Admin@123",
      role: "admin",
      phone: "+91 90000 00001",
    });

    console.log("Creating doctors...");
    for (const doc of doctorSeedData) {
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: "Doctor@123",
        role: "doctor",
        phone: "+91 90000 00002",
        profileImage: doc.photo ? `/uploads/profiles/${doc.photo}` : "",
      });
      await Doctor.create({
        user: user._id,
        specialization: doc.specialization,
        department: doc.department,
        experience: doc.experience,
        fee: doc.fee,
        qualification: "MBBS, MD",
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        about: `${doc.name} is a highly experienced ${doc.specialization} with ${doc.experience} years of practice.`,
      });
    }

    console.log("Creating sample patient...");
    const patientUser = await User.create({
      name: "Sample Patient",
      email: "patient@bharat.com",
      password: "Patient@123",
      role: "patient",
      phone: "+91 90000 00003",
    });
    await Patient.create({ user: patientUser._id, bloodGroup: "O+" });

    console.log("Creating medicines...");
    await Medicine.insertMany(medicineSeedData);

    console.log("\n✅ Seed data created successfully!\n");
    console.log("Login credentials:");
    console.log("  Admin:   admin@bharat.com / Admin@123");
    console.log("  Doctor:  ghafar@gmail.com/ Doctor@123");
    console.log("  Patient: patient@bharat.com / Patient@123\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeder error:", error);
    process.exit(1);
  }
};

runSeeder();
