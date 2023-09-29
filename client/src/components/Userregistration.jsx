import React, { useState } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import './userregistration.css'; // Import your CSS file
import { isMobile, isTablet, isDesktop, osName, browserName, osVersion, browserVersion } from 'react-device-detect';

const Userregistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
  });

  const handleRegister = () => {
    // Generate a salt for password hashing
    const salt = bcrypt.genSaltSync(10);
    // Hash the password
    const hashedPassword = bcrypt.hashSync(formData.password, salt);

    // Retrieve device information
   
    let device = isMobile ? 'Mobile' : isTablet ? 'Tablet' : isDesktop ? 'Desktop' : 'Unknown';

    const os = osName + osVersion;
    const browser = browserName + browserVersion;
    device += ` - ${os} - ${browser}`;
    // Retrieve device IP
    axios
      .get('https://api.ipify.org?format=json')
      .then((response) => {
        const ip = response.data.ip;
        // Retrieve current location based on IP
        axios
          .get(`https://ipapi.co/${ip}/json/`)
          .then((response) => {
            const { city, region, country, postal } = response.data;
            const location = `${city}, ${region}, ${country} - ${postal}`;

            // Create a new object with the hashed password, device IP, and location
            const user = {
              ...formData,
              password: hashedPassword,
              deviceIP: ip,
              location,
              device,
            };

            axios
              .post('http://localhost:3001/register', user)
              .then((response) => {
                console.log(response.data.message);
                // Reset form fields after successful registration
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  address: '',
                  city: '',
                  pincode: '',
                  state: '',
                });
              })
              .catch((error) => {
                console.error('Error registering user:', error);
              });
          })
          .catch((error) => {
            console.error('Error retrieving location:', error);
          });
      })
      .catch((error) => {
        console.error('Error retrieving device IP:', error);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form className="registration-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <br />
        <label>
          Address:
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </label>
        <br />
        <label>
          City:
          <input type="text" name="city" value={formData.city} onChange={handleChange} />
        </label>
        <br />
        <label>
          Pincode:
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
        </label>
        <br />
        <label>
          State:
          <input type="text" name="state" value={formData.state} onChange={handleChange} />
        </label>
        <br />
        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Userregistration;
