import { useState } from 'react';
import SitemapCrawler from './components/SitemapCrawler';
import SEOAudit from './components/SEOAudit';
import Results from './components/Results';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('sitemap');
  const [urls, setUrls] = useState([]);
  const [auditResults, setAuditResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSitemapCrawled = (crawledUrls) => {
    setUrls(crawledUrls);
    setActiveTab('audit');
  };

  const handleAuditComplete = (results) => {
    setAuditResults(results);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-altudo-gray-50">
      <header className="bg-white shadow-altudo border-b-2 border-altudo-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-altudo-black">SEO Audit Agent</h1>
              <span className="ml-3 inline-flex items-center px-3 py-1 rounded-altudo text-xs font-semibold bg-altudo-yellow text-altudo-black">
                by Altudo
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {urls.length > 0 && `${urls.length} URLs discovered`}
              </span>
              {auditResults.length > 0 && (
                <span className="text-sm text-altudo-yellow font-medium">
                  ✨ {auditResults.length} audits completed
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'sitemap', name: 'Sitemap Crawler', icon: '🗺️' },
              { id: 'audit', name: 'SEO Audit', icon: '🔍' },
              { id: 'results', name: 'Results', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-altudo-yellow text-altudo-black'
                    : 'border-transparent text-gray-500 hover:text-altudo-black hover:border-altudo-yellow/50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {tab.id === 'results' && auditResults.length > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-altudo-yellow text-altudo-black">
                    {auditResults.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'sitemap' && (
            <SitemapCrawler 
              onCrawlComplete={handleSitemapCrawled}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
          
          {activeTab === 'audit' && (
            <SEOAudit 
              urls={urls}
              onAuditComplete={handleAuditComplete}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
          
          {activeTab === 'results' && (
            <Results 
              results={auditResults}
              urls={urls}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;