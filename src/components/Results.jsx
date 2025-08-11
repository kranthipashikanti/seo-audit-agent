import { useState, useMemo } from 'react';
import { generateSEOAuditPDF } from '../utils/pdfExport';

const Results = ({ results, urls }) => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [sortBy, setSortBy] = useState('score');
  const [filterBy, setFilterBy] = useState('all');
  const [expandedSections, setExpandedSections] = useState({});

  // Handle both old and new result formats
  const successfulResults = results.filter(r => {
    // New format: results are audit objects directly
    if (r.url && r.score !== undefined) return true;
    // Old format: results have status and audit properties
    return r.status === 'success';
  }).map(r => {
    // Return audit data if it's in the old format, otherwise return the result directly
    return r.audit || r;
  });
  
  const failedResults = results.filter(r => r.status === 'error' || (r.auditMethod === 'error'));

  const sortedResults = useMemo(() => {
    let filtered = [...successfulResults];
    
    if (filterBy === 'good') {
      filtered = filtered.filter(r => r.score >= 80);
    } else if (filterBy === 'poor') {
      filtered = filtered.filter(r => r.score < 60);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'issues') return b.issues.length - a.issues.length;
      if (sortBy === 'loadTime') return (b.metrics.performance.loadTime || 0) - (a.metrics.performance.loadTime || 0);
      return a.url.localeCompare(b.url);
    });
  }, [successfulResults, sortBy, filterBy]);

  const summary = useMemo(() => {
    if (successfulResults.length === 0) return null;

    const avgScore = Math.round(successfulResults.reduce((sum, r) => sum + r.score, 0) / successfulResults.length);
    const goodPages = successfulResults.filter(r => r.score >= 80).length;
    const poorPages = successfulResults.filter(r => r.score < 60).length;
    const totalIssues = successfulResults.reduce((sum, r) => sum + r.issues.length, 0);
    const avgLoadTime = Math.round(successfulResults.reduce((sum, r) => sum + (r.metrics.performance.loadTime || 0), 0) / successfulResults.length);

    // Count issues by priority
    let criticalIssues = 0;
    let highIssues = 0;
    let mediumIssues = 0;

    successfulResults.forEach(result => {
      if (result.issuesWithResolutions) {
        result.issuesWithResolutions.forEach(issue => {
          if (issue.priority === 'critical') criticalIssues++;
          else if (issue.priority === 'high') highIssues++;
          else mediumIssues++;
        });
      }
    });

    return {
      avgScore,
      goodPages,
      poorPages,
      totalIssues,
      avgLoadTime,
      total: successfulResults.length,
      criticalIssues,
      highIssues,
      mediumIssues
    };
  }, [successfulResults]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-altudo-black bg-altudo-yellow/20';
    if (score >= 60) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBarColor = (score) => {
    if (score >= 80) return 'bg-altudo-yellow';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const exportPDFReport = () => {
    try {
      generateSEOAuditPDF(successfulResults, summary);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  const exportResults = () => {
    // Enhanced CSV with comprehensive data including resolutions
    const csvContent = [
      [
        'URL', 'Score', 'Grade', 'Total Issues', 'Critical Issues', 'High Priority Issues', 'Medium Priority Issues',
        'Title Content', 'Title Length', 'Meta Description Content', 'Meta Description Length',
        'H1 Count', 'H2 Count', 'H3 Count', 'Total Images', 'Images Without Alt', 'Alt Text Coverage (%)',
        'Load Time (ms)', 'Word Count', 'Audit Method',
        'Score Breakdown - On-Page SEO', 'Score Breakdown - Technical SEO', 'Score Breakdown - Content',
        'Score Breakdown - Images', 'Score Breakdown - User Experience', 'Score Breakdown - Advanced SEO',
        'Issues and Resolutions'
      ],
      ...successfulResults.map(result => {
        // Count issues by priority
        let criticalCount = 0;
        let highCount = 0;
        let mediumCount = 0;
        
        if (result.issuesWithResolutions) {
          result.issuesWithResolutions.forEach(issue => {
            if (issue.priority === 'critical') criticalCount++;
            else if (issue.priority === 'high') highCount++;
            else mediumCount++;
          });
        }

        // Format issues with resolutions for CSV
        const issuesWithResolutionsText = result.issuesWithResolutions ? 
          result.issuesWithResolutions.map(issueData => {
            const implementation = issueData.implementation ? issueData.implementation.join('; ') : '';
            return `ISSUE: ${issueData.issue} | PRIORITY: ${issueData.priority?.toUpperCase()} | CATEGORY: ${issueData.category} | SOLUTION: ${issueData.solution} | HOW TO FIX: ${implementation} | EXAMPLE: ${issueData.example || 'N/A'} | TIME TO FIX: ${issueData.timeToFix} | IMPACT: ${issueData.impact}`;
          }).join(' || ') : 
          (result.issues && result.issues.length > 0 ? result.issues.join('; ') : 'No issues found');

        return [
          result.url,
          result.score,
          result.grade || 'N/A',
          result.issues?.length || 0,
          criticalCount,
          highCount,
          mediumCount,
          `"${(result.metrics.title.content || 'No title').replace(/"/g, '""')}"`,
          result.metrics.title.length,
          `"${(result.metrics.metaDescription.content || 'No meta description').replace(/"/g, '""')}"`,
          result.metrics.metaDescription.length,
          result.metrics.headings.h1,
          result.metrics.headings.h2,
          result.metrics.headings.h3,
          result.metrics.images.total,
          result.metrics.images.withoutAlt,
          result.metrics.images.altTextCoverage,
          result.metrics.performance.loadTime,
          result.metrics.content.wordCount,
          result.auditMethod || 'N/A',
          result.scoreBreakdown?.onPage || 0,
          result.scoreBreakdown?.technical || 0,
          result.scoreBreakdown?.content || 0,
          result.scoreBreakdown?.images || 0,
          result.scoreBreakdown?.userExperience || 0,
          result.scoreBreakdown?.advanced || 0,
          `"${issuesWithResolutionsText.replace(/"/g, '""')}"`
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-audit-detailed-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-altudo-black">No results yet</h3>
          <p className="mt-1 text-sm text-gray-500">Run an SEO audit to see detailed results here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow-altudo rounded-altudo border-t-4 border-altudo-yellow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📊</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
                      <dd className="text-lg font-medium text-altudo-black">{summary.avgScore}/100</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-altudo rounded-altudo border-t-4 border-altudo-yellow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">✅</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Good Pages</dt>
                      <dd className="text-lg font-medium text-altudo-black">{summary.goodPages}/{summary.total}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-altudo rounded-altudo border-t-4 border-altudo-yellow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">⚠️</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Issues</dt>
                      <dd className="text-lg font-medium text-altudo-black">{summary.totalIssues}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-altudo rounded-altudo border-t-4 border-altudo-yellow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">⚡</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg Load Time</dt>
                      <dd className="text-lg font-medium text-altudo-black">{summary.avgLoadTime}ms</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Issues Summary */}
          {(summary.criticalIssues > 0 || summary.highIssues > 0 || summary.mediumIssues > 0) && (
            <div className="bg-white shadow-altudo rounded-altudo border-t-4 border-altudo-yellow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-altudo-black">Issues by Priority</h3>
                <p className="mt-1 text-sm text-gray-500">Focus on critical and high-priority issues first</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {summary.criticalIssues > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">!</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-red-800">Critical Issues</h4>
                          <p className="text-2xl font-bold text-red-900">{summary.criticalIssues}</p>
                          <p className="text-xs text-red-600">Fix immediately</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {summary.highIssues > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">⚡</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-orange-800">High Priority</h4>
                          <p className="text-2xl font-bold text-orange-900">{summary.highIssues}</p>
                          <p className="text-xs text-orange-600">Fix soon</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {summary.mediumIssues > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">•</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-yellow-800">Medium Priority</h4>
                          <p className="text-2xl font-bold text-yellow-900">{summary.mediumIssues}</p>
                          <p className="text-xs text-yellow-600">Fix when possible</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Results Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">SEO Audit Results</h2>
              <p className="mt-1 text-sm text-gray-500">
                {successfulResults.length} successful audits
                {failedResults.length > 0 && `, ${failedResults.length} failed`}
              </p>
            </div>
            <div className="flex space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1"
              >
                <option value="score">Sort by Score</option>
                <option value="issues">Sort by Issues</option>
                <option value="loadTime">Sort by Load Time</option>
                <option value="url">Sort by URL</option>
              </select>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1"
              >
                <option value="all">All Results</option>
                <option value="good">Good (80+)</option>
                <option value="poor">Poor (&lt;60)</option>
              </select>
              <button
                onClick={exportPDFReport}
                className="text-sm bg-altudo-yellow text-altudo-black px-3 py-1 rounded-md hover:bg-altudo-yellow-dark font-medium"
              >
                Export PDF Report
              </button>
              <button
                onClick={exportResults}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
              >
                Export CSV Data
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Load Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-1 min-w-0">
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-500 truncate block max-w-md"
                            title={result.url}
                          >
                            {result.url}
                          </a>
                          <p className="text-xs text-gray-500 truncate max-w-md" title={result.metrics.title.content}>
                            {result.metrics.title.content || 'No title'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(result.score)}`}>
                            {result.score}/100
                          </span>
                          {result.grade && (
                            <div className="text-xs text-gray-500 mt-1 text-center">
                              Grade {result.grade}
                            </div>
                          )}
                        </div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getScoreBarColor(result.score)}`}
                            style={{ width: `${result.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.issues.length === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.issues.length} issues
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.metrics.performance.loadTime}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedResult(selectedResult === result ? null : result)}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        {selectedResult === result ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Failed Results */}
      {failedResults.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-red-600">Failed Audits ({failedResults.length})</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {failedResults.map((result, index) => (
                <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium text-red-800">{result.url}</h4>
                      <div className="mt-1 text-sm text-red-700">{result.error}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Result Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Detailed SEO Report
              </h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-6">
              {/* URL and Score */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <a
                    href={selectedResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 font-medium break-all"
                  >
                    {selectedResult.url}
                  </a>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(selectedResult.score)}`}>
                      Score: {selectedResult.score}/100
                    </span>
                    {selectedResult.grade && (
                      <div className="mt-1 text-xs text-gray-600">
                        Grade: <span className="font-semibold">{selectedResult.grade}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              {selectedResult.scoreBreakdown && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">📊 Score Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">On-Page SEO</div>
                      <div className={`text-lg font-semibold ${
                        selectedResult.scoreBreakdown.onPage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedResult.scoreBreakdown.onPage > 0 ? '+' : ''}{selectedResult.scoreBreakdown.onPage}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Technical SEO</div>
                      <div className={`text-lg font-semibold ${
                        selectedResult.scoreBreakdown.technical >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedResult.scoreBreakdown.technical > 0 ? '+' : ''}{selectedResult.scoreBreakdown.technical}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Content</div>
                      <div className={`text-lg font-semibold ${
                        selectedResult.scoreBreakdown.content >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedResult.scoreBreakdown.content > 0 ? '+' : ''}{selectedResult.scoreBreakdown.content}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Images</div>
                      <div className={`text-lg font-semibold ${
                        selectedResult.scoreBreakdown.images >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedResult.scoreBreakdown.images > 0 ? '+' : ''}{selectedResult.scoreBreakdown.images}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">User Experience</div>
                      <div className={`text-lg font-semibold ${
                        selectedResult.scoreBreakdown.userExperience >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedResult.scoreBreakdown.userExperience > 0 ? '+' : ''}{selectedResult.scoreBreakdown.userExperience}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Advanced SEO</div>
                      <div className={`text-lg font-semibold ${
                        selectedResult.scoreBreakdown.advanced >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedResult.scoreBreakdown.advanced > 0 ? '+' : ''}{selectedResult.scoreBreakdown.advanced}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Base score: 70 points • Adjustments shown above • Total: {selectedResult.score}/100
                  </div>
                </div>
              )}

              {/* Issues with Resolutions */}
              {selectedResult.issuesWithResolutions && selectedResult.issuesWithResolutions.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection('issues')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-md font-medium text-red-600">
                      Issues & Solutions ({selectedResult.issuesWithResolutions.length})
                    </h4>
                    <svg
                      className={`h-5 w-5 transform ${expandedSections.issues ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.issues && (
                    <div className="mt-2 space-y-4">
                      {selectedResult.issuesWithResolutions.map((issueData, idx) => (
                        <div key={idx} className="border border-red-200 rounded-lg overflow-hidden">
                          {/* Issue Header */}
                          <div className="bg-red-50 px-4 py-3 border-b border-red-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  issueData.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                  issueData.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {issueData.priority?.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-500">{issueData.category}</span>
                              </div>
                              <span className="text-xs text-red-600">-{issueData.scoreImpact} points</span>
                            </div>
                            <h5 className="text-sm font-medium text-red-800 mt-1">{issueData.issue}</h5>
                          </div>

                          {/* Solution Content */}
                          <div className="bg-white p-4">
                            <div className="mb-3">
                              <h6 className="text-sm font-medium text-gray-900 mb-1">💡 Solution</h6>
                              <p className="text-sm text-gray-700">{issueData.solution}</p>
                            </div>

                            <div className="mb-3">
                              <h6 className="text-sm font-medium text-gray-900 mb-2">🔧 How to Fix</h6>
                              <ul className="text-sm text-gray-700 space-y-1">
                                {issueData.implementation?.map((step, stepIdx) => (
                                  <li key={stepIdx} className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {issueData.example && (
                              <div className="mb-3">
                                <h6 className="text-sm font-medium text-gray-900 mb-1">📋 Example</h6>
                                <code className="text-xs bg-gray-100 p-2 rounded block text-gray-800 overflow-x-auto">
                                  {issueData.example}
                                </code>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                              <span>⚡ Time to fix: {issueData.timeToFix}</span>
                              <span>📈 Impact: {issueData.impact}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Fallback for old format without resolutions */}
              {selectedResult.issues && selectedResult.issues.length > 0 && (!selectedResult.issuesWithResolutions || selectedResult.issuesWithResolutions.length === 0) && (
                <div>
                  <button
                    onClick={() => toggleSection('issues')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-md font-medium text-red-600">
                      Issues Found ({selectedResult.issues.length})
                    </h4>
                    <svg
                      className={`h-5 w-5 transform ${expandedSections.issues ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.issues && (
                    <div className="mt-2 space-y-2">
                      {selectedResult.issues.map((issue, idx) => (
                        <div key={idx} className="bg-red-50 border border-red-200 rounded p-3">
                          <p className="text-sm text-red-800">{issue}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SEO Metrics */}
              <div>
                <button
                  onClick={() => toggleSection('seo')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h4 className="text-md font-medium text-gray-900">SEO Metrics</h4>
                  <svg
                    className={`h-5 w-5 transform ${expandedSections.seo ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.seo && (
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded p-3">
                      <h5 className="font-medium text-gray-700">Title Tag</h5>
                      <p className="text-sm text-gray-600">
                        Length: {selectedResult.metrics.title.length} characters
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedResult.metrics.title.content || 'No title found'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <h5 className="font-medium text-gray-700">Meta Description</h5>
                      <p className="text-sm text-gray-600">
                        Length: {selectedResult.metrics.metaDescription.length} characters
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedResult.metrics.metaDescription.content || 'No meta description found'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <h5 className="font-medium text-gray-700">Headings</h5>
                      <div className="text-sm text-gray-600">
                        <div>H1: {selectedResult.metrics.headings.h1}</div>
                        <div>H2: {selectedResult.metrics.headings.h2}</div>
                        <div>H3: {selectedResult.metrics.headings.h3}</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <h5 className="font-medium text-gray-700">Images</h5>
                      <div className="text-sm text-gray-600">
                        <div>Total: {selectedResult.metrics.images.total}</div>
                        <div>Without Alt: {selectedResult.metrics.images.withoutAlt}</div>
                        <div>Alt Coverage: {selectedResult.metrics.images.altTextCoverage}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Performance */}
              <div>
                <button
                  onClick={() => toggleSection('performance')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h4 className="text-md font-medium text-gray-900">Performance</h4>
                  <svg
                    className={`h-5 w-5 transform ${expandedSections.performance ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.performance && (
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded p-3">
                      <h5 className="font-medium text-gray-700">Load Time</h5>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedResult.metrics.performance.loadTime}ms
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <h5 className="font-medium text-gray-700">Word Count</h5>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedResult.metrics.content.wordCount}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;