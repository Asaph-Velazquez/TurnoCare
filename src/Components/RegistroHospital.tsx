import React, { useState } from 'react';
import { Hospital } from '../models/Hospital';

const RegistroHospital: React.FC = () => {
    const [hospital, setHospital] = useState<Hospital>({
        nombre: '',
        direccion: '',
        telefono: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHospital({
            ...hospital,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para guardar la información
        alert('Información registrada:\n' + JSON.stringify(hospital, null, 2));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nombre:
                <input type="text" name="nombre" value={hospital.nombre} onChange={handleChange} required />
            </label>
            <br />
            <label>
                Dirección:
                <input type="text" name="direccion" value={hospital.direccion} onChange={handleChange} required />
            </label>
            <br />
            <label>
                Teléfono:
                <input type="text" name="telefono" value={hospital.telefono} onChange={handleChange} required />
            </label>
            <br />
            <button type="submit">Registrar</button>
        </form>
    );
};

export default RegistroHospital;
