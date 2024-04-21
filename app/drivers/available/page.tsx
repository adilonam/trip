// pages/drivers.tsx

'use client';

import React, { useState, FormEvent } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { useSession } from 'next-auth/react';

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  dateOfBirth: string;
  cin: string;
}

export default function Drivers() {
  const { data: session } = useSession();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/missions/available-drivers`;

  const fetchDrivers = async (start: string, end: string) => {
    if (!session) {
      setError('Please sign in to view drivers.');
      return;
    }

    setIsLoading(true);
    const axiosRequestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    };

    try {
      const response = await axios.get<Driver[]>(`${apiUrl}?startDate=${start}&endDate=${end}`, axiosRequestConfig);
      setError(null);
      setDrivers(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'An error occurred while fetching drivers.');
      } else {
        setError('A non-specific error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (startDate && endDate) {
      fetchDrivers(startDate, endDate);
    } else {
      setError('Please select both start and end dates.');
    }
  };

  if (!session) {
    return <div>Please sign in to view drivers.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Available Drivers</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="startDate" className="mr-2">Start Date:</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          className="text-black"
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <label htmlFor="endDate" className="mx-2">End Date:</label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          className="text-black"
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button
          type="submit"
          className="ml-2"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {error && <div className="text-red-500">Error: {error}</div>}

      <ul className="list-disc pl-5 mb-4">
        {!isLoading && !error && drivers.length > 0 ? (
          drivers.map((driver) => (
            <li key={driver.id} className="my-2">
              {driver.id} - {driver.firstName} {driver.lastName} - {driver.registrationNumber}
            </li>
          ))
        ) : (
          <li>No drivers found.</li>
        )}
      </ul>
    </div>
  );
}
