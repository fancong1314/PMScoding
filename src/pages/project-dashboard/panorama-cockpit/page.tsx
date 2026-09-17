import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import KpiCards from './components/KpiCards';
import MapSection from './components/MapSection';
import RightPanel from './components/RightPanel';
import BottomSection from './components/BottomSection';
import BottomTicker from './components/BottomTicker';

export default function PanoramaCockpitPage() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #040d1a 0%, #081426 50%, #0a1628 100%)' }}
    >
      {/* Top Title Bar */}
      <TopBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden px-2.5 py-1.5 gap-2" style={{ minHeight: 0 }}>
        {/* Upper Area: 3 columns */}
        <div className="flex gap-2 overflow-hidden" style={{ flex: '1.6', minHeight: 0 }}>
          {/* Left: 280px */}
          <LeftPanel />

          {/* Center: flex-1 */}
          <div className="flex-1 flex flex-col gap-2 min-w-0 overflow-hidden">
            <KpiCards />
            <MapSection />
          </div>

          {/* Right: 300px */}
          <RightPanel />
        </div>

        {/* Bottom Section */}
        <BottomSection />
      </div>

      {/* Bottom Ticker */}
      <BottomTicker />
    </div>
  );
}