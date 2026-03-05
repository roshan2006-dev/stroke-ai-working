import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  FaBrain, FaHospital, FaUserMd, FaAmbulance, 
  FaChartLine, FaShieldAlt, FaRocket, FaHeartbeat,
  FaArrowRight, FaPlay, FaStar, FaCheckCircle
} from 'react-icons/fa';
import Tilt from 'react-parallax-tilt';

// ============================================
// STYLED COMPONENTS
// ============================================

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
  70% { box-shadow: 0 0 0 20px rgba(102, 126, 234, 0); }
  100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
`;

const glow = keyframes`
  0% { filter: drop-shadow(0 0 5px #667eea); }
  50% { filter: drop-shadow(0 0 20px #764ba2); }
  100% { filter: drop-shadow(0 0 5px #667eea); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
  color: white;
  overflow-x: hidden;
`;

const BrainIcon = styled(FaBrain)`
  font-size: 3rem;
  color: #667eea;
  animation: ${glow} 3s ease-in-out infinite;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 50%);
    animation: ${float} 20s linear infinite;
  }
`;

const FloatingBrain = styled(motion.div)`
  position: absolute;
  right: 5%;
  top: 20%;
  width: 400px;
  height: 400px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 10 Q 70 10 80 25 Q 90 40 80 55 Q 70 70 50 70 Q 30 70 20 55 Q 10 40 20 25 Q 30 10 50 10" fill="%23667eea" opacity="0.1"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  animation: ${float} 6s ease-in-out infinite;
`;

const StatsCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
`;

const GlowingButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: ${pulse} 2s infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

// ============================================
// COMPONENTS
// ============================================

const Navbar = () => (
  <motion.nav 
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    style={{
      background: 'rgba(15, 15, 26, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}
  >
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <BrainIcon />
        <span className="text-2xl font-bold gradient-text">NeuroGuardian</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
        <a href="#stats" className="text-gray-300 hover:text-white transition">Statistics</a>
        <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
        <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/login">
          <button className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition">
            Login
          </button>
        </Link>
        <Link to="/register">
          <GlowingButton className="px-6 py-2">
            Sign Up
          </GlowingButton>
        </Link>
      </div>
    </div>
  </motion.nav>
);

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <HeroSection className="container mx-auto px-6 pt-32">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 mb-6"
          >
            🚀 AI-Powered Stroke Detection
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Detect Strokes in{' '}
            <span className="gradient-text">Seconds</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Save lives with 98.3% accuracy using advanced deep learning.
            Trusted by 500+ hospitals worldwide.
          </p>
          
          {/* ✅ Hero Buttons Fixed */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 items-start md:items-center max-w-[600px]">
            <Link to="/dashboard">
              <GlowingButton className="px-8 py-4 text-lg w-full md:w-auto flex justify-center items-center">
                Try AI Analysis <FaArrowRight className="inline ml-2" />
              </GlowingButton>
            </Link>
            
            <button className="px-8 py-4 text-lg border border-white/20 rounded-lg hover:bg-white/10 transition w-full md:w-auto flex justify-center items-center">
              <FaPlay className="mr-2" /> Watch Demo
            </button>
          </div>
          
          <div className="flex items-center space-x-8">
            <div>
              <div className="text-3xl font-bold gradient-text">98.3%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">30s</div>
              <div className="text-sm text-gray-400">Analysis Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">500+</div>
              <div className="text-sm text-gray-400">Hospitals</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          style={{ y, opacity }}
          className="relative"
        >
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
            <div className="relative">
              <FloatingBrain />
              <StatsCard
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative z-10"
              >
                <h3 className="text-2xl mb-4">Live Demo</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Upload Scan</span>
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 1, duration: 2 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AI Analysis</span>
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ delay: 2, duration: 1.5 }}
                        className="h-full bg-gradient-to-r from-green-500 to-teal-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Results Ready</span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 3, type: 'spring' }}
                      className="text-green-400"
                    >
                      <FaCheckCircle size={24} />
                    </motion.div>
                  </div>
                </div>
              </StatsCard>
            </div>
          </Tilt>
        </motion.div>
      </div>
    </HeroSection>
  );
};

// ============================================
// Features, Stats, Testimonials, CTASection, Footer
// ============================================

const Features = () => {
  const features = [
    { icon: <FaBrain size={40} />, title: 'Deep Learning AI', desc: 'State-of-the-art U-Net architecture with 98.3% accuracy' },
    { icon: <FaHospital size={40} />, title: 'Hospital Integration', desc: 'Seamless integration with existing hospital systems via API' },
    { icon: <FaAmbulance size={40} />, title: 'Emergency Alerts', desc: 'Instant notifications to emergency services for critical cases' },
    { icon: <FaChartLine size={40} />, title: 'Real-time Analytics', desc: 'Live dashboard with patient tracking and statistics' },
    { icon: <FaShieldAlt size={40} />, title: 'HIPAA Compliant', desc: 'Enterprise-grade security and privacy protection' },
    { icon: <FaRocket size={40} />, title: 'Lightning Fast', desc: 'Results in under 30 seconds - critical for stroke treatment' }
  ];

  return (
    <section id="features" className="container mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-bold mb-4">
          Why Choose <span className="gradient-text">NeuroGuardian</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Advanced AI technology trusted by leading medical institutions worldwide
        </p>
      </motion.div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="glass-card p-8 text-center group cursor-pointer"
          >
            <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Stats = () => (
  <section id="stats" className="container mx-auto px-6 py-24">
    <div className="grid md:grid-cols-4 gap-6 md:items-start">
      {[
        { value: '98.3%', label: 'Accuracy', color: '#4CAF50' },
        { value: '30s', label: 'Analysis Time', color: '#2196f3' },
        { value: '500+', label: 'Hospitals', color: '#FF9800' },
        { value: '15k+', label: 'Lives Saved', color: '#f44336' }
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, type: 'spring' }}
          className="glass-card p-8 text-center"
          style={{ borderTop: `4px solid ${stat.color}` }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
            className="text-5xl font-bold mb-2 gradient-text"
          >
            {stat.value}
          </motion.div>
          <div className="text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

const Testimonials = () => (
  <section className="container mx-auto px-6 py-24">
    <motion.h2
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-5xl font-bold text-center mb-16"
    >
      Trusted by <span className="gradient-text">Medical Professionals</span>
    </motion.h2>
    
    <div className="grid md:grid-cols-3 gap-8">
      {[1, 2, 3].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-8"
        >
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 mr-1" />
            ))}
          </div>
          <p className="text-gray-300 mb-6">
            "This AI has revolutionized our stroke unit. We now diagnose in minutes instead of hours."
          </p>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <FaUserMd className="text-purple-400" />
            </div>
            <div className="ml-4">
              <h4 className="font-bold">Dr. Sarah Johnson</h4>
              <p className="text-sm text-gray-400">Chief of Neurology</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

const CTASection = () => (
  <section className="container mx-auto px-6 py-24">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-16 text-center relative overflow-hidden max-w-[800px] mx-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
      
      <h2 className="text-5xl font-bold mb-4 relative z-10">
        Ready to Save Lives?
      </h2>
      
      <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
        Join hundreds of hospitals already using NeuroGuardian to detect strokes faster.
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 justify-center relative z-10">
        <Link to="/register">
          <GlowingButton className="px-8 py-4 text-lg w-full md:w-auto flex justify-center items-center">
            Get Started Now <FaArrowRight className="inline ml-2" />
          </GlowingButton>
        </Link>
        
        <Link to="/contact">
          <button className="px-8 py-4 text-lg border border-white/20 rounded-lg hover:bg-white/10 transition w-full md:w-auto flex justify-center items-center">
            Contact Sales
          </button>
        </Link>
      </div>
      
      <div className="mt-8 text-sm text-gray-400 relative z-10">
        ✦ No credit card required ✦ Free 14-day trial ✦ 24/7 support
      </div>
    </motion.div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-white/10 py-12">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8 md:items-start">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <BrainIcon />
            <span className="text-xl font-bold">NeuroGuardian</span>
          </div>
          <p className="text-gray-400">
            AI-powered stroke detection saving lives through technology.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Product</h4>
          <ul className="space-y-2 text-gray-400 flex flex-col">
            <li><a href="#" className="hover:text-white transition">Features</a></li>
            <li><a href="#" className="hover:text-white transition">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition">API</a></li>
            <li><a href="#" className="hover:text-white transition">Documentation</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400 flex flex-col">
            <li><a href="#" className="hover:text-white transition">About</a></li>
            <li><a href="#" className="hover:text-white transition">Blog</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400 flex flex-col">
            <li><a href="#" className="hover:text-white transition">Privacy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms</a></li>
            <li><a href="#" className="hover:text-white transition">Security</a></li>
            <li><a href="#" className="hover:text-white transition">HIPAA</a></li>
          </ul>
        </div>
      </div>
      
      <div className="text-center text-gray-400 pt-8 border-t border-white/10">
        © 2026 NeuroGuardian AI. All rights reserved.
      </div>
    </div>
  </footer>
);

// ============================================
// MAIN COMPONENT
// ============================================

const LandingPage = () => {
  useEffect(() => {
    document.title = 'NeuroGuardian AI - Stroke Detection';
  }, []);

  return (
    <Container>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <CTASection />
      <Footer />
    </Container>
  );
};

export default LandingPage;