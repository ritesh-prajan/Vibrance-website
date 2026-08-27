import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AmbientBlobs } from '../../components/common/AmbientBlobs';
import { GlitchText } from '../../components/common/GlitchText';

export const RegisterPage: React.FC = () => {
  const { loginAsStudent } = useFest();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year (B.Tech)');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regNumber.trim()) return;

    loginAsStudent(name, regNumber, department, year);
    navigate('/events', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#2A1D26] text-[#F3EDF2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <AmbientBlobs variant="login" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF3E41] to-[#DF367C] text-white font-display font-black text-xl shadow-lg mb-3"
        >
          V
        </motion.div>
        <GlitchText
          as="h1"
          className="text-3xl font-black text-white font-display tracking-wide"
          delay={50}
        >
          STUDENT REGISTRATION
        </GlitchText>
        <p className="mt-1 text-xs text-[#FF7099] font-mono">
          Vibrance 2026 Pass Reservation Account
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 relative z-10"
      >
        <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RA2111003010142"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  College Email
                </label>
                <input
                  type="email"
                  placeholder="student@vibrance.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/40 focus:outline-none focus:border-[#FF3E41]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3E41]"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Management Studies">Management Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-white/80 mb-1">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3E41]"
                >
                  <option value="1st Year (B.Tech)">1st Year (B.Tech)</option>
                  <option value="2nd Year (B.Tech)">2nd Year (B.Tech)</option>
                  <option value="3rd Year (B.Tech)">3rd Year (B.Tech)</option>
                  <option value="4th Year (B.Tech)">4th Year (B.Tech)</option>
                  <option value="Postgraduate / M.Tech">Postgraduate / M.Tech</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold font-mono text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Complete Registration &amp; Enter</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </form>

          <div className="pt-2 border-t border-white/10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Already registered? Back to Login</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
