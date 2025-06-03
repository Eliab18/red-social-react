import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanUsername = username.trim();
        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        if (!cleanUsername || !cleanEmail || !cleanPassword) {
            setMessage('Por favor, completa todos los campos correctamente.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username: cleanUsername,
                email: cleanEmail,
                password: cleanPassword
            });
            console.log(response.data);
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            setMessage(error.response ? error.response.data.message : 'Error al registrar usuario');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            pattern="^\S.*\S$|^\S$"
                            title="El nombre de usuario no puede tener espacios al inicio o al final."
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            pattern="^\S+$"
                            title="La contraseña no puede contener espacios en blanco."
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-md">
                        Registrar
                    </button>
                </form>
                {message && (
                    <p className={`mt-4 text-center ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </p>
                    
                )}
            </div>
        </div>
    );
};

export default Register;