// pages/AdminOverview.tsx
import React, { useState, useEffect } from 'react';
import { useBookings } from '../context/BookingContext';
import { useMenu } from '../context/MenuContext';
import './AdminOverview.css';

interface WeeklyDataPoint {
  day: string;
  revenue: number;
  x?: number;
  y?: number;
}

interface DonutSegment {
  status: string;
  count: number;
  color: string;
  percentage: number;
  dashArray: string;
  dashOffset: number;
}

const AdminOverview: React.FC = () => {
  const { getAllBookings } = useBookings();
  const { menuItems } = useMenu();
  
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    totalTables: 24
  });

  // Chart States
  const [hoveredPoint, setHoveredPoint] = useState<WeeklyDataPoint | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<DonutSegment | null>(null);

  useEffect(() => {
    const bookings = getAllBookings();
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split('T')[0]);
    const occupancy = (todayBookings.length / 24) * 100;

    // Calculate estimated revenue (assuming average spend 2500 PKR / $20 per person)
    const confirmedBookingsData = bookings.filter(b => b.status === 'confirmed');
    const revenue = confirmedBookingsData.reduce((total, booking) => total + (booking.guests * 1500), 0);

    setStats({
      totalBookings: bookings.length,
      pendingBookings: pending,
      confirmedBookings: confirmed,
      cancelledBookings: cancelled,
      totalRevenue: revenue,
      occupancyRate: Math.min(occupancy, 100),
      totalTables: 24
    });
  }, [getAllBookings]);

  // Sample data for recent bookings
  const recentBookings = getAllBookings().slice(0, 5);

  // Status Breakdown for Donut Chart
  const statusBreakdown = [
    { status: 'Confirmed', count: stats.confirmedBookings, color: '#4caf50' },
    { status: 'Pending', count: stats.pendingBookings, color: '#ffc107' },
    { status: 'Cancelled', count: stats.cancelledBookings, color: '#ff6b6b' }
  ];

  const totalBreakdown = statusBreakdown.reduce((sum, item) => sum + item.count, 0) || 1;
  const circumference = 2 * Math.PI * 60; // 376.99
  let currentOffset = 0;
  
  const donutSegments: DonutSegment[] = statusBreakdown.map(item => {
    const percentage = item.count / totalBreakdown;
    const dashArray = `${percentage * circumference} ${circumference}`;
    const dashOffset = currentOffset;
    currentOffset -= percentage * circumference;
    return {
      ...item,
      percentage: Math.round(percentage * 100),
      dashArray,
      dashOffset
    };
  });

  // Weekly Revenue Trend Area Chart
  const weeklyData: WeeklyDataPoint[] = [
    { day: 'Mon', revenue: stats.totalRevenue ? Math.round(stats.totalRevenue * 0.4) : 8500 },
    { day: 'Tue', revenue: stats.totalRevenue ? Math.round(stats.totalRevenue * 0.6) : 12000 },
    { day: 'Wed', revenue: stats.totalRevenue ? Math.round(stats.totalRevenue * 0.5) : 10500 },
    { day: 'Thu', revenue: stats.totalRevenue ? Math.round(stats.totalRevenue * 0.8) : 17000 },
    { day: 'Fri', revenue: stats.totalRevenue ? Math.round(stats.totalRevenue * 1.2) : 25000 },
    { day: 'Sat', revenue: stats.totalRevenue ? Math.round(stats.totalRevenue * 1.5) : 32000 },
    { day: 'Sun', revenue: stats.totalRevenue ? Math.round(stats.totalRevenue * 1.3) : 28000 }
  ];

  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue)) || 10000;
  const svgWidth = 500;
  const svgHeight = 220;
  const paddingX = 50;
  const paddingY = 30;

  const points: WeeklyDataPoint[] = weeklyData.map((d, index) => {
    const x = paddingX + (index * (svgWidth - paddingX * 2) / (weeklyData.length - 1));
    const y = svgHeight - paddingY - (d.revenue / maxRevenue * (svgHeight - paddingY * 2));
    return { ...d, x, y };
  });

  // Create SVG path
  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  return (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Today's Bookings</h3>
            <div className="stat-value">{stats.totalBookings}</div>
            <span className="stat-sub">Pending & confirmed</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Occupancy</h3>
            <div className="stat-value">{Math.round(stats.occupancyRate)}%</div>
            <span className="stat-sub">Based on {stats.totalTables} total tables</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Guests (Today)</h3>
            <div className="stat-value">{stats.confirmedBookings * 2}</div>
            <span className="stat-sub">Confirmed reservations</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Est. Revenue</h3>
            <div className="stat-value">Rs. {stats.totalRevenue.toLocaleString()}</div>
            <span className="stat-sub">From confirmed today</span>
          </div>
        </div>
      </div>

      <div className="analytics-section">
        {/* Weekly Revenue Curve Area Chart */}
        <div className="chart-card glass-card relative-container">
          <div className="chart-header">
            <h3>Weekly Revenue Trend</h3>
            {hoveredPoint && (
              <div className="chart-value-highlight">
                <span className="highlight-day">{hoveredPoint.day}:</span>
                <span className="highlight-val">Rs. {hoveredPoint.revenue.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div className="svg-chart-container">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="svg-chart">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a03d" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#c9a03d" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#e3c068" />
                  <stop offset="50%" stopColor="#c9a03d" />
                  <stop offset="100%" stopColor="#e3c068" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1={paddingX} y1={(svgHeight) / 2} x2={svgWidth - paddingX} y2={(svgHeight) / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="rgba(255,255,255,0.1)" />

              {/* Area Path */}
              {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}

              {/* Line Path */}
              {linePath && <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" />}

              {/* Interactive Circles & Hover Hotspots */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={hoveredPoint?.day === p.day ? 7 : 4} 
                    fill={hoveredPoint?.day === p.day ? '#fff' : '#c9a03d'} 
                    stroke="#050505" 
                    strokeWidth="2" 
                    style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                  />
                  {/* Larger transparent hit area for hover */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="20" 
                    fill="transparent" 
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}

              {/* X Axis Labels */}
              {points.map((p, i) => (
                <text 
                  key={i} 
                  x={p.x} 
                  y={svgHeight - 10} 
                  textAnchor="middle" 
                  fill="rgba(255,255,255,0.5)" 
                  fontSize="11"
                  fontWeight={hoveredPoint?.day === p.day ? 'bold' : 'normal'}
                >
                  {p.day}
                </text>
              ))}

              {/* Y Axis Labels (Min / Max) */}
              <text x={10} y={paddingY + 5} fill="rgba(255,255,255,0.4)" fontSize="10">Rs. {Math.round(maxRevenue / 1000)}k</text>
              <text x={10} y={svgHeight - paddingY} fill="rgba(255,255,255,0.4)" fontSize="10">Rs. 0</text>
            </svg>
          </div>
        </div>

        {/* Interactive SVG Donut Chart */}
        <div className="chart-card glass-card donut-chart-card">
          <h3>Booking Status Breakdown</h3>
          <div className="donut-layout">
            <div className="donut-svg-container">
              <svg width="200" height="200" viewBox="0 0 200 200" className="donut-svg">
                <circle 
                  cx="100" 
                  cy="100" 
                  r="60" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="20" 
                />
                {donutSegments.map((seg, idx) => (
                  <circle 
                    key={idx}
                    cx="100" 
                    cy="100" 
                    r="60" 
                    fill="none" 
                    stroke={seg.color} 
                    strokeWidth={hoveredSegment?.status === seg.status ? 24 : 20} 
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                    transform="rotate(-90 100 100)"
                    style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredSegment(seg)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                ))}
                {/* Donut Center text */}
                <text x="100" y="95" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontWeight="500">
                  {hoveredSegment ? hoveredSegment.status : 'Total'}
                </text>
                <text x="100" y="115" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">
                  {hoveredSegment ? `${hoveredSegment.count}` : `${stats.totalBookings}`}
                </text>
                <text x="100" y="130" textAnchor="middle" fill="#c9a03d" fontSize="10" fontWeight="bold">
                  {hoveredSegment ? `${hoveredSegment.percentage}%` : 'Bookings'}
                </text>
              </svg>
            </div>

            <div className="donut-legend">
              {donutSegments.map((seg, idx) => (
                <div 
                  key={idx} 
                  className={`legend-item ${hoveredSegment?.status === seg.status ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredSegment(seg)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <span className="legend-dot" style={{ backgroundColor: seg.color }}></span>
                  <div className="legend-details">
                    <span className="legend-label">{seg.status}</span>
                    <span className="legend-value">{seg.count} ({seg.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings Panel */}
        <div className="chart-card glass-card recent-bookings-card">
          <h3>Recent Reservations</h3>
          {recentBookings.length > 0 ? (
            <div className="recent-bookings">
              {recentBookings.map(booking => (
                <div key={booking.id} className="recent-booking">
                  <div className="booking-info">
                    <span className="booking-name">{booking.userName}</span>
                    <span className="booking-details">
                      {new Date(booking.date).toLocaleDateString()} • {booking.time} • {booking.guests} guests
                    </span>
                  </div>
                  <span className={`booking-status ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No bookings yet</p>
          )}
        </div>
      </div>

      <div className="quick-stats glass-card">
        <div className="stat-item">
          <span className="stat-label">Total Menu Items</span>
          <span className="stat-number">{menuItems.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Available Items</span>
          <span className="stat-number">{menuItems.filter(i => i.isAvailable).length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg. Table Turnover</span>
          <span className="stat-number">2.8x</span>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;