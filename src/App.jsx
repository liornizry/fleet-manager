import React, { useState, useEffect, createContext, useContext } from 'react';
import { Car, Calendar, Settings, Users, LogOut, Plus, Edit2, Trash2, X, Check, ChevronLeft, ChevronRight, Wrench, AlertCircle, Clock, Filter, BarChart3, Bell } from 'lucide-react';

// ============== CONTEXT & STATE MANAGEMENT ==============
const AppContext = createContext();

const useApp = () => useContext(AppContext);

// ============== MOCK DATA ==============
const initialVehicles = [
  { id: 1, name: 'סקודה', model: '2023', licensePlate: '123-45-678', status: 'available', image: null },
  { id: 2, name: 'פיאט 3', model: '2022', licensePlate: '234-56-789', status: 'available', image: null },
  { id: 3, name: 'סוקי', model: '2023', licensePlate: '345-67-890', status: 'maintenance', maintenanceReason: '×˜×™×¤×•×œ 10,000 ×§"×ž', returnDate: '2026-02-10', image: null },
  { id: 4, name: 'ברלינגו', model: '2024', licensePlate: '456-78-901', status: 'disabled', disableReason: '×ª××•× ×” ×§×œ×”', returnDate: '2026-02-15', image: null },
  { id: 5, name: 'רנגלק', model: '2023', licensePlate: '567-89-012', status: 'available', image: null },
  { id: 6, name: 'גלדיאטור', model: '2022', licensePlate: '678-90-123', status: 'available', image: null },
];

const initialBookings = [
  { id: 1, vehicleId: 1, userName: '×™×•×¡×™ ×›×”×Ÿ', startDate: '2026-02-06', startHour: 8, endDate: '2026-02-06', endHour: 14, notes: '×¤×’×™×©×ª ×œ×§×•×— ×‘×ª×œ ××‘×™×‘', color: '#3B82F6' },
  { id: 2, vehicleId: 2, userName: '×ž×™×›×œ ×œ×•×™', startDate: '2026-02-05', startHour: 10, endDate: '2026-02-05', endHour: 18, notes: '×ž×©×œ×•×— ×¦×™×•×“', color: '#10B981' },
  { id: 3, vehicleId: 5, userName: '×“× ×™ ××‘×¨×”×', startDate: '2026-02-08', startHour: 7, endDate: '2026-02-10', endHour: 20, notes: '×›× ×¡ ×‘×™×¨×•×©×œ×™×', color: '#F59E0B' },
  { id: 4, vehicleId: 1, userName: '×©×¨×” ×“×•×“', startDate: '2026-02-06', startHour: 16, endDate: '2026-02-06', endHour: 20, notes: '××™×¡×•×£ ×ž×”×©×“×” ×ª×¢×•×¤×”', color: '#8B5CF6' },
];

const initialUsers = [
  { id: 1, name: '×ž× ×”×œ', email: 'admin@company.com', phone: '050-1234567', role: 'admin', department: '×”× ×”×œ×”', status: 'active', createdAt: '2025-01-01' },
  { id: 2, name: '×™×•×¡×™ ×›×”×Ÿ', email: 'yossi@company.com', phone: '050-2345678', role: 'user', department: '×ž×›×™×¨×•×ª', status: 'active', createdAt: '2025-01-15' },
  { id: 3, name: '×ž×™×›×œ ×œ×•×™', email: 'michal@company.com', phone: '050-3456789', role: 'user', department: '×œ×•×’×™×¡×˜×™×§×”', status: 'active', createdAt: '2025-02-01' },
  { id: 4, name: '×“× ×™ ××‘×¨×”×', email: 'dani@company.com', phone: '050-4567890', role: 'user', department: '×©×™×•×•×§', status: 'active', createdAt: '2025-02-10' },
  { id: 5, name: '×©×¨×” ×“×•×“', email: 'sara@company.com', phone: '050-5678901', role: 'user', department: '×ž×›×™×¨×•×ª', status: 'active', createdAt: '2025-03-01' },
  { id: 6, name: '××‘×™ ×’×•×œ×Ÿ', email: 'avi@company.com', phone: '050-6789012', role: 'user', department: '×¤×™×ª×•×—', status: 'inactive', createdAt: '2025-01-20' },
];

const adminUsers = ['×ž× ×”×œ', 'admin', '××“×ž×™×Ÿ'];

// ============== UTILITY FUNCTIONS ==============
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
};

const formatFullDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const getDayName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('he-IL', { weekday: 'short' });
};

const getDateString = (date) => {
  return date.toISOString().split('T')[0];
};

const addDays = (dateStr, days) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return getDateString(date);
};

const isDateInRange = (date, startDate, endDate) => {
  return date >= startDate && date <= endDate;
};

const getWeekDates = (startDate) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(startDate, i));
  }
  return dates;
};

const generateUserColor = (name) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// ============== COMPONENTS ==============

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideDown
      ${type === 'success' ? 'bg-emerald-500 text-slate-800' : 'bg-red-500 text-slate-800'}`}>
      {type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
      <span className="font-medium">{message}</span>
    </div>
  );
};

// Login Screen
const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (name.trim().length < 2) {
      setError('× × ×œ×”×–×™×Ÿ ×©× ×ž×œ×');
      return;
    }
    onLogin(name.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4" dir="rtl">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl shadow-xl shadow-blue-500/25 mb-4">
            <Car size={40} className="text-slate-800" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">× ×™×”×•×œ ×¦×™ ×¨×›×‘×™×</h1>
          <p className="text-slate-400">×ž×¢×¨×›×ª ×—×›×ž×” ×œ× ×™×”×•×œ ×•×”×§×¦××ª ×¨×›×‘×™×</p>
        </div>

        {/* Login card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">×©× ×ž×œ×</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="×”×–×Ÿ ××ª ×©×ž×š ×”×ž×œ×"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-slate-800 font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              ×›× ×™×¡×” ×œ×ž×¢×¨×›×ª
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};

// Vehicle Card Component
const VehicleCard = ({ vehicle, bookings, selectedDate, onSelect }) => {
  const today = getDateString(new Date());
  const weekEnd = addDays(today, 6);
  
  const vehicleBookings = bookings.filter(b => b.vehicleId === vehicle.id);
  
  const getAvailabilityStatus = () => {
    if (vehicle.status === 'maintenance') return 'maintenance';
    if (vehicle.status === 'disabled') return 'disabled';
    
    const hasBookingOnSelectedDate = vehicleBookings.some(b => 
      isDateInRange(selectedDate, b.startDate, b.endDate)
    );
    if (hasBookingOnSelectedDate) return 'booked';
    
    const hasBookingThisWeek = vehicleBookings.some(b => 
      (b.startDate >= today && b.startDate <= weekEnd) ||
      (b.endDate >= today && b.endDate <= weekEnd) ||
      (b.startDate <= today && b.endDate >= weekEnd)
    );
    if (hasBookingThisWeek) return 'partial';
    
    return 'available';
  };

  const status = getAvailabilityStatus();
  
  const statusConfig = {
    available: { bg: 'bg-emerald-50', border: 'border-emerald-300', icon: 'ðŸŸ¢', text: '×–×ž×™×Ÿ', textColor: 'text-emerald-600' },
    partial: { bg: 'bg-amber-50', border: 'border-amber-300', icon: 'ðŸŸ¡', text: '×ª×¤×•×¡ ×—×œ×§×™×ª', textColor: 'text-amber-600' },
    booked: { bg: 'bg-red-50', border: 'border-red-300', icon: 'ðŸ”´', text: '×ª×¤×•×¡', textColor: 'text-red-600' },
    maintenance: { bg: 'bg-slate-100', border: 'border-slate-300', icon: 'ðŸ”§', text: '×‘×ž×•×¡×š', textColor: 'text-slate-600' },
    disabled: { bg: 'bg-slate-200', border: 'border-slate-400', icon: 'âš«', text: '×ž×•×©×‘×ª', textColor: 'text-slate-600' },
  };

  const config = statusConfig[status];
  const isClickable = status !== 'booked' && status !== 'maintenance' && status !== 'disabled';

  return (
    <div
      onClick={() => isClickable && onSelect(vehicle)}
      className={`relative rounded-2xl p-5 border-2 transition-all duration-300 bg-white ${config.border}
        ${isClickable ? 'cursor-pointer hover:scale-[1.02] hover:shadow-xl' : 'opacity-70 cursor-not-allowed'}`}
    >
      {/* Status badge */}
      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.textColor}`}>
        {config.icon} {config.text}
      </div>

      {/* Vehicle image placeholder */}
      <div className="w-full h-32 bg-slate-100 rounded-xl mb-4 flex items-center justify-center">
        <Car size={48} className="text-slate-400" />
      </div>

      {/* Vehicle info */}
      <h3 className="text-lg font-bold text-slate-800 mb-1">{vehicle.name}</h3>
      <p className="text-slate-400 text-sm mb-2">{vehicle.model}</p>
      <p className="text-slate-400 text-sm font-mono">{vehicle.licensePlate}</p>

      {/* Additional info for maintenance/disabled */}
      {(status === 'maintenance' || status === 'disabled') && vehicle.returnDate && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-slate-400 text-xs">
            <Clock size={12} className="inline ml-1" />
            ×¦×¤×™ ×—×–×¨×”: {formatDate(vehicle.returnDate)}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {vehicle.maintenanceReason || vehicle.disableReason}
          </p>
        </div>
      )}
    </div>
  );
};

// Booking Modal Component with Hourly Support
const BookingModal = ({ vehicle, bookings, onClose, onBook }) => {
  const [weekStart, setWeekStart] = useState(getDateString(new Date()));
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(17);
  const [notes, setNotes] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);

  const weekDates = getWeekDates(weekStart);
  const vehicleBookings = bookings.filter(b => b.vehicleId === vehicle.id);
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 - 20:00

  const isHourBooked = (date, hour) => {
    return vehicleBookings.some(b => {
      if (date < b.startDate || date > b.endDate) return false;
      if (b.startDate === b.endDate && date === b.startDate) {
        return hour >= b.startHour && hour < b.endHour;
      }
      if (date === b.startDate) return hour >= b.startHour;
      if (date === b.endDate) return hour < b.endHour;
      return true;
    });
  };

  const getBookingsForDate = (date) => {
    return vehicleBookings.filter(b => date >= b.startDate && date <= b.endDate);
  };

  const handleDateClick = (date) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
      setIsSelecting(true);
    } else {
      if (date < selectedRange.start) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        setSelectedRange({ start: selectedRange.start, end: date });
      }
      setIsSelecting(false);
    }
  };

  const handleMouseEnter = (date) => {
    if (isSelecting && selectedRange.start) {
      if (date < selectedRange.start) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        setSelectedRange({ ...selectedRange, end: date });
      }
    }
  };

  const isDateInSelection = (date) => {
    if (!selectedRange.start) return false;
    if (!selectedRange.end) return date === selectedRange.start;
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const handleBook = () => {
    if (!selectedRange.start) return;
    if (endHour <= startHour && selectedRange.start === (selectedRange.end || selectedRange.start)) {
      return; // Invalid time range for same day
    }
    onBook({
      vehicleId: vehicle.id,
      startDate: selectedRange.start,
      startHour,
      endDate: selectedRange.end || selectedRange.start,
      endHour,
      notes,
    });
  };

  const hasConflict = () => {
    if (!selectedRange.start) return false;
    const endDate = selectedRange.end || selectedRange.start;
    
    return vehicleBookings.some(b => {
      // Check date overlap first
      if (selectedRange.start > b.endDate || endDate < b.startDate) return false;
      
      // Same day booking - check hours
      if (selectedRange.start === endDate && b.startDate === b.endDate && selectedRange.start === b.startDate) {
        return (startHour < b.endHour && endHour > b.startHour);
      }
      
      // Multi-day bookings - more complex check
      if (selectedRange.start === b.endDate) {
        return startHour < b.endHour;
      }
      if (endDate === b.startDate) {
        return endHour > b.startHour;
      }
      
      return true;
    });
  };

  const isValidTimeRange = () => {
    if (!selectedRange.start) return false;
    if (selectedRange.start === (selectedRange.end || selectedRange.start)) {
      return endHour > startHour;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-40" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{vehicle.name}</h2>
              <p className="text-slate-400 text-sm">{vehicle.model} | {vehicle.licensePlate}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-6">
          {/* Week navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ChevronRight size={20} className="text-slate-400" />
            </button>
            <span className="text-slate-700 font-medium">
              {formatDate(weekStart)} - {formatDate(addDays(weekStart, 6))}
            </span>
            <button
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ChevronLeft size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date) => {
              const dayBookings = getBookingsForDate(date);
              const isSelected = isDateInSelection(date);
              const isToday = date === getDateString(new Date());

              return (
                <div
                  key={date}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => handleMouseEnter(date)}
                  className={`relative p-2 rounded-xl text-center cursor-pointer transition-all
                    ${isSelected ? 'bg-blue-500 text-slate-800 ring-2 ring-blue-400' : ''}
                    ${!isSelected ? 'bg-slate-50 hover:bg-slate-100' : ''}
                    ${isToday ? 'ring-2 ring-emerald-500' : ''}`}
                >
                  <div className={`text-xs mb-1 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>{getDayName(date)}</div>
                  <div className={`text-lg font-bold ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>
                    {new Date(date).getDate()}
                  </div>
                  {dayBookings.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {dayBookings.slice(0, 3).map((b, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: b.color }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time selection */}
          {selectedRange.start && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-700 font-medium mb-3 flex items-center gap-2">
                <Clock size={16} />
                ×‘×—×™×¨×ª ×©×¢×•×ª
              </div>
              
              {/* Visual hourly availability for selected date(s) */}
              <div className="mb-4">
                <div className="text-slate-400 text-xs mb-2">×–×ž×™× ×•×ª ×©×¢×ª×™×ª ×œ×™×•× ×”× ×‘×—×¨:</div>
                <div className="bg-slate-100 rounded-lg p-3">
                  {/* Show availability for start date */}
                  <div className="mb-2">
                    <div className="text-slate-600 text-xs mb-1">{formatDate(selectedRange.start)}</div>
                    <div className="flex gap-0.5">
                      {hours.map(hour => {
                        const isBooked = isHourBooked(selectedRange.start, hour);
                        const bookingAtHour = vehicleBookings.find(b => {
                          if (selectedRange.start < b.startDate || selectedRange.start > b.endDate) return false;
                          if (b.startDate === b.endDate && selectedRange.start === b.startDate) {
                            return hour >= b.startHour && hour < b.endHour;
                          }
                          if (selectedRange.start === b.startDate) return hour >= b.startHour;
                          if (selectedRange.start === b.endDate) return hour < b.endHour;
                          return true;
                        });
                        const isInSelectedRange = hour >= startHour && hour < endHour;
                        
                        return (
                          <div
                            key={hour}
                            className={`flex-1 h-6 rounded-sm flex items-center justify-center text-[8px] font-medium transition-all
                              ${isBooked ? 'cursor-not-allowed' : 'cursor-pointer hover:ring-1 hover:ring-slate-400'}`}
                            style={{ 
                              backgroundColor: isBooked 
                                ? (bookingAtHour?.color || '#EF4444') + '90'
                                : isInSelectedRange 
                                  ? '#3B82F6' 
                                  : '#e2e8f0'
                            }}
                            title={isBooked ? `×ª×¤×•×¡: ${bookingAtHour?.userName || ''}` : `${hour}:00 - ×¤× ×•×™`}
                            onClick={() => {
                              if (!isBooked) {
                                setStartHour(hour);
                                if (hour >= endHour) setEndHour(hour + 1);
                              }
                            }}
                          >
                            <span className={isBooked ? 'text-slate-800' : isInSelectedRange ? 'text-slate-800' : 'text-slate-400'}>
                              {hour}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Show end date if different */}
                  {selectedRange.end && selectedRange.end !== selectedRange.start && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <div className="text-slate-600 text-xs mb-1">{formatDate(selectedRange.end)} (×™×•× ×¡×™×•×)</div>
                      <div className="flex gap-0.5">
                        {hours.map(hour => {
                          const isBooked = isHourBooked(selectedRange.end, hour);
                          const bookingAtHour = vehicleBookings.find(b => {
                            if (selectedRange.end < b.startDate || selectedRange.end > b.endDate) return false;
                            if (b.startDate === b.endDate && selectedRange.end === b.startDate) {
                              return hour >= b.startHour && hour < b.endHour;
                            }
                            if (selectedRange.end === b.startDate) return hour >= b.startHour;
                            if (selectedRange.end === b.endDate) return hour < b.endHour;
                            return true;
                          });
                          const isInSelectedRange = hour < endHour;
                          
                          return (
                            <div
                              key={hour}
                              className={`flex-1 h-6 rounded-sm flex items-center justify-center text-[8px] font-medium transition-all
                                ${isBooked ? 'cursor-not-allowed' : 'cursor-pointer hover:ring-1 hover:ring-slate-400'}`}
                              style={{ 
                                backgroundColor: isBooked 
                                  ? (bookingAtHour?.color || '#EF4444') + '90'
                                  : isInSelectedRange 
                                    ? '#3B82F6' 
                                    : '#e2e8f0'
                              }}
                              title={isBooked ? `×ª×¤×•×¡: ${bookingAtHour?.userName || ''}` : `${hour}:00 - ×¤× ×•×™`}
                              onClick={() => {
                                if (!isBooked && hour > 0) {
                                  setEndHour(hour + 1);
                                }
                              }}
                            >
                              <span className={isBooked ? 'text-slate-800' : isInSelectedRange ? 'text-slate-800' : 'text-slate-400'}>
                                {hour}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Legend */}
                  <div className="flex gap-4 mt-3 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-blue-500" />
                      <span className="text-slate-400 text-[10px]">×”×‘×—×™×¨×” ×©×œ×š</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-slate-200" />
                      <span className="text-slate-400 text-[10px]">×¤× ×•×™</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-red-400" />
                      <span className="text-slate-400 text-[10px]">×ª×¤×•×¡</span>
                    </div>
                  </div>
                </div>
                
                {/* Existing bookings for selected dates */}
                {getBookingsForDate(selectedRange.start).length > 0 && (
                  <div className="mt-3">
                    <div className="text-slate-400 text-xs mb-1">×”×–×ž× ×•×ª ×§×™×™×ž×•×ª:</div>
                    <div className="space-y-1">
                      {getBookingsForDate(selectedRange.start).map(booking => (
                        <div key={booking.id} className="flex items-center gap-2 text-xs bg-slate-100 rounded-lg px-2 py-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: booking.color }} />
                          <span className="text-slate-700">{booking.userName}</span>
                          <span className="text-slate-600">|</span>
                          <span className="text-slate-400">{booking.startHour}:00 - {booking.endHour}:00</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">×©×¢×ª ×”×ª×—×œ×”</label>
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {hours.map(h => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">×©×¢×ª ×¡×™×•×</label>
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {hours.map(h => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                    <option value={21}>21:00</option>
                  </select>
                </div>
              </div>
              
              {/* Conflict warning */}
              {hasConflict() && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-red-600 text-sm">×™×© ×”×ª× ×’×©×•×ª ×¢× ×”×–×ž× ×” ×§×™×™×ž×ª</span>
                </div>
              )}
              
              {!isValidTimeRange() && !hasConflict() && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-500" />
                  <span className="text-amber-600 text-sm">×©×¢×ª ×”×¡×™×•× ×—×™×™×‘×ª ×œ×”×™×•×ª ××—×¨×™ ×©×¢×ª ×”×”×ª×—×œ×”</span>
                </div>
              )}
            </div>
          )}

          {/* Selected range summary */}
          {selectedRange.start && isValidTimeRange() && !hasConflict() && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-600 text-sm">
                ðŸ“… {formatFullDate(selectedRange.start)} ×‘×©×¢×” {startHour}:00
                {selectedRange.end && selectedRange.end !== selectedRange.start ? (
                  <> ×¢×“ {formatFullDate(selectedRange.end)} ×‘×©×¢×” {endHour}:00</>
                ) : (
                  <> ×¢×“ {endHour}:00</>
                )}
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="mt-4">
            <label className="block text-slate-600 text-sm font-medium mb-2">×”×¢×¨×•×ª (××•×¤×¦×™×•× ×œ×™)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="×ž×˜×¨×ª ×”× ×¡×™×¢×”, ×™×¢×“..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors"
          >
            ×‘×™×˜×•×œ
          </button>
          <button
            onClick={handleBook}
            disabled={!selectedRange.start || hasConflict() || !isValidTimeRange()}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-slate-800 font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ××™×©×•×¨ ×”×–×ž× ×”
          </button>
        </div>
      </div>
    </div>
  );
};

// Weekly Gantt Chart Component with Hourly View and Booking
const WeeklyGantt = ({ vehicles, bookings, weekStart, onBookFromGantt, isUserView = false }) => {
  const weekDates = getWeekDates(weekStart);
  const [hoveredBooking, setHoveredBooking] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [quickBooking, setQuickBooking] = useState(null); // { vehicleId, date }
  const [bookingHours, setBookingHours] = useState({ start: 8, end: 17 });
  const [bookingNotes, setBookingNotes] = useState('');
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 - 20:00
  
  // State for hourly selection in detail view
  const [hourlySelection, setHourlySelection] = useState(null); // { vehicleId, startHour, endHour }
  const [isSelectingHours, setIsSelectingHours] = useState(false);
  const [hourlyNotes, setHourlyNotes] = useState('');

  const getBookingsForDateAndHour = (vehicleId, date, hour) => {
    return bookings.filter(b => {
      if (b.vehicleId !== vehicleId) return false;
      
      // Check if date is in range
      if (date < b.startDate || date > b.endDate) return false;
      
      // Same day booking
      if (b.startDate === b.endDate && date === b.startDate) {
        return hour >= b.startHour && hour < b.endHour;
      }
      
      // Multi-day booking
      if (date === b.startDate) {
        return hour >= b.startHour;
      }
      if (date === b.endDate) {
        return hour < b.endHour;
      }
      
      // Middle days - all day
      return true;
    });
  };

  const getBookingsForDate = (vehicleId, date) => {
    return bookings.filter(b => {
      if (b.vehicleId !== vehicleId) return false;
      return date >= b.startDate && date <= b.endDate;
    });
  };

  const handleQuickBook = (vehicleId, date) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle?.status === 'maintenance' || vehicle?.status === 'disabled') return;
    setQuickBooking({ vehicleId, date });
    setBookingHours({ start: 8, end: 17 });
    setBookingNotes('');
  };

  const confirmQuickBooking = () => {
    if (!quickBooking || !onBookFromGantt) return;
    
    onBookFromGantt({
      vehicleId: quickBooking.vehicleId,
      startDate: quickBooking.date,
      startHour: bookingHours.start,
      endDate: quickBooking.date,
      endHour: bookingHours.end,
      notes: bookingNotes,
    });
    
    setQuickBooking(null);
    setBookingNotes('');
  };

  const hasConflict = () => {
    if (!quickBooking) return false;
    const vehicleBookings = bookings.filter(b => b.vehicleId === quickBooking.vehicleId);
    return vehicleBookings.some(b => {
      if (quickBooking.date < b.startDate || quickBooking.date > b.endDate) return false;
      if (b.startDate === b.endDate && quickBooking.date === b.startDate) {
        return (bookingHours.start < b.endHour && bookingHours.end > b.startHour);
      }
      if (quickBooking.date === b.startDate) return bookingHours.end > b.startHour;
      if (quickBooking.date === b.endDate) return bookingHours.start < b.endHour;
      return true;
    });
  };

  // Hourly selection handlers
  const handleHourClick = (vehicleId, hour) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle?.status === 'maintenance' || vehicle?.status === 'disabled') return;
    
    const isBooked = getBookingsForDateAndHour(vehicleId, selectedDay, hour).length > 0;
    if (isBooked) return;

    if (!hourlySelection || hourlySelection.vehicleId !== vehicleId) {
      // Start new selection
      setHourlySelection({ vehicleId, startHour: hour, endHour: hour + 1 });
      setIsSelectingHours(true);
    } else if (isSelectingHours) {
      // Complete selection
      const start = Math.min(hourlySelection.startHour, hour);
      const end = Math.max(hourlySelection.startHour, hour) + 1;
      setHourlySelection({ ...hourlySelection, startHour: start, endHour: end });
      setIsSelectingHours(false);
    } else {
      // Start new selection on same vehicle
      setHourlySelection({ vehicleId, startHour: hour, endHour: hour + 1 });
      setIsSelectingHours(true);
    }
  };

  const handleHourMouseEnter = (vehicleId, hour) => {
    if (!isSelectingHours || !hourlySelection || hourlySelection.vehicleId !== vehicleId) return;
    
    const isBooked = getBookingsForDateAndHour(vehicleId, selectedDay, hour).length > 0;
    if (isBooked) return;

    const start = Math.min(hourlySelection.startHour, hour);
    const end = Math.max(hourlySelection.startHour, hour) + 1;
    setHourlySelection({ ...hourlySelection, startHour: start, endHour: end });
  };

  const isHourInSelection = (vehicleId, hour) => {
    if (!hourlySelection || hourlySelection.vehicleId !== vehicleId) return false;
    return hour >= hourlySelection.startHour && hour < hourlySelection.endHour;
  };

  const hasHourlyConflict = () => {
    if (!hourlySelection || !selectedDay) return false;
    const vehicleBookings = bookings.filter(b => b.vehicleId === hourlySelection.vehicleId);
    return vehicleBookings.some(b => {
      if (selectedDay < b.startDate || selectedDay > b.endDate) return false;
      if (b.startDate === b.endDate && selectedDay === b.startDate) {
        return (hourlySelection.startHour < b.endHour && hourlySelection.endHour > b.startHour);
      }
      if (selectedDay === b.startDate) return hourlySelection.endHour > b.startHour;
      if (selectedDay === b.endDate) return hourlySelection.startHour < b.endHour;
      return true;
    });
  };

  const confirmHourlyBooking = () => {
    if (!hourlySelection || !selectedDay || !onBookFromGantt) return;
    
    onBookFromGantt({
      vehicleId: hourlySelection.vehicleId,
      startDate: selectedDay,
      startHour: hourlySelection.startHour,
      endDate: selectedDay,
      endHour: hourlySelection.endHour,
      notes: hourlyNotes,
    });
    
    setHourlySelection(null);
    setHourlyNotes('');
    setIsSelectingHours(false);
  };

  const cancelHourlySelection = () => {
    setHourlySelection(null);
    setHourlyNotes('');
    setIsSelectingHours(false);
  };

  // Daily overview mode
  if (!selectedDay) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-slate-200 overflow-x-auto shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-800 font-bold flex items-center gap-2">
            <Calendar size={18} />
            ×œ×•×— ×©×‘×•×¢×™
          </h3>
          <p className="text-slate-400 text-xs">
            {isUserView ? '×œ×—×¥ ×¢×œ ×ž×©×‘×¦×ª ×¤× ×•×™×” ×œ×”×–×ž× ×” ×ž×”×™×¨×” | ×œ×—×¥ ×¢×œ ×™×•× ×œ×¤×™×¨×•×˜' : '×œ×—×¥ ×¢×œ ×™×•× ×œ×¦×¤×™×™×” ×‘×¤×™×¨×•×˜ ×©×¢×ª×™'}
          </p>
        </div>

        {/* Header - days */}
        <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: '100px repeat(7, 1fr)', minWidth: '700px' }}>
          <div className="p-2 text-slate-500 text-sm font-medium">×¨×›×‘</div>
          {weekDates.map((date) => {
            const isToday = date === getDateString(new Date());
            return (
              <div 
                key={date} 
                onClick={() => setSelectedDay(date)}
                className={`p-2 text-center cursor-pointer rounded-lg transition-all hover:bg-slate-100 ${isToday ? 'bg-blue-50 ring-1 ring-blue-400' : ''}`}
              >
                <div className="text-slate-400 text-xs">{getDayName(date)}</div>
                <div className="text-slate-700 text-sm font-bold">{new Date(date).getDate()}</div>
              </div>
            );
          })}
        </div>

        {/* Rows - vehicles */}
        {vehicles.map((vehicle) => {
          const isUnavailable = vehicle.status === 'maintenance' || vehicle.status === 'disabled';
          
          return (
            <div key={vehicle.id} className="grid gap-1 mb-1" style={{ gridTemplateColumns: '100px repeat(7, 1fr)', minWidth: '700px' }}>
              <div className="p-2 text-slate-700 text-sm truncate flex items-center gap-2">
                <Car size={14} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{vehicle.name.split(' ')[0]}</span>
              </div>
              {weekDates.map((date) => {
                const dayBookings = getBookingsForDate(vehicle.id, date);
                const canBook = isUserView && !isUnavailable && onBookFromGantt;
                
                return (
                  <div
                    key={date}
                    onClick={() => {
                      if (canBook && dayBookings.length === 0) {
                        handleQuickBook(vehicle.id, date);
                      } else {
                        setSelectedDay(date);
                      }
                    }}
                    className={`relative p-1 rounded-lg transition-all cursor-pointer
                      ${isUnavailable ? 'bg-slate-100' : dayBookings.length === 0 && canBook ? 'bg-emerald-50 hover:bg-emerald-100 hover:ring-2 hover:ring-emerald-300' : 'bg-slate-50 hover:bg-slate-100'}`}
                  >
                    {isUnavailable ? (
                      <div className="h-8 flex items-center justify-center">
                        <Wrench size={12} className="text-slate-400" />
                      </div>
                    ) : dayBookings.length > 0 ? (
                      <div className="h-8 flex flex-col gap-0.5 overflow-hidden">
                        {dayBookings.slice(0, 2).map((booking, idx) => (
                          <div 
                            key={booking.id}
                            className="h-3 rounded text-[8px] text-white font-medium truncate px-1 flex items-center"
                            style={{ backgroundColor: booking.color }}
                            onMouseEnter={(e) => { e.stopPropagation(); setHoveredBooking(booking); }}
                            onMouseLeave={() => setHoveredBooking(null)}
                          >
                            {booking.startHour}:00-{booking.endHour}:00
                          </div>
                        ))}
                        {dayBookings.length > 2 && (
                          <div className="text-[8px] text-slate-400 text-center">+{dayBookings.length - 2}</div>
                        )}
                      </div>
                    ) : (
                      <div className="h-8 flex items-center justify-center">
                        {canBook ? (
                          <span className="text-emerald-600 text-xs flex items-center gap-1">
                            <Plus size={10} />
                            ×”×–×ž×Ÿ
                          </span>
                        ) : (
                          <span className="text-emerald-500 text-xs">×¤× ×•×™</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Quick Booking Modal */}
        {quickBooking && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" dir="rtl">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">×”×–×ž× ×” ×ž×”×™×¨×”</h3>
                  <button onClick={() => setQuickBooking(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  {vehicles.find(v => v.id === quickBooking.vehicleId)?.name} | {formatFullDate(quickBooking.date)}
                </p>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Hours selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-xs mb-1">×©×¢×ª ×”×ª×—×œ×”</label>
                    <select
                      value={bookingHours.start}
                      onChange={(e) => setBookingHours({ ...bookingHours, start: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {hours.map(h => (
                        <option key={h} value={h}>{h}:00</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 text-xs mb-1">×©×¢×ª ×¡×™×•×</label>
                    <select
                      value={bookingHours.end}
                      onChange={(e) => setBookingHours({ ...bookingHours, end: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {hours.map(h => (
                        <option key={h} value={h}>{h}:00</option>
                      ))}
                      <option value={21}>21:00</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-slate-600 text-xs mb-1">×”×¢×¨×•×ª (××•×¤×¦×™×•× ×œ×™)</label>
                  <input
                    type="text"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="×ž×˜×¨×ª ×”× ×¡×™×¢×”..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Conflict warning */}
                {hasConflict() && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle size={14} className="text-red-500" />
                    <span className="text-red-600 text-xs">×™×© ×”×ª× ×’×©×•×ª ×¢× ×”×–×ž× ×” ×§×™×™×ž×ª</span>
                  </div>
                )}

                {bookingHours.end <= bookingHours.start && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                    <AlertCircle size={14} className="text-amber-500" />
                    <span className="text-amber-600 text-xs">×©×¢×ª ×”×¡×™×•× ×—×™×™×‘×ª ×œ×”×™×•×ª ××—×¨×™ ×”×”×ª×—×œ×”</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setQuickBooking(null)}
                    className="flex-1 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm"
                  >
                    ×‘×™×˜×•×œ
                  </button>
                  <button
                    onClick={confirmQuickBooking}
                    disabled={hasConflict() || bookingHours.end <= bookingHours.start}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    ××™×©×•×¨
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tooltip */}
        {hoveredBooking && (
          <div className="fixed bg-white text-slate-700 p-3 rounded-xl shadow-2xl z-40 text-sm max-w-xs pointer-events-none border border-slate-200"
            style={{ bottom: '140px', left: '50%', transform: 'translateX(-50%)' }}>
            <p className="font-bold">{hoveredBooking.userName}</p>
            <p className="text-slate-400 text-xs">
              {formatDate(hoveredBooking.startDate)} {hoveredBooking.startHour}:00 - {formatDate(hoveredBooking.endDate)} {hoveredBooking.endHour}:00
            </p>
            {hoveredBooking.notes && (
              <p className="text-slate-600 text-xs mt-1">{hoveredBooking.notes}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Hourly detail view for selected day
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 overflow-x-auto shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSelectedDay(null); cancelHourlySelection(); }}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ChevronRight size={18} className="text-slate-600" />
          </button>
          <h3 className="text-slate-800 font-bold flex items-center gap-2">
            <Clock size={18} />
            {formatFullDate(selectedDay)}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isUserView && (
            <span className="text-xs text-slate-400 ml-4">×’×¨×•×¨ ××• ×œ×—×¥ ×¢×œ ×©×¢×•×ª ×¤× ×•×™×•×ª ×œ×‘×—×™×¨×”</span>
          )}
          <button
            onClick={() => { setSelectedDay(addDays(selectedDay, -1)); cancelHourlySelection(); }}
            className="p-1 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <ChevronRight size={14} className="text-slate-500" />
          </button>
          <button
            onClick={() => { setSelectedDay(addDays(selectedDay, 1)); cancelHourlySelection(); }}
            className="p-1 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <ChevronLeft size={14} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* Hours header */}
      <div className="grid gap-px mb-2" style={{ gridTemplateColumns: '90px repeat(14, 1fr)', minWidth: '900px' }}>
        <div className="p-1 text-slate-500 text-xs font-medium">×¨×›×‘</div>
        {hours.map((hour) => (
          <div key={hour} className="p-1 text-center">
            <div className="text-slate-400 text-[10px]">{hour}:00</div>
          </div>
        ))}
      </div>

      {/* Vehicle rows with hourly slots */}
      {vehicles.map((vehicle) => {
        const isUnavailable = vehicle.status === 'maintenance' || vehicle.status === 'disabled';
        const isVehicleSelected = hourlySelection?.vehicleId === vehicle.id;
        
        return (
          <div key={vehicle.id} className="grid gap-px mb-1" style={{ gridTemplateColumns: '90px repeat(14, 1fr)', minWidth: '900px' }}>
            <div className={`p-1 text-slate-700 text-xs truncate flex items-center gap-1 rounded-r transition-colors
              ${isVehicleSelected ? 'bg-blue-100' : 'bg-slate-50'}`}>
              <Car size={12} className="text-slate-400 flex-shrink-0" />
              <span className="truncate">{vehicle.name.split(' ')[0]}</span>
            </div>
            {hours.map((hour) => {
              const hourBookings = getBookingsForDateAndHour(vehicle.id, selectedDay, hour);
              const booking = hourBookings[0];
              const isBooked = !!booking;
              const isSelected = isHourInSelection(vehicle.id, hour);
              const canSelect = isUserView && !isUnavailable && !isBooked && onBookFromGantt;
              
              return (
                <div
                  key={hour}
                  onClick={() => canSelect && handleHourClick(vehicle.id, hour)}
                  onMouseEnter={() => canSelect && handleHourMouseEnter(vehicle.id, hour)}
                  className={`relative h-12 rounded-sm transition-all select-none
                    ${isUnavailable ? 'bg-slate-100' : ''}
                    ${isBooked ? '' : ''}
                    ${isSelected ? 'bg-blue-500 ring-1 ring-blue-400' : ''}
                    ${!isUnavailable && !isBooked && !isSelected ? 'bg-slate-50' : ''}
                    ${canSelect && !isSelected ? 'hover:bg-emerald-100 cursor-pointer' : ''}
                    ${isBooked ? 'cursor-not-allowed' : ''}`}
                  style={isBooked && !isSelected ? { backgroundColor: booking.color + '50' } : {}}
                  onMouseLeave={() => !isSelectingHours && setHoveredBooking(null)}
                >
                  {isUnavailable ? (
                    <div className="h-full flex items-center justify-center">
                      <Wrench size={10} className="text-slate-400" />
                    </div>
                  ) : isBooked ? (
                    <div 
                      className="h-full flex items-center justify-center"
                      style={{ borderRight: hour === booking.startHour ? `3px solid ${booking.color}` : 'none' }}
                      onMouseEnter={() => setHoveredBooking(booking)}
                    >
                      {hour === booking.startHour && (
                        <span className="text-[9px] text-slate-700 font-medium truncate px-0.5">
                          {booking.userName.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  ) : isSelected ? (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-[10px] text-white font-bold">âœ“</span>
                    </div>
                  ) : canSelect ? (
                    <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Plus size={10} className="text-emerald-500" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Selection summary and booking confirmation */}
      {hourlySelection && isUserView && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <h4 className="text-blue-800 font-bold text-sm mb-2">×”×–×ž× ×” ×—×“×©×”</h4>
              <p className="text-blue-600 text-sm">
                ðŸš— {vehicles.find(v => v.id === hourlySelection.vehicleId)?.name}
              </p>
              <p className="text-blue-600 text-sm">
                ðŸ• {hourlySelection.startHour}:00 - {hourlySelection.endHour}:00
              </p>
              <div className="mt-2">
                <input
                  type="text"
                  value={hourlyNotes}
                  onChange={(e) => setHourlyNotes(e.target.value)}
                  placeholder="×”×¢×¨×•×ª (××•×¤×¦×™×•× ×œ×™)..."
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {hasHourlyConflict() && (
                <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-500" />
                  <span className="text-red-600 text-xs">×™×© ×”×ª× ×’×©×•×ª ×¢× ×”×–×ž× ×” ×§×™×™×ž×ª</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={cancelHourlySelection}
                className="px-4 py-2 bg-white text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm border border-slate-200"
              >
                ×‘×™×˜×•×œ
              </button>
              <button
                onClick={confirmHourlyBooking}
                disabled={hasHourlyConflict()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                ××™×©×•×¨ ×”×–×ž× ×”
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-4">
        {isUserView && (
          <>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-slate-50 border border-slate-200" />
              <span className="text-slate-500">×¤× ×•×™ - ×œ×—×¥ ×œ×‘×—×™×¨×”</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <span className="text-slate-500">× ×‘×—×¨</span>
            </div>
          </>
        )}
        {bookings
          .filter(b => b.startDate <= selectedDay && b.endDate >= selectedDay)
          .map(booking => (
            <div key={booking.id} className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: booking.color }} />
              <span className="text-slate-600">{booking.userName}</span>
              <span className="text-slate-400">({booking.startHour}:00-{booking.endHour}:00)</span>
            </div>
          ))}
      </div>

      {/* Tooltip */}
      {hoveredBooking && !isSelectingHours && (
        <div className="fixed bg-white text-slate-700 p-3 rounded-xl shadow-2xl z-50 text-sm max-w-xs pointer-events-none border border-slate-200"
          style={{ bottom: '140px', left: '50%', transform: 'translateX(-50%)' }}>
          <p className="font-bold">{hoveredBooking.userName}</p>
          <p className="text-slate-400 text-xs">
            {formatDate(hoveredBooking.startDate)} {hoveredBooking.startHour}:00 - {formatDate(hoveredBooking.endDate)} {hoveredBooking.endHour}:00
          </p>
          {hoveredBooking.notes && (
            <p className="text-slate-500 text-xs mt-1">{hoveredBooking.notes}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ vehicles, bookings, users, onUpdateVehicle, onDeleteVehicle, onAddVehicle, onDeleteBooking, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const stats = {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter(v => v.status === 'available').length,
    totalBookings: bookings.length,
    totalUsers: users.filter(u => u.status === 'active').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
          <div className="text-blue-600 text-3xl font-bold">{stats.totalVehicles}</div>
          <div className="text-slate-500 text-sm">×¡×”"×› ×¨×›×‘×™×</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-200">
          <div className="text-emerald-600 text-3xl font-bold">{stats.availableVehicles}</div>
          <div className="text-slate-500 text-sm">×¨×›×‘×™× ×–×ž×™× ×™×</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4 border border-amber-200">
          <div className="text-amber-600 text-3xl font-bold">{stats.totalBookings}</div>
          <div className="text-slate-500 text-sm">×¡×”"×› ×”×–×ž× ×•×ª</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
          <div className="text-purple-600 text-3xl font-bold">{stats.totalUsers}</div>
          <div className="text-slate-500 text-sm">×ž×©×ª×ž×©×™× ×¤×¢×™×œ×™×</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'vehicles' ? 'bg-blue-500 text-white' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Car size={16} className="inline ml-2" />
          × ×™×”×•×œ ×¨×›×‘×™×
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'bookings' ? 'bg-blue-500 text-white' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Calendar size={16} className="inline ml-2" />
          ×”×–×ž× ×•×ª
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Users size={16} className="inline ml-2" />
          × ×™×”×•×œ ×ž×©×ª×ž×©×™×
        </button>
      </div>

      {/* Content */}
      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-slate-800 font-bold">×¨×©×™×ž×ª ×¨×›×‘×™×</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              ×”×•×¡×£ ×¨×›×‘
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-right text-slate-500 font-medium">×©×</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×“×’×</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×ž×¡×¤×¨ ×¨×™×©×•×™</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×¡×˜×˜×•×¡</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×¤×¢×•×œ×•×ª</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-4 text-slate-800">{vehicle.name}</td>
                    <td className="p-4 text-slate-500">{vehicle.model}</td>
                    <td className="p-4 text-slate-500 font-mono">{vehicle.licensePlate}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${vehicle.status === 'available' ? 'bg-emerald-100 text-emerald-600' : ''}
                        ${vehicle.status === 'maintenance' ? 'bg-amber-100 text-amber-600' : ''}
                        ${vehicle.status === 'disabled' ? 'bg-red-100 text-red-600' : ''}`}>
                        {vehicle.status === 'available' ? '×–×ž×™×Ÿ' : vehicle.status === 'maintenance' ? '×‘×ž×•×¡×š' : '×ž×•×©×‘×ª'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingVehicle(vehicle)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} className="text-slate-400" />
                        </button>
                        <button
                          onClick={() => onDeleteVehicle(vehicle.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-slate-800 font-bold">×›×œ ×”×”×–×ž× ×•×ª</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-right text-slate-500 font-medium">×¨×›×‘</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×ž×©×ª×ž×©</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×”×ª×—×œ×”</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×¡×™×•×</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×”×¢×¨×•×ª</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×¤×¢×•×œ×•×ª</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const vehicle = vehicles.find(v => v.id === booking.vehicleId);
                  return (
                    <tr key={booking.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="p-4 text-slate-800">{vehicle?.name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: booking.color }} />
                          <span className="text-slate-600">{booking.userName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500">
                        <div>{formatDate(booking.startDate)}</div>
                        <div className="text-xs text-slate-400">{booking.startHour}:00</div>
                      </td>
                      <td className="p-4 text-slate-500">
                        <div>{formatDate(booking.endDate)}</div>
                        <div className="text-xs text-slate-400">{booking.endHour}:00</div>
                      </td>
                      <td className="p-4 text-slate-400 max-w-[200px] truncate">{booking.notes || '-'}</td>
                      <td className="p-4">
                        <button
                          onClick={() => onDeleteBooking(booking.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-slate-800 font-bold">× ×™×”×•×œ ×ž×©×ª×ž×©×™×</h3>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              ×”×•×¡×£ ×ž×©×ª×ž×©
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-right text-slate-500 font-medium">×©×</th>
                  <th className="p-4 text-right text-slate-500 font-medium">××™×ž×™×™×œ</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×˜×œ×¤×•×Ÿ</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×ž×—×œ×§×”</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×ª×¤×§×™×“</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×¡×˜×˜×•×¡</th>
                  <th className="p-4 text-right text-slate-500 font-medium">×¤×¢×•×œ×•×ª</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userBookings = bookings.filter(b => b.userName === user.name).length;
                  return (
                    <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-slate-800 font-medium">{user.name}</div>
                            <div className="text-slate-400 text-xs">{userBookings} ×”×–×ž× ×•×ª</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500">{user.email}</td>
                      <td className="p-4 text-slate-500 font-mono text-sm">{user.phone}</td>
                      <td className="p-4 text-slate-500">{user.department}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                          {user.role === 'admin' ? '×ž× ×”×œ' : '×ž×©×ª×ž×©'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${user.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {user.status === 'active' ? '×¤×¢×™×œ' : '×œ× ×¤×¢×™×œ'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="text-slate-400" />
                          </button>
                          <button
                            onClick={() => onDeleteUser(user.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={user.role === 'admin'}
                          >
                            <Trash2 size={16} className={user.role === 'admin' ? 'text-slate-200' : 'text-red-400'} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Vehicle Modal */}
      {(showAddModal || editingVehicle) && (
        <VehicleModal
          vehicle={editingVehicle}
          onClose={() => { setShowAddModal(false); setEditingVehicle(null); }}
          onSave={(data) => {
            if (editingVehicle) {
              onUpdateVehicle(editingVehicle.id, data);
            } else {
              onAddVehicle(data);
            }
            setShowAddModal(false);
            setEditingVehicle(null);
          }}
        />
      )}

      {/* Add/Edit User Modal */}
      {(showAddUserModal || editingUser) && (
        <UserModal
          user={editingUser}
          onClose={() => { setShowAddUserModal(false); setEditingUser(null); }}
          onSave={(data) => {
            if (editingUser) {
              onUpdateUser(editingUser.id, data);
            } else {
              onAddUser(data);
            }
            setShowAddUserModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

// Vehicle Add/Edit Modal
const VehicleModal = ({ vehicle, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: vehicle?.name || '',
    model: vehicle?.model || '',
    licensePlate: vehicle?.licensePlate || '',
    status: vehicle?.status || 'available',
    maintenanceReason: vehicle?.maintenanceReason || '',
    disableReason: vehicle?.disableReason || '',
    returnDate: vehicle?.returnDate || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">{vehicle ? '×¢×¨×™×›×ª ×¨×›×‘' : '×”×•×¡×¤×ª ×¨×›×‘'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-slate-600 text-sm font-medium mb-2">×©× ×”×¨×›×‘</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-slate-600 text-sm font-medium mb-2">×“×’×/×©× ×”</label>
            <input
              type="text"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-slate-600 text-sm font-medium mb-2">×ž×¡×¤×¨ ×¨×™×©×•×™</label>
            <input
              type="text"
              value={form.licensePlate}
              onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-slate-600 text-sm font-medium mb-2">×¡×˜×˜×•×¡</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">×–×ž×™×Ÿ</option>
              <option value="maintenance">×‘×ž×•×¡×š</option>
              <option value="disabled">×ž×•×©×‘×ª</option>
            </select>
          </div>

          {form.status === 'maintenance' && (
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-2">×¡×™×‘×ª ×ª×—×–×•×§×”</label>
              <input
                type="text"
                value={form.maintenanceReason}
                onChange={(e) => setForm({ ...form, maintenanceReason: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {form.status === 'disabled' && (
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-2">×¡×™×‘×ª ×”×©×‘×ª×”</label>
              <input
                type="text"
                value={form.disableReason}
                onChange={(e) => setForm({ ...form, disableReason: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {(form.status === 'maintenance' || form.status === 'disabled') && (
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-2">×ª××¨×™×š ×—×–×¨×” ×ž×©×•×¢×¨</label>
              <input
                type="date"
                value={form.returnDate}
                onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-50 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors"
            >
              ×‘×™×˜×•×œ
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              ×©×ž×•×¨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// User Add/Edit Modal
const UserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    role: user?.role || 'user',
    status: user?.status || 'active',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const departments = ['×”× ×”×œ×”', '×ž×›×™×¨×•×ª', '×©×™×•×•×§', '×œ×•×’×™×¡×˜×™×§×”', '×¤×™×ª×•×—', '×ž×©××‘×™ ×× ×•×©', '×›×¡×¤×™×', '×ª×¤×¢×•×œ'];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-40" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
          <h2 className="text-xl font-bold text-slate-800">{user ? '×¢×¨×™×›×ª ×ž×©×ª×ž×©' : '×”×•×¡×¤×ª ×ž×©×ª×ž×©'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-slate-600 text-sm font-medium mb-2">×©× ×ž×œ×</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-slate-600 text-sm font-medium mb-2">××™×ž×™×™×œ</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-slate-600 text-sm font-medium mb-2">×˜×œ×¤×•×Ÿ</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="050-1234567"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-slate-600 text-sm font-medium mb-2">×ž×—×œ×§×”</label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">×‘×—×¨ ×ž×—×œ×§×”</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-slate-600 text-sm font-medium mb-2">×ª×¤×§×™×“</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">×ž×©×ª×ž×© ×¨×’×™×œ</option>
              <option value="admin">×ž× ×”×œ</option>
            </select>
          </div>
          
          <div>
            <label className="block text-slate-600 text-sm font-medium mb-2">×¡×˜×˜×•×¡</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">×¤×¢×™×œ</option>
              <option value="inactive">×œ× ×¤×¢×™×œ</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              ×‘×™×˜×•×œ
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              ×©×ž×•×¨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App Component
const FleetManagementApp = () => {
  const [user, setUser] = useState(null);
  import { useVehicles, useBookings, useUsers } from './useFirestore';

  const { data: vehicles, addItem: addVehicle } = useVehicles();
  const { data: bookings, addItem: addBooking } = useBookings();

  const [bookings, setBookings] = useState(initialBookings);
  const [users, setUsers] = useState(initialUsers);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [toast, setToast] = useState(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [weekStart, setWeekStart] = useState(getDateString(new Date()));
  const [selectedDate, setSelectedDate] = useState(getDateString(new Date()));

  const isAdmin = user && adminUsers.some(admin => admin.toLowerCase() === user.toLowerCase() || admin === user);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLogin = (name) => {
    setUser(name);
    showToast(`×‘×¨×•×š ×”×‘×, ${name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedVehicle(null);
  };

  const handleBook = (bookingData) => {
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      userName: user,
      color: generateUserColor(user),
    };
    setBookings([...bookings, newBooking]);
    setSelectedVehicle(null);
    showToast('×”×”×–×ž× ×” × ×•×¡×¤×” ×‘×”×¦×œ×—×”!');
  };

  const handleDeleteBooking = (bookingId) => {
    setBookings(bookings.filter(b => b.id !== bookingId));
    showToast('×”×”×–×ž× ×” × ×ž×—×§×”');
  };

  const handleAddVehicle = (vehicleData) => {
    const newVehicle = {
      id: Date.now(),
      ...vehicleData,
      image: null,
    };
    setVehicles([...vehicles, newVehicle]);
    showToast('×”×¨×›×‘ × ×•×¡×£ ×‘×”×¦×œ×—×”!');
  };

  const handleUpdateVehicle = (vehicleId, vehicleData) => {
    setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, ...vehicleData } : v));
    showToast('×”×¨×›×‘ ×¢×•×“×›×Ÿ ×‘×”×¦×œ×—×”!');
  };

  const handleDeleteVehicle = (vehicleId) => {
    setVehicles(vehicles.filter(v => v.id !== vehicleId));
    setBookings(bookings.filter(b => b.vehicleId !== vehicleId));
    showToast('×”×¨×›×‘ × ×ž×—×§');
  };

  // User management handlers
  const handleAddUser = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: getDateString(new Date()),
    };
    setUsers([...users, newUser]);
    showToast('×”×ž×©×ª×ž×© × ×•×¡×£ ×‘×”×¦×œ×—×”!');
  };

  const handleUpdateUser = (userId, userData) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...userData } : u));
    showToast('×”×ž×©×ª×ž×© ×¢×•×“×›×Ÿ ×‘×”×¦×œ×—×”!');
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.role === 'admin') {
      showToast('×œ× × ×™×ª×Ÿ ×œ×ž×—×•×§ ×ž×©×ª×ž×© ×ž× ×”×œ', 'error');
      return;
    }
    setUsers(users.filter(u => u.id !== userId));
    showToast('×”×ž×©×ª×ž×© × ×ž×—×§');
  };

  const filteredVehicles = showOnlyAvailable
    ? vehicles.filter(v => v.status === 'available')
    : vehicles;

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 pb-6" dir="rtl">
      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Car size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-slate-800 font-bold">× ×™×”×•×œ ×¦×™ ×¨×›×‘×™×</h1>
              <p className="text-slate-500 text-sm">×©×œ×•×, {user} {isAdmin && '(×ž× ×”×œ)'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <LogOut size={20} className="text-slate-500" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {isAdmin ? (
          <div className="space-y-6">
            <AdminDashboard
              vehicles={vehicles}
              bookings={bookings}
              users={users}
              onUpdateVehicle={handleUpdateVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onAddVehicle={handleAddVehicle}
              onDeleteBooking={handleDeleteBooking}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
            
            {/* Weekly Gantt Chart for Admin */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-800 font-bold text-lg flex items-center gap-2">
                  <Calendar size={20} />
                  ×œ×•×— ×©×‘×•×¢×™
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWeekStart(addDays(weekStart, -7))}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <ChevronRight size={18} className="text-slate-600" />
                  </button>
                  <span className="text-slate-600 text-sm min-w-[140px] text-center">
                    {formatDate(weekStart)} - {formatDate(addDays(weekStart, 6))}
                  </span>
                  <button
                    onClick={() => setWeekStart(addDays(weekStart, 7))}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={18} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => setWeekStart(getDateString(new Date()))}
                    className="px-3 py-2 bg-blue-500/20 text-blue-400 text-sm rounded-lg hover:bg-blue-500/30 transition-colors mr-2"
                  >
                    ×”×™×•×
                  </button>
                </div>
              </div>
              <WeeklyGantt vehicles={vehicles} bookings={bookings} weekStart={weekStart} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter bar */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2
                    ${showOnlyAvailable ? 'bg-emerald-500 text-slate-800' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <Filter size={16} />
                  {showOnlyAvailable ? '×ž×¦×™×’ ×–×ž×™× ×™× ×‘×œ×‘×“' : '×”×¦×’ ×¨×§ ×–×ž×™× ×™×'}
                </button>
              </div>
              <div className="text-slate-400 text-sm">
                {filteredVehicles.length} ×¨×›×‘×™×
              </div>
            </div>

            {/* Vehicle cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  bookings={bookings}
                  selectedDate={selectedDate}
                  onSelect={setSelectedVehicle}
                />
              ))}
            </div>

            {/* Weekly Gantt Chart for Users */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-800 font-bold text-lg flex items-center gap-2">
                  <Calendar size={20} />
                  ×œ×•×— ×©×‘×•×¢×™
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWeekStart(addDays(weekStart, -7))}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <ChevronRight size={18} className="text-slate-600" />
                  </button>
                  <span className="text-slate-600 text-sm min-w-[140px] text-center">
                    {formatDate(weekStart)} - {formatDate(addDays(weekStart, 6))}
                  </span>
                  <button
                    onClick={() => setWeekStart(addDays(weekStart, 7))}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={18} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => setWeekStart(getDateString(new Date()))}
                    className="px-3 py-2 bg-blue-500/20 text-blue-400 text-sm rounded-lg hover:bg-blue-500/30 transition-colors mr-2"
                  >
                    ×”×™×•×
                  </button>
                </div>
              </div>
              <WeeklyGantt vehicles={vehicles} bookings={bookings} weekStart={weekStart} onBookFromGantt={handleBook} isUserView={true} />
            </div>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {selectedVehicle && (
        <BookingModal
          vehicle={selectedVehicle}
          bookings={bookings}
          onClose={() => setSelectedVehicle(null)}
          onBook={handleBook}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FleetManagementApp;
