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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">SEO Audit Agent</h1>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                v1.0
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {urls.length > 0 && `${urls.length} URLs discovered`}
              </span>
              {auditResults.length > 0 && (
                <span className="text-sm text-green-600">
                  {auditResults.length} audits completed
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
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {tab.id === 'results' && auditResults.length > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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