import React from 'react';
import { Booking } from '../types';
import { getEventTiming } from '../utils/timeUtils';
import { IntactTicketCard, TornTicketCard } from './tickets';

interface ETicketCardProps {
  booking: Booking;
  onCancel?: (booking: Booking) => void;
}

export const ETicketCard: React.FC<ETicketCardProps> = ({ booking, onCancel }) => {
  const timing = getEventTiming(booking);
  const isTorn = booking.status === 'checked_in' || timing.isExpired || booking.status === 'cancelled';

  if (isTorn) {
    return <TornTicketCard booking={booking} />;
  }

  return <IntactTicketCard booking={booking} onCancel={onCancel} />;
};
