import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeartbeat, FaUserMd, FaProcedures, FaAmbulance, FaMicroscope, FaPills,
  FaXRay, FaBaby, FaStethoscope, FaAllergies, FaBrain, FaTint,
  FaCheckCircle, FaStar, FaQuoteLeft, FaChevronDown, FaMapMarkerAlt,
  FaPhoneAlt, FaEnvelope, FaClock,
  FaCircle
} from "react-icons/fa";
 
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Modal from "../../components/Modals/Modal";
import "./Landing.css";

const stats = [
  { label: "Patient Beds", value: "50+" },
  { label: "Happy Patients", value: "150k+" },
  { label: "Years of Service", value: "7+" },
  { label: "Strong Team", value: "50+" },
];

const services = [
  { icon: <FaProcedures />, title: "Emergency Care", desc: "24/7 emergency response with rapid triage and critical care units,and a facility of 50+ beds." },
  { icon: <FaUserMd />, title: "Expert Consultation", desc: "Book appointments with certified specialists across every department." },
  { icon: <FaMicroscope />, title: "Diagnostic Lab", desc: "Advanced pathology, imaging and diagnostic testing with fast reports." },
  { icon: <FaPills />, title: "Pharmacy", desc: "In-house pharmacy with real-time stock and doorstep delivery options." },
  { icon: <FaAmbulance />, title: "Ambulance Service", desc: "GPS-tracked ambulances with trained paramedics on standby." },
  { icon: <FaHeartbeat />, title: "Chiranjeevi & RGHS Yojana", desc: "The Chiranjeevi Yojana and RGHS scheme is also available in our hospital,which helps multiple patients." },
];

const departments = [
  {
    icon: <FaStethoscope />,
    name: "General Medicine",
    description: "Our General Medicine department is led by a physician with 18 years of clinical experience, supported by advanced diagnostic facilities on site.\n\nWe provide comprehensive care for a wide range of acute and chronic conditions, including diabetes, hypertension, thyroid disorders, respiratory infections, fevers, and general health complaints.\n\nOur in-house pathology lab is equipped with a fully automatic analyzer and thyroid testing machine, capable of delivering accurate reports in as little as 15 minutes — helping our physicians make faster, more informed treatment decisions.\n\nFor patients requiring closer monitoring, our centralized oxygen and suction facility ensures rapid, reliable support right at the bedside.\n\nCritical cases are cared for in our 8-bedded advanced ICU — the first of its kind in Sardarshahar — under continuous specialist supervision.\n\nWe are proud to be empanelled under the Chiranjeevi Yojna (MAA Yojna) and RGHS Yojna by the Government of Rajasthan, ensuring eligible patients receive quality care with minimal financial burden.\n\nWhether it's a routine consultation, a chronic condition that needs ongoing management, or an emergency requiring immediate stabilization, our General Medicine team is available to guide you through every step of your treatment.\n\nRegular health check-ups and preventive screenings are also available, helping you stay ahead of potential health issues before they become serious.",
  },
  {
    icon: <FaProcedures />,
    name: "General Surgery",
    description: "Our General Surgery department is one of the most trusted in the region, led by a surgeon with 25 years of hands-on surgical experience.\n\nWe are proud to be the first and only hospital empanelled in general surgery by the Government of Rajasthan in Sardarshahar — a recognition of the quality and safety standards we maintain.\n\nOur surgical team handles a wide range of procedures, from routine and minor surgeries to complex laparoscopic operations, performed with modern equipment and strict safety protocols.\n\nWhat sets us apart is the close collaboration between our General Surgery and General Medicine departments — an 18-year experienced physician and a 25-year experienced surgeon working together under one roof to ensure advanced, coordinated post-operative care.\n\nEvery surgical patient benefits from our centralized oxygen and suction facility, and access to our 8-bedded advanced ICU for close monitoring after major procedures.\n\nOur in-house laboratory supports pre-operative and post-operative testing with fast, accurate results, helping our surgical team make timely decisions throughout the treatment journey.\n\nFrom consultation and diagnosis to surgery and recovery, our goal is to provide safe, compassionate, and complication-free surgical care for every patient who walks through our doors.",
  },
  {
    icon: <FaBaby />,
    name: "Gynecology",
    description: "Our Gynecology & Obstetrics department is dedicated to providing comprehensive, compassionate care for women at every stage of life.\n\nOur specialists hold advanced qualifications including DGO (Diploma in Gynecology & Obstetrics) and bring years of dedicated experience in women's health.\n\nWe offer a full range of services including routine gynecological check-ups, prenatal and postnatal care, management of menstrual disorders, and treatment for common gynecological conditions.\n\nOur department is also supported by an experienced sonologist, allowing for accurate ultrasound-based diagnosis and monitoring right here at the hospital — no need to travel elsewhere for imaging.\n\nFor expecting mothers, we provide close monitoring throughout pregnancy, with access to our centralized oxygen facility and advanced ICU for any complications that may arise.\n\nWe are empanelled under the Chiranjeevi Yojna (MAA Yojna) by the Government of Rajasthan, which is specifically designed to support maternal and child healthcare — helping make quality care accessible and affordable for every family in Sardarshahar.\n\nOur team understands the sensitivity of women's health concerns and is committed to providing a comfortable, respectful, and confidential environment for every consultation and procedure.",
  },
  {
    icon: <FaXRay />,
    name: "Dialysis",
    description: "Our Dialysis unit was established as part of the first 8-bedded ICU hospital in Sardarshahar, and remains one of the few in-house dialysis facilities available in the region.\n\nOur nephrology consultant brings years of specialized experience in managing kidney disease and dialysis care, ensuring every session is closely monitored by qualified medical staff.\n\nWe understand that dialysis is not a one-time treatment but an ongoing part of many patients' lives — which is why we focus on creating a safe, comfortable, and consistent experience for every visit.\n\nOur centralized oxygen and suction facility ensures that patients undergoing dialysis have immediate access to critical support if ever required during a session.\n\nFor patients who develop complications, our 8-bedded advanced ICU is available for immediate escalation of care, all within the same hospital — no need for transfer or delay.\n\nOur in-house laboratory supports regular kidney function monitoring and other essential tests, helping our nephrology team adjust treatment plans quickly and accurately.\n\nWhether you are newly diagnosed with kidney disease or have been on dialysis for years, our team is here to provide consistent, reliable, and compassionate renal care close to home.",
  },
  {
    icon: <FaAllergies />,
    name: "Dermatology",
    description: "Our Dermatology department focuses on the diagnosis and treatment of a wide range of skin, hair, and nail conditions for patients of all ages.\n\nWe provide care for common concerns such as acne, eczema, fungal infections, allergic reactions, pigmentation issues, and other chronic skin conditions.\n\nOur dermatologist works closely with our in-house laboratory to run relevant diagnostic tests when needed, helping ensure accurate diagnosis and an effective treatment plan from the very first visit.\n\nWe also offer guidance on skincare routines, minor dermatological procedures, and management of long-term skin conditions that require ongoing monitoring.\n\nPatients dealing with hair loss, dandruff, or scalp-related concerns can also consult our dermatology team for personalized advice and treatment options.\n\nFor conditions that overlap with other specialities — such as skin manifestations of diabetes or autoimmune conditions — our dermatologist coordinates closely with our General Medicine department to ensure comprehensive care.\n\nWhether it's a one-time consultation or ongoing management of a chronic skin condition, our Dermatology department is committed to helping you look and feel your best.",
  },
  {
    icon: <FaBrain />,
    name: "Neurology",
    description: "Our Neurology department is equipped to evaluate and manage a wide range of conditions affecting the brain, spinal cord, and nervous system.\n\nWe provide consultation and treatment for concerns such as headaches, migraines, seizures, stroke recovery, nerve pain, and other neurological disorders.\n\nPatients requiring surgical intervention for neurological conditions benefit from our close collaboration with the General Surgery department, where advanced procedures are performed by experienced specialists.\n\nOur centralized oxygen and suction facility, along with our 8-bedded advanced ICU, ensures that patients with critical neurological emergencies — such as stroke or severe head injury — receive immediate, closely monitored care.\n\nOur in-house laboratory supports the diagnostic testing often required for neurological conditions, helping our team arrive at an accurate diagnosis without delays.\n\nWe understand that neurological conditions can be complex and often require ongoing follow-up — our team is committed to walking with patients and their families through diagnosis, treatment, and long-term management.\n\nFrom routine consultations to emergency neurological care, our department is here to provide expert, compassionate support for you and your loved ones.",
  },
  {
    icon: <FaTint />,
    name: "Nephrology",
    description: "Our Dialysis unit was established as part of the first 8-bedded ICU hospital in Sardarshahar, and remains one of the few in-house dialysis facilities available in the region.\n\nOur nephrology consultant brings years of specialized experience in managing kidney disease and dialysis care, ensuring every session is closely monitored by qualified medical staff.\n\nWe understand that dialysis is not a one-time treatment but an ongoing part of many patients' lives — which is why we focus on creating a safe, comfortable, and consistent experience for every visit.\n\nOur centralized oxygen and suction facility ensures that patients undergoing dialysis have immediate access to critical support if ever required during a session.\n\nFor patients who develop complications, our 8-bedded advanced ICU is available for immediate escalation of care, all within the same hospital — no need for transfer or delay.\n\nOur in-house laboratory supports regular kidney function monitoring and other essential tests, helping our nephrology team adjust treatment plans quickly and accurately.\n\nWhether you are newly diagnosed with kidney disease or have been on dialysis for years, our team is here to provide consistent, reliable, and compassionate renal care close to home.",
  },
  {
    icon: <FaXRay />,
    name: "Radiology",
    description: "Our Radiology department supports accurate diagnosis across every department of the hospital through advanced imaging and diagnostic testing.\n\nWe offer a range of imaging services including X-Ray, ultrasound, and other diagnostic tests required to evaluate injuries, infections, and internal conditions.\n\nOur sonologist works closely with our Gynecology department to provide prenatal ultrasounds and other obstetric imaging, ensuring expecting mothers receive timely and accurate monitoring throughout their pregnancy.\n\nFast, reliable imaging is especially critical in emergency situations — our radiology services are closely integrated with our General Surgery and General Medicine departments to support quick decision-making for urgent cases.\n\nAll imaging is reviewed carefully to ensure accurate reporting, helping your treating doctor build the most effective treatment plan based on precise diagnostic information.\n\nCombined with our in-house laboratory's fast turnaround times, our Radiology department helps reduce the need for patients to travel elsewhere for essential diagnostic services.\n\nWhether you need a routine X-ray or specialized imaging as part of ongoing treatment, our Radiology team is here to provide accurate, timely results close to home.",
  },
 
];


const doctors = [
  { name: "Dr. Abdul Ghaffar Khan", role: "Medical Director(Physician)", exp: "MBBS, FICM, FCCS(USA) (Fellow In Intensive And Critical Care)\nP.G. DIP. in Clinical Endocrinology & Diabetes (Royal College Of Physicians, London)\nExperience - 18 years", img: "images/ghafar.jpeg" },
  { name: "Dr. Jay Pittman", role: "General Surgeon", exp: "MBBS, MS, FRCS (London) and having experience\n of serving in abroad\nExperience - 25 years", img: "/images/pitman.jpg" },
  { name: "Dr. Shyam Sundar Nowal", role: "Nephrologist Consultant", exp: "MBBS, MD, DM\nExperience - 10 years\nEvery 3rd Thursday of the Month", img: "/images/shyam.jpeg" },
  { name: "Dr. Ritu Gaur", role: "Neurosurgeon", exp: "MBBS, MS, MCh (Neuro Surgery) — GB Pant Hospital, New Delhi\nFormer Assistant Professor (Neuro Surgery) — M Hospital, Bikaner\nExperience - 11 years\nEvery 2nd Monday of the Month", img: "images/ritu.jpeg " },
  { name: "Dr. RIZWANA KHAN", role: "BDS,MIDA", exp: "Lecturer, Vyas Dental College, Jodhpur\nExperience - 18 years", img: "/images/rizwana.jpeg" },
  { name: "Dr. Ramesh Nandan Joshi", role: "DGO", exp: "MBBS, DGO\nSenior Specialist Surgeon (Gynecology & Obstetrics Department)\nSonologist\nExperience - 13 years", img: "/images/ramesh.jpeg" },
  { name: "Dr. Darshan Patel", role: "Laproscopic Surgeon", exp: "MBBS,MD(India) and having experience of serving in\n multiple hospitals as laproscopic surgeon\n Experience-9 years", img: "images/darshan.jpeg" },
  { name: "Vijay singh", role: "Medical Assistant", exp: "Certified Medical Assistant\nSupporting Emergency & OPD Services\nExperience - 5 years", img: "images/vijay.jpeg" },
];

const testimonials = [
  { name: "Subhash Pareek", role: "Patient", text: "The doctors and staff at Bharat Hospital treated me with incredible care. Booking appointments online saved me so much time.", img: "https://i.pravatar.cc/100?img=68" },
  { name: "Maya devi", role: "Patient", text: "Best hospital management experience — from registration to billing, everything felt effortless and transparent.", img: "https://i.pravatar.cc/100?img=32" },
  { name: "jack", role: "Patient", text: "The emergency team responded within minutes. Truly grateful for the professionalism and speed of care.", img: "https://i.pravatar.cc/100?img=15" },
];

const videoTestimonials = [
  { name: "Aishwariya devi", role: "Patient", youtubeId: "I-7tlZi0m-g?si=8LxEXo8taty-mEWA" },
  { name: "nidhi devi", role: "Patient", youtubeId: "8n7OJmDtzKo?si=6NDOJrcUGBuN60Wa" },
  { name: "Ali khan", role: "Patient", youtubeId: "NNGqpp4sMOE?si=y3FgekOnv2gPlJf_" },
];

const faqs = [
  { q: "How do I book an appointment?", a: "Simply register as a patient, browse our doctors by department, and choose an available slot that suits you." },
  { q: "Is my medical data secure?", a: "Yes. We use industry-standard encryption, JWT authentication and role-based access control to protect every record." },
  { q: "Can I access my prescriptions online?", a: "Absolutely — all prescriptions, lab reports and invoices are available in your patient dashboard." },
  { q: "Do you offer emergency services?", a: "Yes, our emergency department operates 24/7 with dedicated ambulance and triage teams." },
  { q: "Do you offer Chiranjeevi and other yojnas?", a: "Yes, we offer Chiranjeevi and other yojnas and our multiple patients got benifit of it." },
];

const Landing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  return (
    <div className="landing">
      <Navbar />

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg-shape shape-1"></div>
        <div className="hero-bg-shape shape-2"></div>
        <div className="container hero-inner">
          <div className="hero-text fade-in">
            <span className="hero-badge"><FaCheckCircle /> Trusted by 150000+ patients</span>
            <h1>Bharat Multispeciality Hospital: <span className="text-gradient">Promoting health, saving lives.</span></h1>
            <p>
             We maintain the highest standars of care and treatment. Our dedicated team is available 24*7, ensuring prompt emergency services. where your health is our utmost priority. Trust us to provide you with the best healthcare experience, every step of the way.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate("/register")}>Book Appointment</button>
              <button className="btn btn-outline" onClick={() => navigate("/login")}>Patient Login</button>
            </div>
            <div className="hero-stats">
              {stats.map((s) => (
                <div key={s.label} className="hero-stat">
                  <h3>{s.value}</h3>
                  <p>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-media float">
<img src="/images/landing.jpeg" alt="Doctor" className="hero-img" />
            <div className="hero-card hero-card-1 glass">
              <FaHeartbeat className="hero-card-icon" />
              <div>
                <p>Heart Rate</p>
                <h4>72 bpm — Normal</h4>
              </div>
            </div>
            <div className="hero-card hero-card-2 glass">
              <FaCheckCircle className="hero-card-icon" style={{ color: "var(--success)" }} />
              <div>
                <p>Appointment</p>
                <h4>Confirmed Today</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ABOUT */}
      <section className="about" id="about">
        <div className="container about-inner">
          <div className="about-media float">
            <img src="/images/hospital-image.jpeg" className="about-img" />
          </div>
          <div className="about-text">
            <h1>ABOUT US</h1>
            <h2 className="section-title" style={{ textAlign: "left" }}>About Bharat Multispeciality Hospital</h2>
            <p className="about-desc">
              Bharat Multispeciality Hospital (BMH), Sardar Shahar was established as the first 8-bedded ICU
              hospital in Sardarshahar, with in-house lab, dialysis and pharmacy. We are a leading healthcare
              institution offering comprehensive services with advanced technology, skilled professionals and
              patient-centric care.
            </p>
            <ul className="about-highlights">
              <li><FaCheckCircle/>Established  on 2nd October 2019 and serving with pride.</li>
              <li><FaCheckCircle /> The first & only 50-bedded hospital in Sardarshahar.</li>
              <li><FaCheckCircle /> Empanelled in Chiranjeevi Yojna (MAA Yojna) & RGHS Yojna by the Government of Rajasthan.</li>
              <li><FaCheckCircle /> Empanelled in general surgery by the Government of Rajasthan in Sardarshahar.</li>
              <li><FaCheckCircle /> The first & only hospital with centralized oxygen & suction facility in Sardarshahar.</li>
              <li><FaCheckCircle /> The first & only hospital with an 8-bedded advanced ICU in Sardarshahar.</li>
              <li><FaCheckCircle /> Surgeries performed by a 25-year experienced surgeon.</li>
              <li><FaCheckCircle /> General Medicine & General Surgery under one roof — an 18-year experienced physician and a 25-year experienced surgeon working together for advanced post-operative care.</li>
              <li><FaCheckCircle /> A fully advanced lab with an automatic analyzer & thyroid testing machine — reports in just 15 minutes.</li>
            </ul>
          </div>
        </div>
      </section>


      

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center" }}>Our Services</h2>
          <p className="section-subtitle">Comprehensive care delivered with precision, compassion and cutting-edge technology.</p>
          <div className="services-grid">
            {services.map((s) => (
              <div key={s.title} className="service-card card">
                <div className="service-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="departments" id="departments">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center" }}>Our Departments</h2>
          <p className="section-subtitle">Specialized centers of excellence staffed by leading experts in their field.</p>
          <div className="departments-grid">
            {departments.map((d) => (
              <div key={d.name} className="dept-card card">
                <div className="dept-icon">{d.icon}</div>
                <p>{d.name}</p>
                <button className="dept-learn-more" onClick={() => setSelectedDept(d)}>Learn More</button>
              </div>
            ))}
          </div>
 
          <Modal open={!!selectedDept} onClose={() => setSelectedDept(null)} title={selectedDept?.name} width={640}>
            {selectedDept && (
              <div className="dept-modal">
                <div className="dept-modal-icon">{selectedDept.icon}</div>
                <p className="dept-modal-desc">{selectedDept.description}</p>
 
                {doctors.filter((doc) => doc.department === selectedDept.name).length > 0 && (
                  <>
                    <h4 className="dept-modal-doctors-title">Our {selectedDept.name} Specialists</h4>
                    <div className="dept-modal-doctors">
                      {doctors
                        .filter((doc) => doc.department === selectedDept.name)
                        .map((doc) => (
                          <div key={doc.name} className="dept-modal-doctor" onClick={() => { setSelectedDept(null); setSelectedDoctor(doc); }}>
                            <img src={doc.img} alt={doc.name} />
                            <p>{doc.name}</p>
                            <span>{doc.role}</span>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </Modal>
 
        </div>
      </section>

      {/* DOCTORS */} 
      <section className="doctors" id="doctors">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center" }}>Meet Our Expert Doctors</h2>
          <p className="section-subtitle">Compassionate specialists dedicated to your wellbeing and loyal towards duty.</p>
          <div className="doctors-grid">
            {doctors.map((doc) => (
              <div key={doc.name} className="doctor-card card" onClick={() => setSelectedDoctor(doc)}>
                <img src={doc.img} alt={doc.name} />
                <div className="doctor-info">
                  <h4>{doc.name}</h4>
                  <p>{doc.role}</p>
                  <div className="doctor-rating">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="doctor-view-more">View Details</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Modal open={!!selectedDoctor} onClose={() => setSelectedDoctor(null)} title={selectedDoctor?.name} width={480}>
        {selectedDoctor && (
          <div className="doctor-modal">
            <img src={selectedDoctor.img} alt={selectedDoctor.name} className="doctor-modal-img" />
            <p className="doctor-modal-role">{selectedDoctor.role}</p>
            {selectedDoctor.exp && <p className="doctor-modal-exp">{selectedDoctor.exp}</p>}
          </div>
        )}
      </Modal>

      {/* TESTIMONIALS */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center" }}>What Our Patients Say</h2>
          <p className="section-subtitle">Real stories from people who trusted us with their care.</p>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card card">
                <FaQuoteLeft className="quote-icon" />
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <img src={t.img} alt={t.name} />
                  <div>
                    <h5>{t.name}</h5>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO TESTIMONIALS */}
      <section className="video-testimonials">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center" }}>Hear It From Our Patients</h2>
          <p className="section-subtitle">Watch our real patients share their experience and review at Bharat Hospital.</p>
          <div className="video-testimonials-grid">
            {videoTestimonials.map((v, idx) => (
              <div key={v.name + idx} className="video-testimonial-card card">
                <div className="video-wrap">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.youtubeId}`}
                    title={v.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="video-testimonial-author">
                  <h5>{v.name}</h5>
                  <span>{v.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center" }}>Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know before getting started.</p>
          <div className="faq-list">
            {faqs.map((f, idx) => (
              <div key={f.q} className={`faq-item card ${openFaq === idx ? "faq-open" : ""}`} onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}>
                <div className="faq-question">
                  <h4>{f.q}</h4>
                  <FaChevronDown className="faq-chevron" />
                </div>
                {openFaq === idx && <p className="faq-answer">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="cta">
        <div className="container cta-inner">
          <div>
            <h2>Ready to experience premium healthcare?</h2>
            <p>Register today and book your first appointment in under two minutes.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>Get Started Now</button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
