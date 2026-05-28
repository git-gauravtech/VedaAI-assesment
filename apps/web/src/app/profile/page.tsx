'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Camera, User, BookOpen, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

function VedaAILogo() {
  return (
    <svg
      width="136"
      height="40"
      viewBox="19.7142 1.85519 134 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <rect
        x="19.7142"
        y="1.85519"
        width="40"
        height="40"
        rx="10"
        fill="url(#vedaBg)"
      />

      <g filter="url(#vedaShadow)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.4413 30.2153C42.4413 30.2153 43.1688 32.1573 43.8355 32.2789H35.4112C33.7141 32.2789 32.1993 31.3079 31.714 29.487L26.805 14.9207C26.805 14.9207 26.381 13.1606 25.7143 12.8571H34.3204C36.0175 12.9179 37.1691 13.5247 37.8357 15.7706L42.4413 30.2153Z"
          fill="white"
        />

        <path
          opacity="0.2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.4413 30.2153C42.4413 30.2153 43.1688 32.1573 43.8355 32.2789H35.4112C33.7141 32.2789 32.1993 31.3079 31.714 29.487L26.805 14.9207C26.805 14.9207 26.381 13.1606 25.7143 12.8571H34.3204C36.0175 12.9179 37.1691 13.5247 37.8357 15.7706L42.4413 30.2153Z"
          fill="url(#vedaVShade)"
        />

        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M37.0471 30.2149C37.0471 30.2149 36.3196 32.1569 35.6529 32.2784H44.0772C45.7743 32.2784 47.2891 31.3074 47.7744 29.4865L52.6231 14.9207C52.6231 14.9207 53.0471 13.1606 53.7138 12.8571H45.168C43.4709 12.8571 42.3801 13.464 41.7134 15.7098L37.0471 30.2149Z"
          fill="white"
        />
      </g>

      <text
        x="68"
        y="31"
        fontFamily='"Bricolage Grotesque", sans-serif'
        fontSize="28"
        fontWeight="700"
        letterSpacing="-0.06em"
        fill="#303030"
      >
        VedaAI
      </text>

      <defs>
        <linearGradient
          id="vedaBg"
          x1="39.7142"
          y1="1.85519"
          x2="39.7142"
          y2="41.8552"
        >
          <stop stopColor="#E56820" />
          <stop offset="1" stopColor="#D45E3E" />
        </linearGradient>

        <linearGradient
          id="vedaVShade"
          x1="34.7749"
          y1="11.2061"
          x2="34.7749"
          y2="33.9908"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.33" stopColor="white" stopOpacity="0" />
          <stop offset="0.76" stopColor="#0E1513" />
          <stop offset="1" stopColor="#0E1513" />
        </linearGradient>

        <filter
          id="vedaShadow"
          x="0"
          y="0"
          width="79.4281"
          height="70.8503"
          filterUnits="userSpaceOnUse"
        >
          <feDropShadow
            dx="0"
            dy="4.28571"
            stdDeviation="4.28571"
            floodOpacity="0.2"
          />
          <feDropShadow
            dx="0"
            dy="8.57143"
            stdDeviation="8.57143"
            floodOpacity="0.15"
          />
          <feDropShadow
            dx="0"
            dy="12.8571"
            stdDeviation="12.8571"
            floodOpacity="0.1"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    city: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        schoolName: user.schoolName || '',
        city: user.city || ''
      });
      setImagePreview(user.profileImage || null);
    }
  }, [user]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('schoolName', formData.schoolName);
      fd.append('city', formData.city);
      if (profileImage) {
        fd.append('profileImage', profileImage);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      updateUser(data.user);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-8 py-6 pb-24 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-1">
      Profile Settings
    </h1>

    <p className="text-sm text-gray-500">
      View and update your personal information.
    </p>
  </div>

  <VedaAILogo />
</div>
      <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-medium">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-32 h-32 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-orange-400 transition-all group overflow-hidden mb-3 shadow-sm"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-4xl font-bold text-orange-200">{formData.name.charAt(0).toUpperCase()}</span>
              )}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white mb-1" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            <p className="text-sm font-medium text-gray-500">{user.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User size={16} className="text-gray-400" />
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <BookOpen size={16} className="text-gray-400" />
                School Name
              </label>
              <input
                name="schoolName"
                type="text"
                required
                value={formData.schoolName}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} className="text-gray-400" />
                City
              </label>
              <input
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
