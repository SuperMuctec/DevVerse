import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface PieChartSegment {
  language: string;
  percentage: number;
  color: string;
  bytes: number;
}

interface PieChartProps {
  data: { [key: string]: number };
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  size = 120, 
  strokeWidth = 8,
  className = ""
}) => {
  const segments = useMemo(() => {
    const total = Object.values(data).reduce((sum, bytes) => sum + bytes, 0);
    if (total === 0) return [];

    const getLanguageColor = (language: string): string => {
      const colors: { [key: string]: string } = {
        TypeScript: '#3178c6',
        JavaScript: '#f7df1e',
        Python: '#3776ab',
        Java: '#ed8b00',
        'C++': '#00599c',
        Go: '#00add8',
        Rust: '#dea584',
        PHP: '#777bb4',
        Ruby: '#cc342d',
        Swift: '#fa7343',
        Kotlin: '#7f52ff',
        Dart: '#0175c2',
        Shell: '#89e051',
        C: '#555555',
        'C#': '#239120',
        Jupyter: '#da5b0b',
        Vue: '#4fc08d',
        Svelte: '#ff3e00',
        HTML: '#e34c26',
        CSS: '#1572b6',
        React: '#61dafb',
        Objective: '#438eff',
        Scala: '#dc322f',
        Perl: '#39457e',
        Lua: '#000080',
        R: '#276dc3',
        MATLAB: '#e16737',
        Haskell: '#5e5086',
        Clojure: '#db5855',
        Elixir: '#6e4a7e',
        Erlang: '#b83998',
        F: '#b845fc',
        Julia: '#9558b2',
        Nim: '#ffc200',
        Crystal: '#000100',
        Zig: '#ec915c',
        V: '#4f87c4',
        Odin: '#60a5fa',
        Carbon: '#15803d'
      };
      return colors[language] || '#ffffff';
    };

    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .map(([language, bytes]) => ({
        language,
        percentage: (bytes / total) * 100,
        color: getLanguageColor(language),
        bytes
      }));
  }, [data]);

  if (segments.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div className="text-white/50 text-sm">No data</div>
      </div>
    );
  }

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativePercentage = 0;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Animated segments */}
        {segments.map((segment, index) => {
          const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
          
          const segmentElement = (
            <motion.circle
              key={`${segment.language}-${index}`}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              initial={{ 
                strokeDasharray: `0 ${circumference}`,
                opacity: 0
              }}
              animate={{ 
                strokeDasharray: strokeDasharray,
                opacity: 1
              }}
              transition={{ 
                duration: 1.2,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              style={{
                filter: `drop-shadow(0 0 4px ${segment.color}40)`
              }}
            />
          );

          cumulativePercentage += segment.percentage;
          return segmentElement;
        })}
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs font-semibold text-white">
            {segments.length}
          </div>
          <div className="text-xs text-white/60">
            {segments.length === 1 ? 'lang' : 'langs'}
          </div>
        </div>
      </div>
    </div>
  );
};

interface LanguageLegendProps {
  data: { [key: string]: number };
  maxItems?: number;
  showPercentages?: boolean;
  className?: string;
}

export const LanguageLegend: React.FC<LanguageLegendProps> = ({ 
  data, 
  maxItems = 5,
  showPercentages = true,
  className = ""
}) => {
  const segments = useMemo(() => {
    const total = Object.values(data).reduce((sum, bytes) => sum + bytes, 0);
    if (total === 0) return [];

    const getLanguageColor = (language: string): string => {
      const colors: { [key: string]: string } = {
        TypeScript: '#3178c6',
        JavaScript: '#f7df1e',
        Python: '#3776ab',
        Java: '#ed8b00',
        'C++': '#00599c',
        Go: '#00add8',
        Rust: '#dea584',
        PHP: '#777bb4',
        Ruby: '#cc342d',
        Swift: '#fa7343',
        Kotlin: '#7f52ff',
        Dart: '#0175c2',
        Shell: '#89e051',
        C: '#555555',
        'C#': '#239120',
        Jupyter: '#da5b0b',
        Vue: '#4fc08d',
        Svelte: '#ff3e00',
        HTML: '#e34c26',
        CSS: '#1572b6',
        React: '#61dafb',
        Objective: '#438eff',
        Scala: '#dc322f',
        Perl: '#39457e',
        Lua: '#000080',
        R: '#276dc3',
        MATLAB: '#e16737',
        Haskell: '#5e5086',
        Clojure: '#db5855',
        Elixir: '#6e4a7e',
        Erlang: '#b83998',
        F: '#b845fc',
        Julia: '#9558b2',
        Nim: '#ffc200',
        Crystal: '#000100',
        Zig: '#ec915c',
        V: '#4f87c4',
        Odin: '#60a5fa',
        Carbon: '#15803d'
      };
      return colors[language] || '#ffffff';
    };

    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxItems)
      .map(([language, bytes]) => ({
        language,
        percentage: (bytes / total) * 100,
        color: getLanguageColor(language),
        bytes
      }));
  }, [data, maxItems]);

  if (segments.length === 0) {
    return (
      <div className={`text-white/50 text-sm ${className}`}>
        No language data available
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {segments.map((segment, index) => (
        <motion.div 
          key={segment.language}
          className="flex items-center justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.4,
            ease: "easeOut"
          }}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <motion.div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: segment.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: index * 0.1 + 0.2,
                duration: 0.3,
                type: "spring",
                stiffness: 200
              }}
            />
            <span className="text-sm text-white/80 font-medium truncate">
              {segment.language}
            </span>
          </div>
          {showPercentages && (
            <motion.span 
              className="text-sm text-white/60 font-mono ml-2 flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
            >
              {segment.percentage.toFixed(1)}%
            </motion.span>
          )}
        </motion.div>
      ))}
      
      {Object.keys(data).length > maxItems && (
        <motion.div 
          className="text-xs text-white/50 pt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: segments.length * 0.1 + 0.5, duration: 0.3 }}
        >
          +{Object.keys(data).length - maxItems} more languages
        </motion.div>
      )}
    </div>
  );
};

interface LanguageChartProps {
  data: { [key: string]: number };
  title?: string;
  size?: number;
  maxLegendItems?: number;
  className?: string;
}

export const LanguageChart: React.FC<LanguageChartProps> = ({ 
  data, 
  title = "Language Distribution",
  size = 120,
  maxLegendItems = 5,
  className = ""
}) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className={`p-4 bg-white/5 rounded-lg border border-white/10 ${className}`}>
        <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center space-x-2">
          <div className="w-4 h-4 bg-white/20 rounded"></div>
          <span>{title}</span>
        </h4>
        <div className="text-sm text-white/50">No language data available</div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white/5 rounded-lg border border-white/10 ${className}`}>
      <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center space-x-2">
        <motion.div
          className="w-4 h-4 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded"
          animate={{ 
            rotateZ: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <span>{title}</span>
      </h4>
      
      <div className="flex items-start space-x-4">
        <PieChart data={data} size={size} />
        <div className="flex-1 min-w-0">
          <LanguageLegend 
            data={data} 
            maxItems={maxLegendItems}
            showPercentages={true}
          />
        </div>
      </div>
    </div>
  );
};