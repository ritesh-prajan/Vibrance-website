import React, { useState, useMemo } from 'react';
import { useFest } from '../../context/FestContext';
import { UserRole, UserProfile } from '../../types';
import {
  UserPlus,
  Trash2,
  Search,
  ShieldCheck,
  GraduationCap,
  Cpu,
  X,
  AlertTriangle,
  LogIn,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/common/GlassCard';

export const AdminUsersPage: React.FC = () => {
  const { users, addUser, deleteUser, loginAsGateStaff, loginAsStudent, loginAsAdmin } = useFest();
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('gate_staff');
  const [regNumber, setRegNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchQuery]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regNumber.trim()) return;

    addUser({
      name: name.trim(),
      role,
      regNumber: regNumber.trim(),
      department: department.trim() || (role === 'gate_staff' ? 'Main Gate Security Post' : 'General Campus'),
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@vibrance.edu`,
      year: year.trim() || (role === 'gate_staff' ? 'Gate Security Officer' : role === 'student' ? '1st Year' : 'System Admin'),
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (!deletingUser) return;
    deleteUser(deletingUser.id);
    setDeletingUser(null);
  };

  const handleImpersonate = (u: UserProfile) => {
    if (u.role === 'gate_staff') {
      loginAsGateStaff(u.name, u.regNumber, u.department);
      navigate('/verify');
    } else if (u.role === 'student') {
      loginAsStudent(u.name, u.regNumber, u.department, u.year);
      navigate('/events');
    } else {
      loginAsAdmin(u.name, u.regNumber, u.department);
      navigate('/admin');
    }
  };

  const resetForm = () => {
    setName('');
    setRole('gate_staff');
    setRegNumber('');
    setDepartment('');
    setEmail('');
    setYear('');
  };

  const getRoleIcon = (userRole: UserRole) => {
    switch (userRole) {
      case 'gate_staff':
        return <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />;
      case 'student':
        return <GraduationCap className="w-3.5 h-3.5 text-[#FF7099]" />;
      case 'admin':
        return <Cpu className="w-3.5 h-3.5 text-[#FF3E41]" />;
    }
  };

  const getRoleBadge = (userRole: UserRole) => {
    switch (userRole) {
      case 'gate_staff':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'student':
        return 'bg-[#FF3E41]/20 text-[#FF7099] border-[#FF3E41]/30';
      case 'admin':
        return 'bg-[#883955]/40 text-purple-300 border-[#883955]/60';
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#883955]/40 text-[#FF7099] border border-[#883955]/60">
              ACCESS CONTROL
            </span>
            <span className="text-xs text-white/50">Staff &amp; Attendee Identity Store</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            USERS &amp; GATE EMPLOYEE MANAGEMENT
          </h1>
        </div>

        <div>
          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3E41] to-[#DF367C] text-white text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer hover:opacity-90"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision New User / Staff</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <GlassCard variant="subtle" rounded="2xl" className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID/RegNo, department, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#2A1D26]/70 backdrop-blur-md border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#FF3E41]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#2A1D26]/70 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2 text-white/80 focus:outline-none focus:border-[#FF3E41]"
          >
            <option value="ALL">All Roles</option>
            <option value="gate_staff">Gate Staff / Security</option>
            <option value="student">Student Attendees</option>
            <option value="admin">System Administrators</option>
          </select>
          <span className="text-white/40 px-2 font-mono">Total: {filteredUsers.length}</span>
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard variant="default" rounded="3xl" className="p-6 sm:p-8 overflow-x-auto space-y-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase font-mono">
              <th className="pb-3 pr-4">User Details</th>
              <th className="pb-3 px-4">Role</th>
              <th className="pb-3 px-4">Identifier / Reg Number</th>
              <th className="pb-3 px-4">Department / Post</th>
              <th className="pb-3 px-4">Email</th>
              <th className="pb-3 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2A1D26] border border-white/15 flex items-center justify-center font-bold text-white text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{u.name}</div>
                      {u.year && <div className="text-[10px] text-white/40">{u.year}</div>}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] uppercase font-bold ${getRoleBadge(u.role)}`}>
                    {getRoleIcon(u.role)}
                    <span>{u.role.replace('_', ' ')}</span>
                  </span>
                </td>
                <td className="py-4 px-4 font-bold text-white font-mono">
                  {u.regNumber}
                </td>
                <td className="py-4 px-4 text-white/70">
                  {u.department}
                </td>
                <td className="py-4 px-4 text-white/50 text-[11px] font-mono">
                  {u.email}
                </td>
                <td className="py-4 pl-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleImpersonate(u)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                      title="Switch / Test Login as this User"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#FF7099]" />
                      <span>Test Login</span>
                    </button>
                    <button
                      onClick={() => setDeletingUser(u)}
                      className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors cursor-pointer"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-white/40 flex flex-col items-center gap-2 font-mono">
            <Users className="w-8 h-8 text-white/20" />
            <span>No users found matching your search.</span>
          </div>
        )}
      </GlassCard>

      {/* Provision User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <GlassCard variant="default" rounded="3xl" glowColor="#FF3E41" className="p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-display">
                PROVISION NEW USER / GATE STAFF
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Account Role *</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF3E41]"
                >
                  <option value="gate_staff">Gate Staff / Security Personnel</option>
                  <option value="student">Student Attendee</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder={role === 'gate_staff' ? 'e.g. Officer Suresh Kumar' : 'e.g. Aditi Roy'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#FF3E41]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">
                    {role === 'gate_staff' ? 'Staff Badge ID *' : role === 'student' ? 'Registration No *' : 'Employee ID *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={role === 'gate_staff' ? 'e.g. STF-GATE-12' : role === 'student' ? 'e.g. 22BCE2044' : 'e.g. FAC-DBMS-01'}
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#FF3E41]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Designation / Year</label>
                  <input
                    type="text"
                    placeholder={role === 'gate_staff' ? 'e.g. Gate Lead Post B' : role === 'student' ? 'e.g. 3rd Year (B.Tech)' : 'e.g. Systems Lead'}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#FF3E41]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Department / Gate Station</label>
                <input
                  type="text"
                  placeholder={role === 'gate_staff' ? 'e.g. North Amphitheatre Gate' : 'e.g. SCOPE / Computer Science'}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#FF3E41]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. user@vibrance.edu (auto-generated if blank)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#FF3E41]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3E41] to-[#DF367C] text-white font-bold cursor-pointer shadow-lg"
                >
                  Provision User
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard variant="danger" rounded="3xl" glowColor="#ef4444" className="p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">DELETE USER ACCOUNT</h3>
                <p className="text-[11px] text-red-300">Deprovision account access</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#2A1D26]/70 border border-white/10 space-y-2 text-xs">
              <div className="font-bold text-white text-sm">{deletingUser.name}</div>
              <div className="text-white/60">{deletingUser.role.toUpperCase()} &bull; {deletingUser.regNumber}</div>
              <div className="text-white/40 text-[11px] font-mono">{deletingUser.department}</div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Deprovision</span>
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
