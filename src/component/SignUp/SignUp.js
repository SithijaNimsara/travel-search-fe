import React, { useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Footer from '../Footer/Footer';
import axios from 'axios';

export default function SignUp() {

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [states, setStates] = useState('');
    const [country, setCountry] = useState('');
    const [image, setImage] = useState([]);
    const [checkBusiness, setCheckBusiness] = useState(false);
    const [businessType, setBusinessType] = useState(1);

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "username"){
            setUserName(value);
        }
        if(id === "email"){
            setEmail(value);
        }
        if(id === "password"){
            setPassword(value);
        }
        if(id === "address"){
            setAddress(value);
        }
        if(id === "state"){
            setStates(value);
        }
        if(id === "country"){
            setCountry(value);
        }
        if(id === "checkBusiness"){
            setCheckBusiness(e.currentTarget.checked);
        }
        if(id === "businessType"){
           setBusinessType(value)
        }
    }

    function registerClick() {
        const formData = new FormData();
        const blob = new Blob([image], {type: image.type});
        const data = {
            name: userName,
            email: email,
            password: password,
            address: address,
            state: states,
            country: country
        }
        if(checkBusiness) {
            data["type"] = businessType; 
        }
        const json = JSON.stringify(data);
        const newData = new Blob([json], {
            type: 'application/json'
        });

        formData.append("image", blob, {
            type: "application-octet-stream"
        });
        formData.append("data", newData);

        axios.post("create-user", formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            }
        })
        .then(response => {
            console.log("response ", JSON.stringify(response));
        })
    }

    function handleUploadImage(image) {
        setImage(image.target.files[0])
    }

    return (
            <div id="signin-container-1">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sofia&effect=outline|emboss|fire"></link>
                <div id="signin-container-2">
                    <h1 className='font-effect-fire' id='header'><i>TravelWithUs</i></h1>
                    <h2 id="sign-in" className='my-4 text-center'>Sign Up</h2>

                    <Stack gap={0.1} className="col-md-3 mb-4 mx-auto">
                        <Form.Control accept="image/*" id="profile-btn" onChange={(e) => handleUploadImage(e)}
                            multiple type="file">
                        </Form.Control>
                    </Stack>

                    <Stack direction="horizontal" className="col-md-6 mx-auto" >
                        <Form.Group className="mb-4" id="signup-text">
                            <Form.Control type="text" placeholder="Username" id="username" value={userName} onChange={(e) => handleInputChange(e)} />
                        </Form.Group>
                        <Form.Group className="mb-4" id="signup-text">
                            <Form.Control type="email" placeholder="Email" id="email" value={email} onChange={(e) => handleInputChange(e)} />
                        </Form.Group>
                    </Stack>

                    <Stack direction="horizontal" className="col-md-6 mx-auto" >
                        <Form.Group className="mb-4" id="signup-text">
                            <Form.Control type="password" placeholder="Password" id="password" value={password} onChange={(e) => handleInputChange(e)} />
                        </Form.Group>
                        <Form.Group className="mb-4" id="signup-text">
                            <Form.Control type="text" placeholder="Address" id="address" value={address} onChange={(e) => handleInputChange(e)} />
                        </Form.Group>
                    </Stack>

                    <Stack  direction="horizontal" className="col-md-6 mb-4 mx-auto" >
                        <Form.Group className="mb-4" id="signup-text">
                            <Form.Control type="text" placeholder="State/District" id="state" value={states} onChange={(e) => handleInputChange(e)} />
                        </Form.Group>
                        <Form.Group className="mb-4" id="signup-text">
                            <Form.Control type="text" placeholder="Country" id="country" value={country} onChange={(e) => handleInputChange(e)} />
                        </Form.Group>
                    </Stack>

                <Stack className="col-md-3 mx-auto">
                        <Form.Group className="mb-3">
                            <Form.Check type="checkbox" checked={checkBusiness} id="checkBusiness" style={{color:'white', fontSize:'24px'}} label="Business" onChange={(e) => handleInputChange(e)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" style={{width:'85%'}}>
                            <Form.Select aria-label="Default select example" id="businessType" disabled={!checkBusiness} onChange={(e) => handleInputChange(e)}>
                                <option value="1">Hotel</option>
                                <option value="2">Restaurent</option>
                            </Form.Select>
                        </Form.Group>
                    </Stack>

                    <Stack gap={0.1} className="col-md-3 mt-3 mx-auto">
                        <Button variant="primary" onClick={registerClick} style={{width:'85%'}}>Register</Button>
                    </Stack>
                    
                    <Footer></Footer>
                    </div>
            </div>
    )   
    
}
