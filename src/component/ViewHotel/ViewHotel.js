import React, {  useEffect, useState } from 'react';
import { FaUser, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Footer from '../Footer/Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Modal from "react-modal";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

export default function ViewHotel() {

   
    const {id} = useParams()
    const port = window.location.origin;
    const allPostUrl = `${port}/all-post/${id}`;
    const userInforUrl = `${port}/user-infor/${id}`;
    const galleryUrl = `${port}/get-gallery-image`;
    const [hotelInfo, setHotelInfo] = useState([]);
    const [blobUrl, setBlobUrl] = useState("");   
    const [blobGalleryUrl, setBlobGalleryUrl] = useState("");   
    const [postInfo, setPostInfo] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState('success');
    const [alertMsg, setAlertMsg] = useState('');
    const [open, setOpen] = useState(false);
    const [vertical, setVertical] = useState('top');
    const [horizontal, setHorizontal] = useState('right');
    const [totalItem, setTotalItem] = useState(0);
    const [boolNext, setBoolNext] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem("token")
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

        getHotelInfor();
        getAllPost();

    }, [])

    const getHotelInfor =() => {
        axios.get(userInforUrl)
            .then(response => {
                setHotelInfo(response.data);    
                setBlobUrl(convertImage(response.data.image))
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getAllPost =()  => {
        axios.get(allPostUrl).then(res => {
            return res.data
        })
        .then(data =>{
            setPostInfo(data)
        })
    }

    const convertImage =(image) => {
        let postBaseUrl=''
        const byteCharacters = atob(image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'image/jpeg'});
        postBaseUrl = (URL.createObjectURL(blob));
        return postBaseUrl;
    }

    const dateFormat =(data) => {
        return moment(data).format('YYYY-MM-DD HH:mm:ss')
    }

    const toggleModal=() => {
        axios.get(galleryUrl, {
            params: { hotelId: id,
                      index: 0  
                    },
        }).then(res => {
            return res.data
        })
        .then(data =>{
            setBlobGalleryUrl(convertImage(data['image']))
            setGallery(data)
            setTotalItem(data['totalItem'])
            setIsCommentOpen(!isCommentOpen)
            console.log(currentImage, "-", totalItem);
            if(currentImage===totalItem-1) {
                console.log("setBoolNext");
                setBoolNext(false)
            }else {
                setBoolNext(true)
            }
        }).catch(error => {
            setOpen(true);
            setAlertTitle('error')
            setAlertMsg('Something went wrong.')    
            setIsCommentOpen(isCommentOpen)
        })
    }

    const nextImage = () => {
        if(boolNext) {
            setCurrentImage(currentImage => currentImage + 1);   
        } 
    };

    const prevImage = () => {
        if(currentImage!==0) {
            setCurrentImage(currentImage => currentImage - 1);
        }      
    };

    useEffect(() => {
        try {
            const response = axios.get(galleryUrl, {
                params: { hotelId: id,
                            index: currentImage  
                        },
            })
            .then(data => {
                setGallery(data.data)
                setTotalItem(data.data['totalItem'])
                setBlobGalleryUrl(convertImage(data.data['image']))
                console.log(currentImage, "-", totalItem);
                if(currentImage===totalItem-1) {
                    console.log("setBoolNext");
                    setBoolNext(false)
                }else {
                    setBoolNext(true)
                }

            })       
        } catch (error) {
            setOpen(true);
            setAlertTitle('error')
            setAlertMsg('Something went wrong')    
        }
    }, [currentImage])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    const logOut = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("id")
        navigate('/')
    };


    return (
        <div id="container-1">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sofia&effect=outline|emboss|fire"></link>
            <div id="container-2">
                <div id="nav" style={{clear: 'both'}}>
                    <div id="nav-1">
                        <h1 className='font-effect-fire' id='header'><i>TravelWithUs</i></h1>
                    </div>

                    <div style={{display:'none'}}>  
                        <Form.Group>
                            <Form.Control type="text" id="search-field" placeholder="Search" />
                        </Form.Group>
                    </div>
                        
                    <div id="nav-3">
                        <Button id="logout-btn" onClick={logOut}> 
                            <FaSignOutAlt />
                        </Button>
                        <Button id="person-btn">
                            <FaUser />
                        </Button>
                    </div>
                </div> 




                    <div id="body">
                        <div id="left">
                            <div id="content">
                                <h2 className='mb-4 font-effect-shadow-multiple' id='username'>{hotelInfo.name}</h2>
                                <div id='person-img' className='mb-4'>
                                    {/* <img src={require('../../asset/hotel.jpg')} alt="person" style={{width:"100px", height:"100px", borderRadius:"100%"}} /> */}
                                    <img src={blobUrl} alt="hotel" style={{width:"100px", height:"100px", borderRadius:"100%"}} />
                                </div>
                                <h4 className='mb-3'>{hotelInfo.address}</h4>
                                <h4 className='mb-3'>{hotelInfo.state}</h4>
                                <h4 className='mb-3'>{hotelInfo.country}</h4>

                                <Button onClick={() => toggleModal()}>
                                    View Images
                                </Button>

                                <Modal isOpen={isCommentOpen} onRequestClose={toggleModal} contentLabel="Comments" id="gallery-modal" className="comment-modal" overlayClassName="comment-overlay">
                                    <h2 className='mb-4 font-effect-shadow-multiple' id='username'>Gallery</h2>
                                    <div className="gallery-container">
                                        <img src={blobGalleryUrl} alt="hotel" className='gallery-image'/>
                                    </div>
                                    
                                    <div className="gallery-btn-container">
                                        <button className='gallery-btn' onClick={prevImage} ><FaChevronLeft /></button>
                                        <p>{gallery["currentPage"]+1} / {gallery["totalItem"]}</p>
                                        <button className='gallery-btn' onClick={nextImage} ><FaChevronRight /></button>
                                    </div>


                                </Modal>
                                
                            </div>
                        </div>
                        <div id="middle">
                            {postInfo.map(item => (
                                <div id="content-middle">
                                    <img src={convertImage(item.hotelDetailsDto['hotelImage'])} alt="hotel" style={{width:"55px", height:"55px", borderRadius:"100%"}} />
                                    {/* <Button id="delete-btn" onClick={() =>deletePost(item.postDetailsDto['postId'])}><FaTrash /></Button> */}
                                    <h2 className='font-effect-shadow-multiple' id='post-header'>{item.hotelDetailsDto['name']}</h2>
                                    
                                    <p id='post-time'>{dateFormat(item.postDetailsDto['time'])}</p>
                                   
                                    <h6>{item.postDetailsDto['caption']}</h6>
                                    <img src={convertImage(item.postDetailsDto['postImage'])} alt="post" style={{width:"100%", height:"60%"}} />
                                   
                                </div>
                            ))}                            
                        </div>
                        
                        <div id="right">
                            <div id="content">
                            <h2 id='rate-header' className='font-effect-shadow-multiple'>About Us</h2>
                            <p className="indented-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at sagittis tellus, ut vulputate sem. Cras efficitur dapibus dolor id molestie. Sed euismod tellus a justo dapibus tincidunt. Fusce eu ipsum urna. Nullam vitae metus velit. Phasellus luctus semper tristique. Sed at tincidunt mauris. </p>
                            </div>
                        </div>
                    </div>                   
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
    )
}