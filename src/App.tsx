import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AddProject from './components/AddProject';
import ProjectsList from './components/ProjectsList';
import ShopPage from './components/ShopPage';

export default function App() {
  const [pinInput, setPinInput] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [lockedOut, setLockedOut] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const correctPin = '22443';
  const navigate = useNavigate();

  // Restore session
  useEffect(() => {
    const saved = sessionStorage.getItem('garage_auth');
    if (saved === 'true') setAuthorized(true);
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (lockedOut && cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (cooldown === 0 && lockedOut) {
      setLockedOut(false);
      setErrorCount(0);
    }
  }, [lockedOut, cooldown]);

  const handleNumberClick = (num: string) => {
    if (lockedOut) return;
    if (pinInput.length < 5) setPinInput((prev) => prev + num);
  };

  const handleClear = () => setPinInput('');

  const handleUnlock = () => {
    if (lockedOut || pinInput.length < 5) return;

    if (pinInput === correctPin) {
      setAuthorized(true);
      sessionStorage.setItem('garage_auth', 'true');
      navigate('/'); // go to projects page after unlock
    } else {
      const newErrors = errorCount + 1;
      setErrorCount(newErrors);
      setPinInput('');

      if (newErrors >= 3) {
        setLockedOut(true);
        setCooldown(30);
      }
    }
  };

  // --- UNAUTHORIZED VIEW ---
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse opacity-50"></div>

        <div className="bg-[#161c26] border border-[#2a313d] rounded-2xl p-10 w-[420px] shadow-2xl text-center relative">
          <h1 className="text-2xl font-bold tracking-widest mb-2">
            GARAGE ACCESS TERMINAL
          </h1>

          <p className="text-xs text-gray-500 mb-6">AUTHORIZATION REQUIRED</p>

          <div className="mb-6 bg-[#1b212c] border border-[#303845] rounded-lg py-3 tracking-widest text-lg">
            {pinInput.padEnd(5, '_')}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="bg-[#1b212c] border border-[#303845] py-3 rounded-lg font-bold hover:border-orange-500 hover:bg-[#222938] transition"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="bg-[#1b212c] border border-red-500 text-red-500 py-3 rounded-lg font-bold hover:bg-red-500 hover:text-black transition"
            >
              CLR
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="bg-[#1b212c] border border-[#303845] py-3 rounded-lg font-bold hover:border-orange-500 hover:bg-[#222938] transition"
            >
              0
            </button>
            <button
              onClick={handleUnlock}
              className="bg-orange-500 py-3 rounded-lg font-bold text-black hover:bg-red-600 transition shadow-lg shadow-orange-500/40"
            >
              ENTER
            </button>
          </div>

          {lockedOut && (
            <p className="text-red-500 animate-pulse">
              SYSTEM LOCKED — TRY AGAIN IN {cooldown}s
            </p>
          )}

          {!lockedOut && errorCount > 0 && (
            <p className="text-red-500 text-sm">INVALID PIN ({errorCount}/3)</p>
          )}
        </div>
      </div>
    );
  }

  // --- AUTHORIZED VIEW ---
  return (
    <div className="min-h-screen bg-[#0c0f14] text-gray-100 flex flex-col">
      <header className="bg-[#141821] border-b border-[#262d38] px-10 py-6 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-3xl font-bold tracking-widest">SHOP</h1>
          <p className="text-xs text-gray-500 mt-1">SHOP MANAGEMENT SYSTEM</p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-400">
            SYSTEM ONLINE | LOGGED IN AS SHOP OWNER
          </span>
        </div>
      </header>

      <div className="bg-[#10141b] border-b border-[#262d38] px-10 py-6 flex gap-6">
        <NavButton to="/" label="ACTIVE BUILDS" />
        <NavButton to="/add" label="NEW BUILD" />
        <NavButton to="/shop" label="PARTS" />
      </div>

      <main className="flex-1 p-12 bg-[#0f141c]">
        <div className="max-w-7xl mx-auto bg-[#161c26] border border-[#2a313d] rounded-2xl p-10 shadow-2xl">
          <Routes>
            <Route path="/" element={<ProjectsList />} />
            <Route path="/add" element={<AddProject onAdded={() => navigate('/')} />} />
            <Route path="/shop" element={<ShopPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// --- Navigation Button ---
function NavButton({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to}>
      <button className="px-8 py-4 rounded-lg font-bold tracking-wide transition-all duration-300 border bg-[#1b212c] border-[#303845] hover:border-red-500 hover:bg-[#222938]">
        {label}
      </button>
    </Link>
  );
}