'use client';

import { useEffect, useState } from 'react';

export function Postmark() {
  const [location, setLocation] = useState<string>('...');
  const [date] = useState(() => {
    const now = new Date();
    return {
      day: now.getDate(),
      month: now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      year: now.getFullYear(),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
  });

  useEffect(() => {
    // Try to get location from browser geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocode to get city name
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            
            const city = data.address?.city || 
                        data.address?.town || 
                        data.address?.village ||
                        data.address?.municipality ||
                        data.address?.county ||
                        'Unknown';
            const state = data.address?.state || data.address?.region || '';
            
            // Format as "City, ST" or just "City"
            if (state) {
              // Get state abbreviation if in US
              const stateAbbr = state.length > 3 ? state.substring(0, 2).toUpperCase() : state;
              setLocation(`${city}, ${stateAbbr}`);
            } else {
              setLocation(city);
            }
          } catch {
            setLocation('Unknown');
          }
        },
        () => {
          // Geolocation denied or failed, try IP-based fallback
          fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
              if (data.city) {
                const loc = data.region_code 
                  ? `${data.city}, ${data.region_code}`
                  : data.city;
                setLocation(loc);
              } else {
                setLocation('Unknown');
              }
            })
            .catch(() => setLocation('Unknown'));
        },
        { timeout: 5000 }
      );
    } else {
      // No geolocation, use IP fallback
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data.city) {
            const loc = data.region_code 
              ? `${data.city}, ${data.region_code}`
              : data.city;
            setLocation(loc);
          } else {
            setLocation('Unknown');
          }
        })
        .catch(() => setLocation('Unknown'));
    }
  }, []);

  return (
    <div className="postmark">
      <div className="postmark-inner">
        <div className="postmark-location">{location}</div>
        <div className="postmark-date">
          <span className="postmark-month">{date.month}</span>
          <span className="postmark-day">{date.day}</span>
          <span className="postmark-year">{date.year}</span>
        </div>
        <div className="postmark-time">{date.time}</div>
      </div>
    </div>
  );
}
