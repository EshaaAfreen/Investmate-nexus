import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Github } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-primary-custom text-white mt-auto">
            <div className="container py-5">
                <div className="row g-4">
                    {/* Brand Section */}
                    <div className="col-lg-4 col-md-6">
                        <h5 className="fw-bold mb-3">Investmate Nexus</h5>
                        <p className="text-white-50 mb-3">
                            Connecting innovative entrepreneurs with forward-thinking investors to build the future together.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-white-50 hover-text-white" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="text-white-50 hover-text-white" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-white-50 hover-text-white" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-white-50 hover-text-white" aria-label="GitHub">
                                <Github size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="fw-bold mb-3">Quick Links</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="text-white-50 text-decoration-none hover-text-white">
                                    Home
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/register?role=entrepreneur" className="text-white-50 text-decoration-none hover-text-white">
                                    For Entrepreneurs
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/register?role=investor" className="text-white-50 text-decoration-none hover-text-white">
                                    For Investors
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/admin/login" className="text-white-50 text-decoration-none hover-text-white">
                                    Admin Portal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="fw-bold mb-3">Resources</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none hover-text-white">
                                    About Us
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none hover-text-white">
                                    How It Works
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none hover-text-white">
                                    Privacy Policy
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-white-50 text-decoration-none hover-text-white">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="fw-bold mb-3">Contact Us</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2 d-flex align-items-start">
                                <Mail size={16} className="me-2 mt-1 flex-shrink-0" />
                                <span className="text-white-50">support@investmate.com</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                                <Phone size={16} className="me-2 mt-1 flex-shrink-0" />
                                <span className="text-white-50">+1 (555) 123-4567</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                                <MapPin size={16} className="me-2 mt-1 flex-shrink-0" />
                                <span className="text-white-50">123 Innovation Street, Tech City, TC 12345</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-top border-white-50 mt-4 pt-4 text-center">
                    <p className="text-white-50 mb-0 small">
                        © {new Date().getFullYear()} Investmate Nexus. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
