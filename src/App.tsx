import { useState, useEffect, useCallback } from 'react';
import { 
  ActiveSection, 
  Match, 
  Competition, 
  StandingTeamData, 
  NewsItem, 
  TransferItem, 
  SystemStatus 
} from './types/sports';
import { api } from './services/api';
import { Header } from './components/Header';
import { ApiStatusBanner } from './components/ApiStatusBanner';
import { Footer } from './components/Footer';
import { MatchDetailModal } from './components/MatchDetailModal';

// Views
import { HomeView } from './views/HomeView';
import { MatchesView } from './views/MatchesView';
import { CompetitionsView } from './views/CompetitionsView';
import { StandingsView } from './views/StandingsView';
import { NewsView } from './views/NewsView';
import { TransfersView } from './views/TransfersView';
import { AboutView } from './views/AboutView';

export function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('inicio');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Sports & News Data
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [todayMatches, setTodayMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [featuredCompetition, setFeaturedCompetition] = useState<Competition | null>(null);
  const [featuredStandings, setFeaturedStandings] = useState<StandingTeamData[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [latestTransfers, setLatestTransfers] = useState<TransferItem[]>([]);

  // Metadata
  const [lastStandingsUpdate, setLastStandingsUpdate] = useState<string>('');
  const [standingsSource, setStandingsSource] = useState<string>('Oficial');

  // Modals
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Initial Boot & System Status
  useEffect(() => {
    api.getStatus().then(setSystemStatus).catch(() => {});

    // Load competitions catalog
    api.getCompetitions().then((res) => {
      setCompetitions(res.competitions || []);
      if (res.competitions?.length > 0) {
        setFeaturedCompetition(res.competitions[0]);
      }
    }).catch(() => {});

    // Load initial news and transfers
    api.getNews('all', 6).then((res) => {
      setLatestNews(res.articles || []);
    }).catch(() => {});

    api.getTransfers().then((res) => {
      setLatestTransfers(res.transfers || []);
    }).catch(() => {});
  }, []);

  // Polling for Live & Today Matches
  const refreshMatches = useCallback(async () => {
    try {
      const [liveRes, todayRes] = await Promise.all([
        api.getLiveMatches(),
        api.getMatches(),
      ]);
      setLiveMatches(liveRes.matches || []);
      setTodayMatches(todayRes.matches || []);
    } catch {
      // Keep existing state on transient failure
    }
  }, []);

  useEffect(() => {
    refreshMatches();

    // Dynamically adjust interval: 45s if live games present, 300s if idle
    const intervalTime = liveMatches.length > 0 ? 45000 : 300000;
    const timer = setInterval(refreshMatches, intervalTime);
    return () => clearInterval(timer);
  }, [refreshMatches, liveMatches.length]);

  // Load featured standings when featured competition changes
  useEffect(() => {
    if (!featuredCompetition) return;

    api.getStandings(featuredCompetition.id, featuredCompetition.currentSeason)
      .then((res) => {
        if (res.standings?.league?.standings?.[0]) {
          setFeaturedStandings(res.standings.league.standings[0]);
        } else {
          setFeaturedStandings([]);
        }
        setLastStandingsUpdate(res.lastUpdated || '');
        setStandingsSource(res.source || 'API-Sports');
      })
      .catch(() => {
        setFeaturedStandings([]);
      });
  }, [featuredCompetition]);

  const handleNavigate = (section: ActiveSection, meta?: any) => {
    setActiveSection(section);
    if (meta?.competitionId && competitions.length > 0) {
      const found = competitions.find((c) => c.id === meta.competitionId);
      if (found) {
        setFeaturedCompetition(found);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e6f7fa] text-slate-800 font-sans">
      {/* 1. Transparent API & Cache Status Bar */}
      <ApiStatusBanner
        status={systemStatus}
        lastUpdated={lastStandingsUpdate}
        sourceLabel={standingsSource}
      />

      {/* 2. Top Header with Brand, Slogan, Search & Navigation */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        liveCount={liveMatches.length}
      />

      {/* 3. Main Content Container matching original white canvas */}
      <main className="w-full max-w-6xl mx-auto p-3 sm:p-6 flex-1 flex flex-col">
        {activeSection === 'inicio' && (
          <HomeView
            liveMatches={liveMatches}
            todayMatches={todayMatches}
            featuredCompetitions={competitions}
            currentCompetition={featuredCompetition || competitions[0] || {
              id: 71,
              name: 'Brasileirão Série A',
              shortName: 'Série A',
              country: 'Brasil',
              code: 'BSA',
              type: 'League',
              currentSeason: 2024,
              logo: '',
              region: 'Brasil',
              priority: 1,
            }}
            currentStandings={featuredStandings}
            latestNews={latestNews}
            latestTransfers={latestTransfers}
            onSelectMatch={setSelectedMatch}
            onNavigate={handleNavigate}
            onSelectCompetition={(comp) => setFeaturedCompetition(comp)}
            footballConfigured={systemStatus?.footballConfigured ?? false}
            lastUpdated={lastStandingsUpdate}
            sourceLabel={standingsSource}
          />
        )}

        {activeSection === 'jogos' && (
          <MatchesView
            competitions={competitions}
            onSelectMatch={setSelectedMatch}
            footballConfigured={systemStatus?.footballConfigured ?? false}
          />
        )}

        {activeSection === 'competicoes' && (
          <CompetitionsView
            competitions={competitions}
            onSelectCompetition={(comp) => setFeaturedCompetition(comp)}
            onNavigate={handleNavigate}
          />
        )}

        {activeSection === 'classificacoes' && (
          <StandingsView
            competitions={competitions.length > 0 ? competitions : [
              {
                id: 71,
                name: 'Brasileirão Série A',
                shortName: 'Série A',
                country: 'Brasil',
                code: 'BSA',
                type: 'League',
                currentSeason: 2024,
                logo: '',
                region: 'Brasil',
                priority: 1,
              }
            ]}
            initialCompetition={featuredCompetition || undefined}
            footballConfigured={systemStatus?.footballConfigured ?? false}
          />
        )}

        {activeSection === 'noticias' && <NewsView />}

        {activeSection === 'transferencias' && <TransfersView />}

        {activeSection === 'sobre' && <AboutView />}
      </main>

      {/* 4. Footer */}
      <Footer
        onNavigate={handleNavigate}
        serverTime={systemStatus?.serverTime}
      />

      {/* 5. Match Detail Modal */}
      <MatchDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
}

export default App;
