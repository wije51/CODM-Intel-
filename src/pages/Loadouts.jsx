import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import MotionWrapper from '../components/common/MotionWrapper'

const WEAPON_CATEGORIES = {
  'Assault Rifles': ['M13', 'Kilo 141', 'Man-O-War', 'DR-H', 'AK-47', 'Type 25', 'ICR-1', 'ASM10', 'M4', 'HBRa3', 'BK57', 'LK24', 'Peacekeeper MK2', 'CR-56 AMAX', 'FR .556', 'Oden', 'Krig 6', 'EM2'],
  'SMGs': ['CBR4', 'MAC-10', 'QQ9', 'Fennec', 'MSMC', 'QXR', 'GKS', 'Cordite', 'HG 40', 'Pharo', 'Razorback', 'PP19 Bizon', 'AGR 556', 'PPSh-41', 'MX9', 'Switchblade X9'],
  'Snipers': ['DL Q33', 'Locus', 'Arctic .50', 'Outlaw', 'Rytec AMR', 'SVD', 'Koshka', 'HDR', 'ZRG 20mm'],
  'LMGs': ['Holger 26', 'RPD', 'S36', 'UL736', 'Chopper', 'Hades', 'PKM', 'Dingo'],
  'Shotguns': ['KRM-262', 'BY15', 'HS0405', 'Echo', 'Striker', 'R9-0', 'JAK-12'],
  'Marksman': ['Kilo Bolt-Action', 'SKS', 'SPR 208', 'MK2', 'SVD'],
}

const ATTACHMENTS = {
  'Muzzle': ['OWC Light Suppressor', 'Monolithic Suppressor', 'Tactical Suppressor', 'MIP Light Flash Guard', 'OWC Marksman'],
  'Barrel': ['OWC Ranger', 'MIP Extended Light Barrel', 'OWC Marksman', 'YKM Integral Suppressor Light', 'MIP Light Barrel (Short)'],
  'Optic': ['Red Dot Sight 1', 'Holographic Sight 1', 'Tactical Scope', '3x Tactical Scope', 'Classic Red Dot Sight'],
  'Stock': ['No Stock', 'YKM Combat Stock', 'OWC Skeleton Stock', 'MIP Strike Stock', 'OWC Stable'],
  'Underbarrel': ['Operator Foregrip', 'Merc Foregrip', 'Ranger Foregrip', 'Strike Foregrip', 'Tactical Foregrip A'],
}

export default function Loadouts() {
  const { session, profile } = useStore()
  const [loadouts, setLoadouts] = useState([])
  const [showCreator, setShowCreator] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Assault Rifles')
  const [weapon, setWeapon] = useState('')
  const [attachments, setAttachments] = useState({ Muzzle: '', Barrel: '', Optic: '', Stock: '', Underbarrel: '' })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchLoadouts()
  }, [])

  const fetchLoadouts = async () => {
    const { data } = await supabase
      .from('loadouts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setLoadouts(data)
  }

  const saveLoadout = async () => {
    if (!weapon || !title) return alert('Select a weapon and add a title!')
    setIsSaving(true)

    const { error } = await supabase.from('loadouts').insert([{
      user_id: session.user.id,
      username: profile?.username || 'Operator',
      title,
      description,
      weapon,
      attachments: JSON.stringify(attachments),
    }])

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setShowCreator(false)
      setTitle('')
      setDescription('')
      setWeapon('')
      setAttachments({ Muzzle: '', Barrel: '', Optic: '', Stock: '', Underbarrel: '' })
      fetchLoadouts()
    }
    setIsSaving(false)
  }

  const buttonHover = {
    scale: 1.05,
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2)",
    transition: { duration: 0.2 }
  }

  return (
    <MotionWrapper className="space-y-6">
      <div className="flex items-end justify-between border-b border-gold/20 pb-4">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-white tracking-widest">
          LOADOUT ARMORY
        </h2>
        {session && (
          <motion.button
            whileHover={buttonHover}
            onClick={() => setShowCreator(!showCreator)}
            className="px-5 py-2.5 rounded bg-gold text-gunmetal-dark font-black tracking-wider hover:bg-gold-light transition-all duration-300 text-sm"
          >
            {showCreator ? '✕ CLOSE' : '+ NEW LOADOUT'}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showCreator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gunmetal-light/80 backdrop-blur-sm border border-gunmetal-dark rounded-xl p-6 space-y-5 overflow-hidden"
          >
            <div className="absolute right-4 top-4 w-32 h-32 bg-gold/5 blur-3xl rounded-full pointer-events-none"></div>

            <div>
              <label className="block text-sm font-mono text-gold-light mb-2 tracking-wider">LOADOUT TITLE</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1A1E22] border border-gunmetal-dark/80 rounded py-3 px-4 text-gray-100 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                placeholder="e.g. Ranked Push M13 Build" />
            </div>

            <div>
              <label className="block text-sm font-mono text-gold-light mb-2 tracking-wider">WEAPON CLASS</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(WEAPON_CATEGORIES).map((cat) => (
                  <button key={cat} onClick={() => { setSelectedCategory(cat); setWeapon('') }}
                    className={`px-3 py-1.5 rounded text-xs font-bold tracking-wider transition-all ${selectedCategory === cat ? 'bg-gold text-gunmetal-dark' : 'bg-gunmetal border border-gunmetal-dark text-gray-400 hover:border-gold/30'}`}>
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono text-gold-light mb-2 tracking-wider">SELECT WEAPON</label>
              <div className="flex flex-wrap gap-2">
                {WEAPON_CATEGORIES[selectedCategory].map((w) => (
                  <button key={w} onClick={() => setWeapon(w)}
                    className={`px-3 py-2 rounded text-sm font-mono transition-all ${weapon === w ? 'bg-gold text-gunmetal-dark font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'bg-[#1A1E22] border border-gunmetal-dark text-gray-300 hover:border-gold/40'}`}>
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(ATTACHMENTS).map(([slot, options]) => (
                <div key={slot}>
                  <label className="block text-xs font-mono text-gold-dark mb-1.5 tracking-wider">{slot.toUpperCase()}</label>
                  <select value={attachments[slot]} onChange={(e) => setAttachments({ ...attachments, [slot]: e.target.value })}
                    className="w-full bg-[#1A1E22] border border-gunmetal-dark/80 rounded py-2.5 px-3 text-gray-200 text-sm focus:outline-none focus:border-gold/50 transition-all">
                    <option value="">None</option>
                    {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-mono text-gold-light mb-2 tracking-wider">NOTES (OPTIONAL)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1A1E22] border border-gunmetal-dark/80 rounded py-3 px-4 text-gray-100 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all h-20 resize-none"
                placeholder="Why this build is good for ranked..." />
            </div>

            <motion.button 
              whileHover={buttonHover}
              onClick={saveLoadout} 
              disabled={isSaving}
              className="w-full py-3.5 bg-gold text-gunmetal-dark font-black tracking-widest rounded hover:bg-gold-light transition-all duration-300 disabled:opacity-50 border-b-4 border-gold-dark hover:border-b-2"
            >
              {isSaving ? 'DEPLOYING...' : 'DEPLOY LOADOUT'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loadout Feed */}
      <div className="space-y-4">
        {loadouts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-mono text-sm tracking-widest opacity-60">
            NO LOADOUTS DEPLOYED. BE THE FIRST OPERATOR.
          </div>
        ) : (
          loadouts.map((loadout, idx) => {
            const atts = (() => { try { return JSON.parse(loadout.attachments) } catch { return {} } })()
            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={loadout.id}
                className="bg-gunmetal-light/60 backdrop-blur-sm border border-gunmetal-dark rounded-xl p-5 hover:border-gold/20 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-100 group-hover:text-gold transition-colors">{loadout.title}</h3>
                    <p className="text-xs font-mono text-gold-dark mt-1">by {loadout.username} • {loadout.weapon}</p>
                  </div>
                  <span className="px-3 py-1 rounded bg-gold/10 text-gold text-xs font-bold border border-gold/20 tracking-wider">
                    {loadout.weapon}
                  </span>
                </div>
                {loadout.description && <p className="text-sm text-gray-400 mb-3">{loadout.description}</p>}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(atts).filter(([, v]) => v).map(([slot, val]) => (
                    <span key={slot} className="px-2.5 py-1 rounded bg-gunmetal border border-gunmetal-dark text-xs text-gray-300 font-mono">
                      <span className="text-gold-dark">{slot}:</span> {val}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </MotionWrapper>
  )
}
