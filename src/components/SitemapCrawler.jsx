import { useState } from 'react';
import axios from 'axios';

const SitemapCrawler = ({ onCrawlComplete, isLoading, setIsLoading }) => {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [error, setError] = useState('');
  const [crawlResult, setCrawlResult] = useState(null);

  const handleCrawl = async (e) => {
    e.preventDefault();
    
    if (!sitemapUrl.trim()) {
      setError('Please enter a sitemap URL');
      return;
    }

    try {
      new URL(sitemapUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setCrawlResult(null);

    try {
      const response = await axios.post('/api/crawl-sitemap', {
        sitemapUrl: sitemapUrl.trim()
      });

      const { urls, total } = response.data;
      setCrawlResult({ urls, total });
      onCrawlComplete(urls);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to crawl sitemap';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const commonSitemaps = [
    'https://example.com/sitemap.xml',
    'https://example.com/sitemap_index.xml',
    'https://example.com/robots.txt'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Sitemap Crawler</h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter a sitemap URL to discover and extract all pages for SEO analysis
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleCrawl} className="space-y-4">
            <div>
              <label htmlFor="sitemap-url" className="block text-sm font-medium text-gray-700">
                Sitemap URL
              </label>
              <div className="mt-1">
                <input
                  id="sitemap-url"
                  type="url"
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  placeholder="https://example.com/sitemap.xml"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Common sitemap locations:</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {commonSitemaps.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSitemapUrl(url)}
                      disabled={isLoading}
                      className="text-xs text-blue-600 hover:text-blue-500 underline"
                    >
                      {url.split('/').pop()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-1 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Crawling sitemap... (may take 30-60s for large sites)
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Crawl Sitemap
                  </>
                )}
              </button>

              {crawlResult && (
                <div className="text-sm space-y-1">
                  <div className="text-green-600">
                    ✅ Found {crawlResult.total} URLs
                  </div>
                  {crawlResult.total >= 1000 && (
                    <div className="text-amber-600 text-xs">
                      ⚠️ Large sitemap detected. Showing first 1000 URLs for performance.
                    </div>
                  )}
                  {crawlResult.total > 0 && (
                    <div className="text-blue-600 text-xs">
                      💡 Select URLs below and switch to SEO Audit tab to begin analysis.
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          {crawlResult && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Discovered URLs ({crawlResult.total})</h3>
              <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {crawlResult.urls.slice(0, 50).map((url, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-white rounded border">
                      <div className="flex-1 min-w-0">
                        <a 
                          href={url.loc} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-500 truncate block"
                        >
                          {url.loc}
                        </a>
                        {url.lastmod && (
                          <p className="text-xs text-gray-500">
                            Last modified: {new Date(url.lastmod).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {url.priority && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Priority: {url.priority}
                        </span>
                      )}
                    </div>
                  ))}
                  {crawlResult.urls.length > 50 && (
                    <div className="text-center py-2 text-sm text-gray-500">
                      ... and {crawlResult.urls.length - 50} more URLs
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SitemapCrawler;