import { useState, useEffect } from 'react';
import axios from 'axios';

const SEOAudit = ({ urls, onAuditComplete, isLoading, setIsLoading }) => {
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [auditProgress, setAuditProgress] = useState({ current: 0, total: 0 });
  const [currentAuditing, setCurrentAuditing] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [singleUrl, setSingleUrl] = useState('');
  const [auditMode, setAuditMode] = useState('batch'); // 'batch' or 'single'

  useEffect(() => {
    if (urls && urls.length > 0) {
      setSelectedUrls(urls.slice(0, 10)); // Select first 10 by default
    }
  }, [urls]);

  const handleUrlSelection = (url, isSelected) => {
    if (isSelected) {
      setSelectedUrls([...selectedUrls, url]);
    } else {
      setSelectedUrls(selectedUrls.filter(u => u.loc !== url.loc));
    }
  };

  const handleSelectAll = () => {
    setSelectedUrls(urls);
  };

  const handleSelectNone = () => {
    setSelectedUrls([]);
  };

  const handleSingleAudit = async (e) => {
    e.preventDefault();
    
    if (!singleUrl.trim()) {
      setError('Please enter a URL to audit');
      return;
    }

    try {
      new URL(singleUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setResults([]);
    setCurrentAuditing(singleUrl);

    try {
      const response = await axios.post('/api/audit', {
        url: singleUrl.trim()
      });

      const auditResult = response.data;
      setResults([auditResult]);
      onAuditComplete([auditResult]);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to perform audit';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setCurrentAuditing('');
    }
  };

  const handleBatchAudit = async () => {
    if (selectedUrls.length === 0) {
      setError('Please select at least one URL to audit');
      return;
    }

    setIsLoading(true);
    setError('');
    setResults([]);
    setAuditProgress({ current: 0, total: selectedUrls.length });

    try {
      console.log('Starting batch audit with URLs:', selectedUrls);
      console.log('Selected URLs count:', selectedUrls.length);
      console.log('Current location:', window.location.href);
      
      // Test API connectivity first
      try {
        console.log('Testing API connectivity...');
        const testResponse = await axios.get('/api/test');
        console.log('API test response:', testResponse.data);
      } catch (testError) {
        console.error('API test failed:', testError);
        if (testError.response?.status === 404) {
          setError('API endpoints not available. Are you running in development mode? Try: npm run dev-full');
          return;
        }
      }
      
      // For serverless functions, we'll process batch audits differently
      // Since streaming may not work properly, we'll use a simpler approach
      console.log('Calling batch audit API...');
      const response = await axios.post('/api/batch-audit', {
        urls: selectedUrls
      });

      console.log('Full axios response:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = response.data;
      console.log('Batch audit response data:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys:', Object.keys(data || {}));
      
      if (data.results && data.results.length > 0) {
        // Transform results to match expected format
        const transformedResults = data.results.map(result => {
          if (result.status === 'success') {
            return result.audit; // Extract the audit data
          } else {
            // Handle error case - create a mock audit result
            return {
              url: result.url,
              score: 0,
              issues: [`Error: ${result.error}`],
              issuesWithResolutions: [],
              metrics: {},
              timestamp: new Date().toISOString(),
              auditMethod: 'error'
            };
          }
        });
        
        console.log('Transformed results:', transformedResults); // Debug log
        setResults(transformedResults);
        onAuditComplete(transformedResults);
        setAuditProgress({ current: data.processed || data.results.length, total: data.total || data.results.length });
      } else {
        console.error('No results received from batch audit. Response:', data);
        if (data.note) {
          setError(`Batch audit issue: ${data.note}`);
        } else {
          setError('No results received from batch audit. Please check the console for details.');
        }
      }
      return; // Skip the streaming code below
      
      const fetchResponse = await fetch('/api/batch-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: selectedUrls }),
      });

      // This streaming code is kept for potential future use
      const reader = fetchResponse.body.getReader();
      const decoder = new TextDecoder();
      let allResults = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.progress !== undefined) {
              setAuditProgress({ current: data.progress, total: data.total });
              allResults.push(...data.results);
              setResults([...allResults]);
            }
          } catch (e) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }

      onAuditComplete(allResults);
    } catch (err) {
      console.error('Batch audit error:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error response status:', err.response?.status);
      
      const errorMessage = err.response?.data?.error || err.message || 'Failed to perform batch audit';
      setError(`Batch audit failed: ${errorMessage}`);
      
      // Also log the full error details
      if (err.response) {
        console.error('Server responded with error:', err.response.status, err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Request setup error:', err.message);
      }
    } finally {
      setIsLoading(false);
      setAuditProgress({ current: 0, total: 0 });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Audit Mode Selector */}
      <div className="bg-white shadow-altudo rounded-altudo border-t-4 border-altudo-yellow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-altudo-black">SEO Audit</h2>
          <div className="mt-4">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={auditMode === 'single'}
                  onChange={() => setAuditMode('single')}
                  className="mr-2"
                  disabled={isLoading}
                />
                Single URL Audit
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={auditMode === 'batch'}
                  onChange={() => setAuditMode('batch')}
                  className="mr-2"
                  disabled={isLoading}
                />
                Batch Audit from Sitemap
              </label>
            </div>
          </div>
        </div>

        <div className="p-6">
          {auditMode === 'single' ? (
            <form onSubmit={handleSingleAudit} className="space-y-4">
              <div>
                <label htmlFor="single-url" className="block text-sm font-medium text-gray-700">
                  URL to Audit
                </label>
                <input
                  id="single-url"
                  type="url"
                  value={singleUrl}
                  onChange={(e) => setSingleUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-altudo-yellow focus:border-altudo-yellow"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-altudo-black bg-altudo-yellow hover:bg-altudo-yellow-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-altudo-yellow disabled:opacity-50"
              >
                {isLoading ? 'Auditing...' : 'Run SEO Audit'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {urls && urls.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Select URLs to audit ({selectedUrls.length} of {urls.length} selected)
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={handleSelectAll}
                        disabled={isLoading}
                        className="text-sm text-altudo-yellow hover:text-altudo-yellow-dark"
                      >
                        Select All
                      </button>
                      <button
                        onClick={handleSelectNone}
                        disabled={isLoading}
                        className="text-sm text-gray-600 hover:text-gray-500"
                      >
                        Select None
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {urls.map((url, index) => (
                        <label key={index} className="flex items-center p-2 hover:bg-white rounded">
                          <input
                            type="checkbox"
                            checked={selectedUrls.some(u => u.loc === url.loc)}
                            onChange={(e) => handleUrlSelection(url, e.target.checked)}
                            disabled={isLoading}
                            className="mr-3"
                          />
                          <span className="text-sm text-gray-700 flex-1 truncate">
                            {url.loc}
                          </span>
                          {url.priority && (
                            <span className="text-xs text-gray-500 ml-2">
                              Priority: {url.priority}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleBatchAudit}
                    disabled={isLoading || selectedUrls.length === 0}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-altudo-black bg-altudo-yellow hover:bg-altudo-yellow-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-altudo-yellow disabled:opacity-50"
                  >
                    {isLoading ? 'Running Audit...' : `Audit ${selectedUrls.length} URLs`}
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No URLs available. Please crawl a sitemap first.</p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {isLoading && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {auditMode === 'single' ? 'Auditing URL...' : 'Running batch audit...'}
                  </p>
                  {auditProgress.total > 0 && (
                    <div className="mt-2">
                      <div className="bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(auditProgress.current / auditProgress.total) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        {auditProgress.current} of {auditProgress.total} completed
                      </p>
                    </div>
                  )}
                  {currentAuditing && (
                    <p className="text-xs text-blue-700 mt-1 truncate">
                      Currently auditing: {currentAuditing}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Live Results Preview */}
          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Audit Results ({results.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.map((result, index) => {
                  // Handle both old and new result formats
                  const isSuccess = result.score !== undefined || result.status === 'success';
                  const auditData = result.audit || result;
                  const url = result.url || auditData.url;
                  
                  return (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm truncate flex-1 mr-4">
                          {url}
                        </h4>
                        {isSuccess && auditData.score !== undefined ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(auditData.score)}`}>
                            Score: {auditData.score}/100
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            Error
                          </span>
                        )}
                      </div>
                      {isSuccess && auditData.issues ? (
                        <div className="text-xs text-gray-600">
                          {auditData.issues.length > 0 ? (
                            <p>{auditData.issues.length} issues found</p>
                          ) : (
                            <p className="text-green-600">No issues found!</p>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-red-600">
                          {result.error || 'Unknown error occurred'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOAudit;