import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'; // Reutilizamos el CSS de tu login para mantener el estilo

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Capturamos el token y el email directamente de la URL
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        if (password !== passwordConfirmation) {
            setError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://srv1829255.hstgr.cloud/api/reset-password', {
                token: token,
                email: email,
                password: password,
                password_confirmation: passwordConfirmation
            });

            setMessage('¡Contraseña restablecida con éxito! Redirigiendo al login...');

            // Esperar 2 segundos y redirigir al login
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Hubo un error al restablecer la contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container"> {/* Usamos la clase de tu login */}
            <div className="login-box">
                <h2>Crear Nueva Contraseña</h2>
                <p>Ingresa tu nueva contraseña para la cuenta {email}</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>NUEVA CONTRASEÑA</label>
                        <input
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>CONFIRMAR CONTRASEÑA</label>
                        <input
                            type="password"
                            placeholder="Vuelve a escribir la contraseña"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-message" style={{ color: '#ff4d4d', fontSize: '14px' }}>{error}</p>}
                    {message && <p className="success-message" style={{ color: '#4caf50', fontSize: '14px' }}>{message}</p>}

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Restablecer Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
}