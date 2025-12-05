import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigator = useNavigate();
    useEffect(() => {
        navigator('/');
    }, [navigator]);
    return null;
}

export default NotFound;
