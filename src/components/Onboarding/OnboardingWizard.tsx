import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Camera, Plus, Trash2, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import LocationSelector from './LocationSelector';
import { profileApi } from '../../services/api';

interface OnboardingWizardProps {
  initialUser: any;
  onComplete: (user: any) => void;
}

const SAMPLE_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
];

const GOAL_OPTIONS = [
  { id: 'dating', label: 'Jiddiy munosabat 💍', desc: 'Kelajak qurish va oila' },
  { id: 'chat', label: 'Suhbat va do\'stlik 💬', desc: 'Yangi qiziqarli insonlar' },
  { id: 'coffee', label: 'Birga kofe ichish ☕', desc: 'Samimiy uchrashuvlar' },
  { id: 'adventure', label: 'Sayohat va dam olish ✈️', desc: 'Birgalikda yangi joylar' },
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ initialUser, onComplete }) => {
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState(initialUser?.name || '');
  const [age, setAge] = useState<number | string>(initialUser?.age || 22);
  const [gender, setGender] = useState<'male' | 'female'>(initialUser?.gender || 'male');
  
  const [locationData, setLocationData] = useState<{
    republic: 'uzbekistan' | 'karakalpakstan';
    regionId: number;
    districtId: number;
    latitude?: number;
    longitude?: number;
  }>({
    republic: initialUser?.republic || 'uzbekistan',
    regionId: initialUser?.regionId || 10,
    districtId: initialUser?.districtId || 101,
    latitude: initialUser?.latitude,
    longitude: initialUser?.longitude,
  });

  const [photos, setPhotos] = useState<string[]>(
    initialUser?.photos && initialUser.photos.length > 0
      ? initialUser.photos
      : [SAMPLE_AVATARS[0], SAMPLE_AVATARS[1]]
  );

  const [bio, setBio] = useState(initialUser?.bio || '');
  const [jobTitle, setJobTitle] = useState(initialUser?.jobTitle || '');
  const [selectedGoal, setSelectedGoal] = useState('dating');

  const handleNext = () => {
    setErrorMsg('');

    // Step 1 validation
    if (step === 1) {
      if (!name.trim()) {
        setErrorMsg("Iltimos, ismingizni kiriting!");
        return;
      }
      const ageNum = Number(age);
      if (!ageNum || ageNum < 18) {
        setErrorMsg("Ilovadan foydalanish uchun yoshingiz kamida 18 da bo'lishi shart!");
        return;
      }
      if (ageNum > 70) {
        setErrorMsg("Iltimos, haqiqiy yoshingizni kiriting!");
        return;
      }
    }

    // Step 3 validation (Photos)
    if (step === 3) {
      if (photos.length < 2) {
        setErrorMsg("Profil faollashishi uchun kamida 2 ta fotosurat kerak!");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAddSamplePhoto = (url: string) => {
    if (photos.includes(url)) return;
    if (photos.length >= 4) {
      setErrorMsg("Ko'pi bilan 4 ta fotosurat yuklash mumkin.");
      return;
    }
    setPhotos([...photos, url]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (photos.length < 2) {
      setErrorMsg("Kamida 2 ta fotosurat tanlashingiz lozim!");
      setStep(3);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        age: Number(age),
        gender,
        ...locationData,
        photos,
        bio: bio.trim() || `Maqsadim: ${GOAL_OPTIONS.find(g => g.id === selectedGoal)?.label || 'Tanishuv'}`,
        jobTitle,
      };

      const res = await profileApi.updateProfile(payload);
      if (res.user) {
        onComplete(res.user);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-between max-w-md mx-auto p-4 sm:p-6 pb-8">
      {/* HEADER WITH PROGRESS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-gradient flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">Tanishuv UZ</h1>
              <p className="text-[11px] text-gray-400">Profilni to'ldirish</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300">
            {step} / 4 - qadam
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-purple-gradient"
            initial={{ width: '25%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* STEP CONTENTS */}
      <div className="flex-1 my-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-1">O'zingiz haqingizda</h2>
                <p className="text-xs text-gray-400">
                  Ismingiz va yoshingiz anketangizda boshqalarga ko'rinadi.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Ismingiz</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingizni kiriting"
                  className="w-full bg-[#18181b] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Yoshingiz (18+)</label>
                <input
                  type="number"
                  min="18"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Masalan: 23"
                  className="w-full bg-[#18181b] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  Xavfsizlik maqsadida 18 yoshdan kichiklar qabul qilinmaydi.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Jinsingiz</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-3.5 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      gender === 'male'
                        ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/30'
                        : 'bg-[#18181b] border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>Yigit (Erkak)</span> 🧔🏻‍♂️
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-3.5 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      gender === 'female'
                        ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/30'
                        : 'bg-[#18181b] border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>Qiz (Ayol)</span> 👩🏻
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LOCATION SELECTOR (COMPLEX LOGIC) */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Joylashuv ierarxiyasi</h2>
                <p className="text-xs text-gray-400">
                  Sizga eng yaqin joydagi munosib suhbatdoshlarni topish uchun joylashuvingizni belgilang.
                </p>
              </div>

              <LocationSelector
                republic={locationData.republic}
                regionId={locationData.regionId}
                districtId={locationData.districtId}
                latitude={locationData.latitude}
                longitude={locationData.longitude}
                onChange={setLocationData}
              />
            </motion.div>
          )}

          {/* STEP 3: PHOTOS UPLOAD (MIN 2, MAX 4) */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white mb-1">Suratlaringiz</h2>
                  <span className="text-xs text-purple-400 font-medium">{photos.length}/4 ta surat</span>
                </div>
                <p className="text-xs text-gray-400">
                  Kamida 2 ta fotosurat talab qilinadi. Aniq va chiroyli yuz suratlari ko'proq like to'playdi.
                </p>
              </div>

              {/* CURRENT SELECTED PHOTOS */}
              <div className="grid grid-cols-2 gap-3">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-purple-500/30 group">
                    <img src={p} alt="User" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-purple-600/90 text-[10px] font-bold px-2 py-0.5 rounded-md text-white backdrop-blur-sm">
                        Asosiy
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-red-400 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {photos.length < 4 && (
                  <div className="aspect-[4/5] rounded-2xl border-2 border-dashed border-gray-800 bg-[#16161a] flex flex-col items-center justify-center p-3 text-center">
                    <Camera className="w-6 h-6 text-gray-600 mb-1" />
                    <span className="text-[11px] text-gray-500">Surat qo'shish</span>
                  </div>
                )}
              </div>

              {/* PRESET SAMPLES PICKER */}
              <div className="pt-2">
                <span className="block text-xs font-semibold text-gray-400 mb-2">
                  Yoki tayyor avatarlardan tanlang:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {SAMPLE_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddSamplePhoto(url)}
                      className="w-12 h-12 rounded-xl overflow-hidden border border-gray-700 shrink-0 hover:border-purple-400 transition-colors relative"
                    >
                      <img src={url} alt="sample" className="w-full h-full object-cover" />
                      {photos.includes(url) && (
                        <div className="absolute inset-0 bg-purple-900/60 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: BIO & GOALS */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Maqsad va Qiziqishlar</h2>
                <p className="text-xs text-gray-400">
                  Ilovadan qanday maqsadda foydalanyapsiz va qanday kasb egasisiz?
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Tanishuv maqsadingiz</label>
                <div className="grid grid-cols-1 gap-2">
                  {GOAL_OPTIONS.map((g) => {
                    const isSelected = selectedGoal === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedGoal(g.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-purple-950/40 border-purple-500 text-white'
                            : 'bg-[#18181b] border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{g.label}</p>
                          <p className="text-[11px] text-gray-500">{g.desc}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Kasbingiz / O'qish joyingiz</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Masalan: Dasturchi, Talaba, Shifokor..."
                  className="w-full bg-[#18181b] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">O'zingiz haqingizda qisqacha (Bio)</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Qiziqishlaringiz, fe'l-atvoringiz haqida bir necha so'z yozing..."
                  className="w-full bg-[#18181b] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-4 flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="w-12 h-12 rounded-xl border border-gray-800 bg-[#18181b] text-gray-300 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 bg-purple-gradient hover:opacity-95 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all text-sm"
          >
            <span>Davom etish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-purple-gradient hover:opacity-95 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all text-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Saqlanmoqda..." : "Profilni yakunlash va boshlash"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
