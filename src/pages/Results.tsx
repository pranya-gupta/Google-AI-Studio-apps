import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Loader2,
  ArrowLeft,
  Info
} from 'lucide-react';
import { RecommendationRequest, Look } from '../types';
import { generateFashionRecommendations, generateLookImage } from '../services/gemini';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData as RecommendationRequest;

  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Consulting the Grimoire...');
  const [looks, setLooks] = useState<Look[]>([]);

  useEffect(() => {
    if (!formData) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingStatus('Consulting the Grimoire...');
        const generatedLooks = await generateFashionRecommendations(formData);
        setLooks(generatedLooks);
        
        setLoadingStatus('Visualizing your supernatural style...');
        const looksWithImages = await Promise.all(
          generatedLooks.map(async (look) => {
            const imageUrl = await generateLookImage(look, formData);
            return { ...look, imageUrl };
          })
        );
        
        setLooks(looksWithImages);
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert('The spirits are restless. Please try again.');
        navigate('/');
      }
    };

    fetchData();
  }, [formData, navigate]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="relative w-24 h-24 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-[#c5a059] rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#c5a059] animate-pulse" />
          </div>
        </div>
        <h2 className="serif text-3xl font-light mb-2">{loadingStatus}</h2>
        <p className="text-muted text-sm italic">The spirits are weaving your destiny...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium hover:text-[#c5a059] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Grimoire
        </button>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#c5a059]">Occasion</p>
          <p className="serif text-xl">{formData.occasion}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16">
        {looks.map((look, index) => (
          <motion.div
            key={look.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            {/* Image Section */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100 shadow-xl">
              {look.imageUrl ? (
                <img 
                  src={look.imageUrl} 
                  alt={look.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="text-xs uppercase tracking-widest">Visualizing...</p>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-sm">
                Look 0{index + 1}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h3 className="serif text-4xl mb-2">{look.name}</h3>
                <p className="text-muted text-sm leading-relaxed italic">
                  "{look.description}"
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-black/5 pb-2">The Ensemble</h4>
                
                <div className="space-y-3">
                  <ItemRow label="Topwear" item={look.topwear} />
                  <ItemRow label="Bottomwear" item={look.bottomwear} />
                  <ItemRow label="Layering" item={look.layering} />
                  <ItemRow label="Accessories" item={look.accessories} />
                  <ItemRow label="Shoes" item={look.shoes} />
                </div>
              </div>

              <div className="pt-4">
                <div className="bg-[#c5a059]/10 p-4 rounded-xl flex items-start gap-3">
                  <Info className="w-4 h-4 text-[#c5a059] mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#c5a059] mb-1">Stylist Note</p>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      This outfit captures the essence of {formData.character}'s {formData.era} era, perfectly balanced for a {formData.atmosphere} {formData.occasion}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-12">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xs uppercase tracking-widest font-bold text-muted hover:text-black transition-colors"
        >
          Back to Top
        </button>
      </div>
    </motion.div>
  );
}

function ItemRow({ label, item }: { label: string; item: { name: string; price: string } }) {
  return (
    <div className="flex justify-between items-end group">
      <div className="space-y-0.5">
        <p className="text-[9px] uppercase tracking-widest text-muted font-bold">{label}</p>
        <p className="text-sm font-medium group-hover:text-[#c5a059] transition-colors">{item.name}</p>
      </div>
      <div className="flex-1 border-b border-dotted border-black/10 mx-4 mb-1" />
      <p className="text-sm font-serif italic text-[#c5a059]">{item.price}</p>
    </div>
  );
}
