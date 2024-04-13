
'use client'

import React, { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  dateOfBirth: string; // Ensure this matches the expected format of the date string
  cin: string;
}

export default function Drivers() {
  const { data: session } = useSession();




  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for new driver details
  const [newDriver, setNewDriver] = useState({
    firstName: '',
    lastName: '',
    registrationNumber: '',
    dateOfBirth: '',
    cin: '',
  });

  const apiUrl = 'http://localhost:8080/api/v1/drivers'

  useEffect(() => {
    
    const fetchDrivers = async () => {
      if(!session || !session.accessToken) return

      try {
        const response = await axios.get<Driver[]>(apiUrl, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        setDrivers(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };


    fetchDrivers();
  }, [session]);

  // ... (Other functions remain unchanged)

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
// Function to handle driver creation
const handleCreateDriver = async (event: FormEvent) => {
  event.preventDefault();
  try {
    const response = await axios.post<Driver>(apiUrl, newDriver, {  headers: {
      'Authorization': `Bearer ${session?.accessToken}`
    }});
    setDrivers(prevDrivers => [...prevDrivers, response.data]);//
    // Reset the form
    setNewDriver({
      firstName: '',
      lastName: '',
      registrationNumber: '',
      dateOfBirth: '',
      cin: '',
    });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      // Handle the actual error message from the server or Axios-specific error
      setError(err.response.data.message || err.message);
    } else {
      setError('Failed to create driver');
    }
  }
};


// Function to handle form inputs changing for new driver details
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  setNewDriver({ ...newDriver, [name]: value });
};

function formatDate(isoDateString : string) {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 since months start at 0
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}


// Existing code...


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Drivers List</h1>
      <ul className="list-disc pl-5 mb-4">
        {drivers.map(driver => (
          <li className="my-2" key={driver.id}>
          {driver.id} - {driver.firstName} {driver.lastName} - {driver.cin} - {driver.registrationNumber} -  {formatDate( driver.dateOfBirth)}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Create Driver</h2>
        <form onSubmit={handleCreateDriver} className="grid grid-cols-1 gap-3">
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="firstName" placeholder="First Name" value={newDriver.firstName} onChange={handleInputChange} required />
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="lastName" placeholder="Last Name" value={newDriver.lastName} onChange={handleInputChange} required />
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="registrationNumber" placeholder="Registration Number" value={newDriver.registrationNumber} onChange={handleInputChange} required />
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="cin" placeholder="cin" value={newDriver.cin} onChange={handleInputChange} required />
          <input className="border-2 border-gray-300 p-2 text-black" type="date" name="dateOfBirth" value={newDriver.dateOfBirth} onChange={handleInputChange} required />
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" type="submit">Create Driver</button>
        </form>
      </div>
    </div>
  );
};
