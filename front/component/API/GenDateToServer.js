import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GenDateToServer = async( gender, birth, access_token ) => {
    console.log("good", gender, birth, access_token);

    try {
        const response = await axios.post('http://35.216.126.98:8080/api/user/update', {
            gender: gender,
            birth: birth
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        });

        console.log('Server response:', response.data);
        
    } catch (error) {
        console.error('Error:', error);
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
    }
};

export default GenDateToServer;