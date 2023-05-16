import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import '../../App.css';
import Footer from '../Footer/Footer';
import axios from 'axios';
import { useNavigate } from "react-router-dom"

export default function SignIn() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);

    const [alertTitle, setAlertTitle] = useState('success');
    const [alertMsg, setAlertMsg] = useState('');


    const [vertical, setVertical] = useState('top');
    const [horizontal, setHorizontal] = useState('right');
    const navigate = useNavigate()

    function logInClick() {
        const data = {
            name: email,
            password: password,
        }
        axios.post("login-user", data).then(response => {
            if(response.status === 200) {
                const authToken = response.data['jwt'];
                localStorage.setItem("token", authToken);
                localStorage.setItem("id", response.data['userId'])
                axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
                setOpen(true);
                setAlertMsg('Successfully login to the system')
                if(response.data['role'] === "USER") {
                    navigate('/user-home', { state: { data: response.data } })
                }else {
                    navigate('/hotel-home', { state: { data: response.data } })
                }
                
            }
        }).catch(error => {
            if(error.response.data.status === 401) {
                setOpen(true);
                setAlertTitle('error')
                setAlertMsg('Invalid user credentials')
            }else {
                setOpen(true);
                setAlertTitle('error')
                setAlertMsg('Something went wrong')
            }
        })
    }

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "email"){
            setEmail(value);
        }
        if(id === "password"){
            setPassword(value);
        }
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
                <h2 id="sign-in" className='my-5 text-center'>Sign In</h2>
                
                <Stack gap={0.1} className="col-md-3 mb-4 mx-auto" >
                    <Form.Group className="mb-3">
                        <Form.Control type="email" placeholder="Name" id="email" value={email} onChange={(e) => handleInputChange(e)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control type="password" placeholder="Password" id="password" value={password} onChange={(e) => handleInputChange(e)}/>
                    </Form.Group>
                </Stack>

                <Stack gap={3} className="col-md-3 mx-auto">
                    {/* <Button variant="primary" onClick={() => history.push('/user/home')}>Sign In</Button>
                    <Button variant="secondary" onClick={() => history.push('/hotel/home')}>Register</Button> */}
                    <Button variant="primary" onClick={logInClick}>Sign In</Button>
                    <Button variant="secondary" onClick={() => navigate('/sign-up')}>Register</Button>
                </Stack>
            </div>
            <div>
                <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>  
                    <Alert onClose={handleClose} severity={alertTitle} sx={{ width: '100%' }}>
                        {alertMsg}
                    </Alert>
                </Snackbar>

            </div>
            <Footer></Footer>
        </div>

        );
    
}
 
