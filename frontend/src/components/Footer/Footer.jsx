import React from "react";
import { Link } from "react-router-dom";
import { FaHeartbeat, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-col">
          <Link to="/" className="navbar-brand" style={{ marginBottom: 16 }}>
            <span className="brand-icon1"><img src="https://bharathospitalsrdr.com/wp-content/uploads/2025/01/2ed8f6f3-0c13-4d62-90c4-027227a9792f-removebg-preview.png"></img></span>
            <span>Bharat <b>Hospital</b></span>
          </Link>
          <p className="footer-about">
            Bharat hospital provides you best and Premium hospital management platform delivering world-class patient care,
            seamless appointments and smart healthcare operations.
          </p>
          <div className="footer-socials">
            <a href="https://www.facebook.com/profile.php?id=100057505326716"><FaFacebookF /></a>
            <a href="https://www.youtube.com/@BHARATHOSPITALSARDARSHAHAR"><FaYoutube /></a>
            <a href="tel:9667729111"><FaPhoneAlt /></a>
            <a href="https://wa.me/9667729111"><FaWhatsapp /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#departments">Departments</a></li>
            <li><a href="#doctors">Our Doctors</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Departments</h4>
          <ul>
            <li><a href="#departments">Cardiology</a></li>
            <li><a href="#departments">Neurology</a></li>
            <li><a href="#departments">Orthopedics</a></li>
            <li><a href="#departments">Pediatrics</a></li>
            <li><a href="#departments">Dermatology</a></li>
          </ul>
        </div>

        <div className="footer-col footer-col-contact">
          <h4>Contact Us</h4>
          <ul className="footer-contact">
            <li><FaMapMarkerAlt />Police station ke samne wali road,ward no 25,bukalsar bas,sardarshahar(331403),<br></br>churu,Raj,India</li>
            <li><FaPhoneAlt /> +91 096677 29111,
 7878932647,
 9950666110</li>
            <li><FaEnvelope />bmh.srdr@gmail.com</li>
          </ul>
        </div>

        <div className="footer-col footer-col-map">
          <h4>Find Us Here</h4>
          <div className="footer-map">
            <iframe
              src="https://www.google.com/maps?q=Bharat+Multispeciality+Hospital+Sardarshahar+Churu+Rajasthan&output=embed"
              title="Bharat Hospital Location"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Bharat+Multispeciality+Hospital+Sardarshahar+Churu+Rajasthan"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-map-link"
          >
            <FaMapMarkerAlt /> Get Directions
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bharat Hospital. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
