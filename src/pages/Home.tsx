import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  Calendar, 
  Wind, 
  Ghost, 
  Users, 
  ChevronRight,
  Sparkles,
  Upload,
  X,
  Camera
} from 'lucide-react';
import { Gender, Era, Atmosphere, Character, RecommendationRequest } from '../types';

const GENDERS: Gender[] = ['male', 'female', 'others'];
const ERAS: Era[] = ['human', 'vampire', 'werewolf', 'hybrid', 'witch'];
const ATMOSPHERES: Atmosphere[] = ['summer', 'winter', 'rainy', 'spring', 'autumn'];
const CHARACTERS: Character[] = [
  'stefan', 'damon', 'elena', 'caroline', 'bonnie', 
  'katherine', 'klaus', 'elijah', 'rebekah', 'kol', 
  'hope', 'tyler', 'jeremy', 'alaric', 'matt'
];

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<RecommendationRequest>({
    occasion: '',
    age: '25',
    gender: 'female',
    era: 'human',
    character: 'elena',
    atmosphere: 'spring',
    userImage: undefined
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, userImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, userImage: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate('/results', { state: { formData } });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Image Upload Section */}
      <div className="space-y-4">
        <label className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
          <Camera className="w-3 h-3" /> Your Portrait (Optional)
        </label>
        <div 
          onClick={() => !formData.userImage && fileInputRef.current?.click()}
          className={`relative h-64 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
            formData.userImage 
            ? 'border-transparent' 
            : 'border-black/10 hover:border-[#c5a059]/50 bg-white/50'
          }`}
        >
          {formData.userImage ? (
            <>
              <img 
                src={formData.userImage} 
                alt="Upload preview" 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-[#c5a059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-[#c5a059]" />
              </div>
              <p className="text-sm font-medium mb-1">Upload your photo</p>
              <p className="text-xs text-muted">We'll try to put the outfits on you</p>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Occasion & Age */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Occasion
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Founders' Day Ball, Mystic Grill dinner"
              className="input-field"
              value={formData.occasion}
              onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
              <User className="w-3 h-3" /> Age
            </label>
            <input
              required
              type="number"
              className="input-field"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
              <Users className="w-3 h-3" /> Gender
            </label>
            <div className="flex gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`flex-1 py-2 rounded-lg text-sm capitalize transition-all ${
                    formData.gender === g 
                    ? 'bg-[#1a1a1a] text-white' 
                    : 'bg-white border border-black/10 hover:border-black/30'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Era, Character & Atmosphere */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
              <Ghost className="w-3 h-3" /> Era
            </label>
            <select
              className="input-field capitalize"
              value={formData.era}
              onChange={(e) => setFormData({ ...formData, era: e.target.value as Era })}
            >
              {ERAS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Character Inspiration
            </label>
            <select
              className="input-field capitalize"
              value={formData.character}
              onChange={(e) => setFormData({ ...formData, character: e.target.value as Character })}
            >
              {CHARACTERS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
              <Wind className="w-3 h-3" /> Atmosphere
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ATMOSPHERES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setFormData({ ...formData, atmosphere: a })}
                  className={`py-2 rounded-lg text-xs capitalize transition-all ${
                    formData.atmosphere === a 
                    ? 'bg-[#1a1a1a] text-white' 
                    : 'bg-white border border-black/10 hover:border-black/30'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-center">
        <button type="submit" className="btn-primary flex items-center gap-2 group">
          Generate Looks <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.form>
  );
}
