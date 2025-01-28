import { StatusIcon } from '@/constants'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

const StatusBadge = ({ status }: { status: Status }) => {
  const iconSrc = StatusIcon[status];

  return (
    <div
      className={clsx('status-badge flex items-center gap-2 p-2 rounded-md', {
        'bg-green-600': status === 'scheduled',
        'bg-blue-600': status === 'pending',
        'bg-red-600': status === 'cancelled',
      })}
    >
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt={status}
          width={24}
          height={24}
          className="h-6 w-6"
        />
      ) : (
        <div className="h-6 w-6 bg-gray-300 rounded-full" />
      )}
      <p
        className={clsx('text-sm font-semibold capitalize', {
          'text-green-500': status === 'scheduled',
          'text-blue-500': status === 'pending',
          'text-red-500': status === 'cancelled',
        })}
      >
        {status}
      </p>
    </div>
  );
};

export default StatusBadge