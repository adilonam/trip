'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';

interface Vehicle {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  type: string;
  mileage: number;
  availability: boolean;
  requiredLicenseType: string;
  specialEquipment: string;
  registrationCertificate: string;
  technicalInspectionDate: string;
  vignetteExpirationDate: string;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: '',
    brand: '',
    model: '',
    type: '',
    mileage: '', // Kept as string to use in the input field but will need conversion before submission
    availability: true, // Assuming default availability is true
    requiredLicenseType: '',
    specialEquipment: '',
    registrationCertificate: '',
    technicalInspectionDate: '',
    vignetteExpirationDate: '',
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get<Vehicle[]>('http://localhost:8080/api/v1/vehicles');
        setVehicles(response.data);
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

    fetchVehicles();
  }, []);

  const handleCreateVehicle = async (event: FormEvent) => {
    event.preventDefault();
    const vehicleToCreate = {
      ...newVehicle,
      mileage: parseFloat(newVehicle.mileage), // Convert mileage to a float before sending
    };

    try {
      const response = await axios.post<Vehicle>('http://localhost:8080/api/v1/vehicles', vehicleToCreate);
      setVehicles(prevVehicles => [...prevVehicles, response.data]);
      setNewVehicle({
        registrationNumber: '',
        brand: '',
        model: '',
        type: '',
        mileage: '',
        availability: true,
        requiredLicenseType: '',
        specialEquipment: '',
        registrationCertificate: '',
        technicalInspectionDate: '',
        vignetteExpirationDate: '',
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || err.message);
      } else {
        setError('Failed to create vehicle');
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewVehicle({ ...newVehicle, [name]: value });
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Vehicles List</h1>
      <ul className="list-disc pl-5 mb-4">
        {vehicles.map(vehicle => (
          <li className="my-2" key={vehicle.id}>
            {vehicle.brand} {vehicle.model} - Registration: {vehicle.registrationNumber}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Create Vehicle</h2>
        <form onSubmit={handleCreateVehicle} className="grid grid-cols-1 gap-3">
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="registrationNumber" placeholder="Registration Number" value={newVehicle.registrationNumber} onChange={handleInputChange} required />
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="brand" placeholder="Brand" value={newVehicle.brand} onChange={handleInputChange} required />
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="model" placeholder="Model" value={newVehicle.model} onChange={handleInputChange} required />
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="type" placeholder="Type" value={newVehicle.type} onChange={handleInputChange} required />
       
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="mileage" placeholder="Mileage" value={newVehicle.mileage} onChange={handleInputChange} required />
          <label className="inline-flex items-center mt-3">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" checked={newVehicle.availability} onChange={(e) => setNewVehicle({ ...newVehicle, availability: e.target.checked })} /><span className="ml-2 text-gray-700">Available</span>
          </label>
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="requiredLicenseType" placeholder="Required License Type" value={newVehicle.requiredLicenseType} onChange={handleInputChange} required />
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="specialEquipment" placeholder="Special Equipment" value={newVehicle.specialEquipment} onChange={handleInputChange} />
          <input className="border-2 border-gray-300 p-2 text-black" type="text" name="registrationCertificate" placeholder="Registration Certificate" value={newVehicle.registrationCertificate} onChange={handleInputChange} required />
          <input className="border-2 border-gray-300 p-2 text-black" type="date" name="technicalInspectionDate" placeholder="Technical Inspection Date" value={newVehicle.technicalInspectionDate} onChange={handleInputChange} required />
          <input className="border-2 border-gray-300 p-2 text-black" type="date" name="vignetteExpirationDate" placeholder="Vignette Expiration Date" value={newVehicle.vignetteExpirationDate} onChange={handleInputChange} required />
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" type="submit">Create Vehicle</button>
        </form>
      </div>
    </div>
  );
};

