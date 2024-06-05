import React, { useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Footer from '../Footer/Footer';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom"
export default function SignUp() {

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [states, setStates] = useState('');
    const [country, setCountry] = useState('');
    const [image, setImage] = useState([]);
    const [checkBusiness, setCheckBusiness] = useState(false);
    const [setBusinessType] = useState(1);

    const [alertTitle, setAlertTitle] = useState('success');
    const [alertMsg, setAlertMsg] = useState('');
    const [open, setOpen] = useState(false);
    const [vertical] = useState('top');
    const [horizontal] = useState('right');
    const navigate = useNavigate();

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
            // data["type"] = businessType; 
            data["role"] = "BUSINESS";
        }else {
            data["role"] = "USER";
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
            if(response.status === 201) {
                setOpen(true);
                setAlertTitle('success');
                setAlertMsg('Successfully Create a Account. \nPlease Login to the System.');
                const timer = setTimeout(() => {  
                    navigate('/')
                }, 1000);
                return () => clearTimeout(timer);
            }else {
                setOpen(true);
                setAlertTitle('error')
                setAlertMsg('Something went wrong')  
            }
        })
        .catch((error) => {
            console.log(error.response);
            if (error.response.status === 409) {
                setOpen(true);
                setAlertTitle('error')
                setAlertMsg(error.response.data)  
            }else {
                setOpen(true);
                setAlertTitle('error')
                setAlertMsg('Something went wrong')  
            }
        });
    }

    function handleUploadImage(image) {
        setImage(image.target.files[0])
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

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
                    <div>
                        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>  
                            <Alert onClose={handleClose} severity={alertTitle} sx={{ width: '100%' }}>
                                {alertMsg}
                            </Alert>
                        </Snackbar>
                    </div>
                    <Footer></Footer>
                    </div>
            </div>
    )   
    
}
