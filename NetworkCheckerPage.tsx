import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import StatusIndicator from '../StatusIndicator';
import { 
  GlobeIcon, WifiIcon, RefreshIcon, SpeedometerIcon, DesktopComputerIcon, ShieldCheckIcon,
  CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon, ClipboardListIcon 
} from '../icons';

interface NetworkCheckerPageProps {
  onLogout: () => void;
}

interface IpifyResponse {
  ip: string;
}

const IpAddressDisplay: React.FC<{ isLoading: boolean; error: string | null; ipAddress: string | null; }> = ({ isLoading, error, ipAddress }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  if (error) return <p className="text-red-500 dark:text-red-400 text-sm font-medium">{error}</p>;
  if (ipAddress) return <p className="text-2xl font-mono text-gray-800 dark:text-gray-200 tracking-wider">{ipAddress}</p>;
  return null;
};

const TEST_FILE_URL = 'https://sabnzbd.org/tests/internetspeed/10MB.bin';
const FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const SpeedTest: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [speedMbps, setSpeedMbps] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestSpeed = async () => {
    if (!isOnline) {
      setError('Cannot run test while offline.');
      return;
    }
    setIsTesting(true);
    setSpeedMbps(null);
    setError(null);
    const startTime = Date.now();
    try {
      const response = await fetch(`${TEST_FILE_URL}?t=${startTime}`);
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      await response.blob();
      const endTime = Date.now();
      const durationSeconds = (endTime - startTime) / 1000;
      if (durationSeconds < 0.1) {
         setError('Connection too fast to measure reliably.');
         setSpeedMbps(null);
      } else {
        const bitsLoaded = FILE_SIZE_BYTES * 8;
        const bps = bitsLoaded / durationSeconds;
        const mbps = bps / 1_000_000;
        setSpeedMbps(mbps);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      console.error('Speed test failed:', errorMessage);
      setError('Test failed. Please try again.');
    } finally {
      setIsTesting(false);
    }
  };

  const SpeedDisplay = () => {
    if (isTesting) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-blue-500"></div>
          <p className="text-lg text-gray-500 dark:text-gray-400">Testing...</p>
        </div>
      );
    }
    if (error) return <p className="text-red-500 dark:text-red-400 text-sm font-medium">{error}</p>;
    if (speedMbps !== null) {
      return (
        <p className="text-2xl font-mono text-gray-800 dark:text-gray-200 tracking-wider">
          {speedMbps.toFixed(2)} <span className="text-lg text-gray-500 dark:text-gray-400">Mbps</span>
        </p>
      );
    }
    return <p className="text-gray-500 dark:text-gray-400">Run test to see download speed.</p>;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <SpeedometerIcon className="w-8 h-8 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Download Speed</h2>
        </div>
        <button
            onClick={handleTestSpeed}
            disabled={isTesting || !isOnline}
            className="px-4 py-2 bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-lg hover:bg-blue-600/20 dark:hover:bg-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? 'Running...' : 'Run Test'}
          </button>
      </div>
      <div className="pl-12 min-h-[2.5rem] flex items-center">
        <SpeedDisplay />
      </div>
    </div>
  );
};

const UserAgentChecker: React.FC = () => {
  const [userAgentInfo, setUserAgentInfo] = useState<{ browser: string; os: string; fullString: string; } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';
    if (ua.includes('Firefox/')) browser = `Firefox ${ua.split('Firefox/')[1].split(' ')[0]}`;
    else if (ua.includes('Edg/')) browser = `Edge ${ua.split('Edg/')[1].split(' ')[0]}`;
    else if (ua.includes('Chrome/') && !ua.includes('Chromium/')) browser = `Chrome ${ua.split('Chrome/')[1].split(' ')[0]}`;
    else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
      const versionMatch = ua.match(/Version\/([\d.]+)/);
      browser = `Safari ${versionMatch ? versionMatch[1] : ua.split('Safari/')[1].split(' ')[0]}`;
    }
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    setUserAgentInfo({ browser, os, fullString: ua });
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <DesktopComputerIcon className="w-8 h-8 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Browser & System Info</h2>
      </div>
      <div className="pl-12 space-y-3">
        {userAgentInfo ? (
          <>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Browser & Version</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{userAgentInfo.browser}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Operating System</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{userAgentInfo.os}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Full User-Agent String</p>
              <p className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all">{userAgentInfo.fullString}</p>
            </div>
          </>
        ) : <p className="text-gray-500 dark:text-gray-400">Loading system info...</p>}
      </div>
    </div>
  );
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SecurityChecker: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  const [isSafeMode, setIsSafeMode] = useState(false);
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ status: 'idle' | 'safe' | 'unsafe' | 'unknown' | 'error'; message: string } | null>(null);

  const handleDomainCheck = async () => {
    if (!domain || !isOnline) {
        setCheckResult({ status: 'error', message: 'Please enter a domain and ensure you are online.' });
        return;
    }
    setIsChecking(true);
    setCheckResult(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the domain: ${domain}. Based on your knowledge, is it generally considered safe, malicious (e.g., phishing, malware), or primarily used for advertising/tracking?`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              domain: { type: Type.STRING },
              classification: {
                type: Type.STRING,
                enum: ["safe", "malicious", "adware/tracker", "unknown"]
              },
              reason: {
                type: Type.STRING,
                description: "A brief explanation for the classification."
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text);
      if (result.classification === 'safe') {
        setCheckResult({ status: 'safe', message: result.reason });
      } else if (result.classification === 'malicious' || result.classification === 'adware/tracker') {
        setCheckResult({ status: 'unsafe', message: result.reason });
      } else {
        setCheckResult({ status: 'unknown', message: result.reason });
      }
    } catch (e) {
      console.error("Domain check failed:", e);
      setCheckResult({ status: 'error', message: 'Could not analyze domain. The API may be unavailable.' });
    } finally {
      setIsChecking(false);
    }
  };

  const ResultIcon = () => {
    if (!checkResult) return null;
    switch (checkResult.status) {
      case 'safe': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'unsafe': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'unknown': return <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <ShieldCheckIcon className="w-8 h-8 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Security Check</h2>
      </div>
      <div className="pl-12 space-y-6">
        <div className="flex items-center justify-between">
          <label htmlFor="safe-mode-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Safe Browsing Mode</label>
          <button
            id="safe-mode-toggle"
            role="switch"
            aria-checked={isSafeMode}
            onClick={() => setIsSafeMode(!isSafeMode)}
            className={`${isSafeMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:ring-offset-gray-800`}
          >
            <span className={`${isSafeMode ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
          </button>
        </div>
        <div className="space-y-2">
           <label htmlFor="domain-check" className="text-sm font-medium text-gray-700 dark:text-gray-300">Anti-Ad/Malicious DNS Check</label>
           <div className="flex space-x-2">
            <input
              type="text"
              id="domain-check"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., example.com"
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-3 text-gray-800 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
            />
            <button
              onClick={handleDomainCheck}
              disabled={isChecking || !isOnline}
              className="px-4 py-1.5 bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-lg hover:bg-blue-600/20 dark:hover:bg-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isChecking ? (
                <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-current"></div>
              ) : 'Check'}
            </button>
           </div>
           {checkResult && (
             <div className="flex items-start space-x-2 pt-2">
                <div className="flex-shrink-0"><ResultIcon /></div>
                <p className={`text-xs ${
                    checkResult.status === 'error' ? 'text-red-500 dark:text-red-400' : 
                    checkResult.status === 'safe' ? 'text-green-600 dark:text-green-400' :
                    'text-gray-500 dark:text-gray-400'
                }`}>
                    {checkResult.message}
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}

const ChongLuaDaoChecker: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ status: 'idle' | 'safe' | 'scam' | 'unknown' | 'error'; message: string } | null>(null);

  const handleUrlCheck = async () => {
    if (!url || !isOnline) {
      setCheckResult({ status: 'error', message: 'Please enter a URL and ensure you are online.' });
      return;
    }
    setIsChecking(true);
    setCheckResult(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the following URL: ${url}. Considering common online scam tactics prevalent in Vietnam (e.g., fake e-commerce sites, job scams, government impersonation), determine if this URL is likely a scam.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              classification: {
                type: Type.STRING,
                enum: ["safe", "scam", "unknown"]
              },
              reason: {
                type: Type.STRING,
                description: "A brief explanation for the classification in Vietnamese."
              }
            }
          }
        }
      });
      
      const result = JSON.parse(response.text);
      if (result.classification === 'safe') {
        setCheckResult({ status: 'safe', message: result.reason });
      } else if (result.classification === 'scam') {
        setCheckResult({ status: 'scam', message: result.reason });
      } else {
        setCheckResult({ status: 'unknown', message: result.reason });
      }

    } catch (e) {
      console.error("URL check failed:", e);
      setCheckResult({ status: 'error', message: 'Could not analyze URL. The API may be unavailable or the URL is invalid.' });
    } finally {
      setIsChecking(false);
    }
  };
  
  const ResultIcon = () => {
    if (!checkResult) return null;
    switch (checkResult.status) {
      case 'safe': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'scam': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'unknown': return <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  return (
     <div className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <ClipboardListIcon className="w-8 h-8 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Vietnamese Scam Check</h2>
      </div>
      <div className="pl-12 space-y-2">
         <label htmlFor="url-check" className="text-sm font-medium text-gray-700 dark:text-gray-300">Analyze URL (chongluadao.vn)</label>
         <div className="flex space-x-2">
          <input
            type="text"
            id="url-check"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g., https://suspicious-site.vn"
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-3 text-gray-800 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
          />
          <button
            onClick={handleUrlCheck}
            disabled={isChecking || !isOnline}
            className="px-4 py-1.5 bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-lg hover:bg-blue-600/20 dark:hover:bg-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isChecking ? (
              <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-current"></div>
            ) : 'Check'}
          </button>
         </div>
         {checkResult && (
           <div className="flex items-start space-x-2 pt-2">
              <div className="flex-shrink-0"><ResultIcon /></div>
              <p className={`text-xs ${
                  checkResult.status === 'error' || checkResult.status === 'scam' ? 'text-red-500 dark:text-red-400' : 
                  checkResult.status === 'safe' ? 'text-green-600 dark:text-green-400' :
                  'text-gray-500 dark:text-gray-400'
              }`}>
                  {checkResult.message}
              </p>
           </div>
         )}
      </div>
    </div>
  )
}


export const NetworkCheckerPage: React.FC<NetworkCheckerPageProps> = ({ onLogout }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIpAddress = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: IpifyResponse = await response.json();
      setIpAddress(data.ip);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      console.error("Failed to fetch IP address:", errorMessage);
      setError('Could not fetch IP. Service may be unavailable.');
      setIpAddress(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); fetchIpAddress(); };
    const handleOffline = () => {
      setIsOnline(false);
      setIpAddress(null);
      setError('You are offline. IP cannot be determined.');
      setIsLoading(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if (navigator.onLine) fetchIpAddress(); else handleOffline();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchIpAddress]);

  return (
    <div className="w-full max-w-md mx-auto">
      <header className="text-center mb-8 relative">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Network Tools</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Your real-time network status and performance.</p>
        <button
          onClick={onLogout}
          className="absolute top-0 right-0 text-sm text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
        >
          Logout
        </button>
      </header>

      <main className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm divide-y divide-gray-200 dark:divide-gray-700">
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <WifiIcon className="w-8 h-8 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Network Connection</h2>
          </div>
          <StatusIndicator isOnline={isOnline} />
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center space-x-4">
              <GlobeIcon className="w-8 h-8 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Public IP Address</h2>
            </div>
            <button
              onClick={fetchIpAddress}
              disabled={isLoading || !isOnline}
              aria-label="Refresh IP Address"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="pl-12 min-h-[2.5rem] flex items-center">
            <IpAddressDisplay isLoading={isLoading} error={error} ipAddress={ipAddress} />
          </div>
        </div>
        
        <SecurityChecker isOnline={isOnline} />

        <ChongLuaDaoChecker isOnline={isOnline} />

        <SpeedTest isOnline={isOnline} />

        <UserAgentChecker />

      </main>

      <footer className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>IP data from <a href="https://ipify.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">ipify.org</a>. Speed test file from <a href="https://sabnzbd.org/tests/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">sabnzbd.org</a>.</p>
      </footer>
    </div>
  );
};
