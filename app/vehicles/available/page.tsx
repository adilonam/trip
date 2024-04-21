// pages/vehicles.tsx

'use client';

import React, { useState, FormEvent } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { useSession } from 'next-auth/react';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  licensePlate: string;
  year: number;
}

export default function Vehicles() {
  const { data: session } = useSession();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/missions/available-vehicles`;

  const fetchVehicles = async (start: string, end: string) => {
    if (!session) {
      setError('Please sign in to view vehicles.');
      return;
    }

    setIsLoading(true);
    const axiosRequestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    };

    try {
      const response = await axios.get<Vehicle[]>(`${apiUrl}?startDate=${start}&endDate=${end}`, axiosRequestConfig);
      setError(null);
      setVehicles(response.data);
    } catch (error: unknown) { // Error is typed as unknown
      if (axios.isAxiosError(error)) {
        // Handle AxiosErrors
        setError(error.response?.data?.error || 'An error occurred while fetching vehicles.');
      } else {
        // Handle non-Axios errors
        setError('A non-specific error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (startDate && endDate) {
      fetchVehicles(startDate, endDate);
    } else {
      setError('Please select both start and end dates.');
    }
  };

  if (!session) {
    return <div>Please sign in to view vehicles.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Available Vehicles</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="startDate" className="mr-2">Start Date:</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          className='text-black'
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <label htmlFor="endDate" className="mx-2">End Date:</label>
        <input
          id="endDate"
          type="date"
          className='text-black'
          value={endDate}
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
        {!isLoading && !error && vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <li key={vehicle.id} className="my-2">
              {vehicle.id} -  {vehicle.model} 
            </li>
          ))
        ) : (
          <li>No vehicles found.</li>
        )}
      </ul>
    </div>
  );
}
