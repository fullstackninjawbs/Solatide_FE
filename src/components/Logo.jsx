import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/icons/logo.png';

const Logo = ({ className = "flex items-center gap-2", asColumn = false, onClick }) => {
    return (
        <Link to="/" className={className} onClick={onClick} style={{ textDecoration: 'none' }}>
            <img 
                src={logoImg} 
                alt="Solatide Biosciences" 
                className={asColumn ? "h-20 w-auto mx-auto mb-1.5 object-contain" : "h-12 w-auto object-contain"} 
            />
        </Link>
    );
};

export default Logo;
