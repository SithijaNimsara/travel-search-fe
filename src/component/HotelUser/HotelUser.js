import React, { Component, useEffect, useState } from 'react';
import { FaComment, FaUser, FaSignOutAlt, FaFileUpload, FaTelegramPlane, FaTrash, FaTimes } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Gallery } from "react-grid-gallery";
import Footer from '../Footer/Footer';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Modal from "react-modal";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");
const images = [
    {
       src: require('../../asset/hotel.jpg'),
       width: "50",
       height: "50",
      
       
    },
    {
       src: require('../../asset/hotel.jpg'),
       width: "50",
       height: "50",
       tags: [
          { value: "Ocean", title: "Ocean" },
          { value: "People", title: "People" },
       ],
       alt: "Boats (Jeshu John - designerspics.com)",
    },
  
    {
    src: require('../../asset/hotel.jpg'),
       width: "50",
       height: "50",
    },
    
 ];

export default function HotelUser() {

    const location = useLocation();
    const [hotelInfo, setHotelInfo] = useState([]);
    const [blobUrl, setBlobUrl] = useState("");
    const [caption, setCaption] = useState('');
    const [postImage, setPostImage] = useState('');
    const [postInfo, setPostInfo] = useState([]);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [selectComment, setSelectComment] = useState(-1);
    const [commentInfo, setCommentInfo] = useState([]);
    const [alertTitle, setAlertTitle] = useState('success');
    const [alertMsg, setAlertMsg] = useState('');
    const [open, setOpen] = useState(false);
    const [vertical, setVertical] = useState('top');
    const [horizontal, setHorizontal] = useState('right');
    const data = location.state?.data || '';
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem("token")
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
        let hotelId = data['userId'];
        getHotelInfor(hotelId)
        getAllPost(hotelId)

    }, [])

    const getHotelInfor =(hotelId) => {
        axios.get(`user-infor/${hotelId}`)
            .then(response => {
                setHotelInfo(response.data);    
                setBlobUrl(convertImage(response.data.image))

            })
            .catch((error) => {
                console.log(error);
            });
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

    const toggleModal=(postId) => {
        setIsCommentOpen(!isCommentOpen)
        setSelectComment(postId)
        if(!isCommentOpen) {
            axios.get(`get-comment/${postId}`)
                .then(res => {
                    return res.data
                })
                .then(data =>{
                    setCommentInfo(data)
                })
        }
    }

    const handlePostCaptionChange = (e) => {
        const {id , value} = e.target;
        if(id === "caption"){
            setCaption(value);
        }
    }

    function handleUploadPostImage(image) {
        setPostImage(image.target.files[0])
    }

    function sendPost() {
        const formData = new FormData();
        const blob = new Blob([postImage], {type: postImage.type});

        const data = {
            hotelId: localStorage.getItem("id"),
            caption: caption
        }
        const json = JSON.stringify(data);
   
        const newData = new Blob([json], {
            type: 'application/json'
        });

        formData.append("image", blob, {
            type: "application-octet-stream"
        });
        formData.append("data", newData);

        axios.post("create-post", formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            }
        })
        .then(async response => {
            if(response.status === 201) {
                setOpen(true);
                setAlertTitle('success')
                setAlertMsg('Successfully create a new post')
                const response = await axios.get(`all-post/${localStorage.getItem("id")}`);
                setPostInfo(response.data);
                
            }else {
                setOpen(true);
                setAlertTitle('error')
                setAlertMsg('Failed to create new post')  
            }
        }).catch(error => {
            setOpen(true);
            setAlertTitle('error')
            setAlertMsg('Something went wrong')    
        })
    }


    const deletePost= (postId) => {
        console.log("dele");
        axios.delete(`delete-post/${postId}`).then(async response => {
            if(response.status===204) {
                const response = await axios.get(`all-post/${localStorage.getItem("id")}`);
                setPostInfo(response.data);
                setOpen(true);
                setAlertTitle('success')
                setAlertMsg('Successfully delete the post')
            }else {
                setOpen(true);
                setAlertTitle('error')
                setAlertMsg('Something went wrong')  
            }
        }).catch(error => {
            setOpen(true);
            setAlertTitle('error')
            setAlertMsg('Something went wrong')    
        })
    }

    const getAllPost =(hotelId)  => {
        axios.get(`all-post/${hotelId}`).then(res => {
            return res.data
        })
        .then(data =>{
            setPostInfo(data)
        })
    }
    
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
                                <Gallery images={images} /> 
                            </div>
                        </div>
                        <div id="middle">
                            {postInfo.map(item => (
                                <div id="content-middle">
                                    <img src={convertImage(item.hotelDetailsDto['hotelImage'])} alt="hotel" style={{width:"55px", height:"55px", borderRadius:"100%"}} />
                                    <Button id="delete-btn" onClick={() =>deletePost(item.postDetailsDto['postId'])}><FaTrash /></Button>
                                    <h2 className='font-effect-shadow-multiple' id='post-header'>{item.hotelDetailsDto['name']}</h2>
                                    
                                    <p id='post-time'>{dateFormat(item.postDetailsDto['time'])}</p>
                                   
                                    <h6>{item.postDetailsDto['caption']}</h6>
                                    <img src={convertImage(item.postDetailsDto['postImage'])} alt="post" style={{width:"100%", height:"60%"}} />
                                    
                                    <h3 id="hotel-like-count"><b>{item.likeDetailsDto['likeCount']} Likes</b></h3>
                                    <Button id="hotel-comment-btn" onClick={() => toggleModal(item.postDetailsDto['postId'])}>
                                        <FaComment />
                                    </Button>
                                

                                    <Modal isOpen={isCommentOpen} onRequestClose={toggleModal} contentLabel="Comments" className="comment-modal" overlayClassName="comment-overlay">
                                        <h2 className='mb-4 font-effect-shadow-multiple' id='username'>Comments</h2>
                                        <div className='comment-list'>
                                            {commentInfo.map(element =>  
                                                <div>
                                                    <hr></hr>
                                                    {/* <img src={require('../../asset/person.jpg')} alt="person" style={{width:"55px", height:"55px", borderRadius:"100%"}} /> */}
                                                    <img src={convertImage(element.userImage)} alt="person" style={{width:"55px", height:"55px", borderRadius:"100%"}} />
                                                    <h3 className='font-effect-shadow-multiple' id='comment-header'>{element.userName}</h3>
                                                    <h4 id='post-comment'>{element.comment}</h4>
                                                    <p id='comment-time'>{dateFormat(element.time)}</p>
                                                </div>                                      
                                            )}
                                            
                                            <hr></hr>

                                            <div hidden={commentInfo.length!==0}>
                                                <h5 id="no-content">No comment</h5>
                                                <hr></hr>
                                            </div>                                            
                                        </div>                                       
                                    </Modal>
                                </div>
                            ))}                            
                        </div>
                        
                        <div id="right">
                            <div id="content">
                                <h2 id='rate-header' className='font-effect-shadow-multiple'>Create Post</h2>
                                <div className="create-post">

                                    {/* <Form.Control accept="image/*" placeholder='Choose a Image' id="img-upload-2" onChange={(e) => handleUploadPostImage(e)}
                                        multiple type="file">
                                    </Form.Control> */}

                                    <input type="file" multiple accept="image/*" style={{ display: 'none' }} id="file-input" onChange={(e) => handleUploadPostImage(e)}/>
                                    <label htmlFor="file-input">
                                        <Button id="img-upload-2" as="span">
                                        Choose Image: <FaFileUpload/>
                                        </Button>
                                    </label>


                                    {/* <h5>Choose Image:</h5>
                                    <Button id="img-upload-2" accept="image/*" multiple type="file" onChange={(e) => handleUploadPostImage(e)}>
                                        <FaFileUpload/>
                                    </Button> */}
                                    
                                </div>
                                <div className="create-post">
                                    <textarea rows="5" id="caption" value={caption} onChange={(e) => handlePostCaptionChange(e)}></textarea>
                                    <Button onClick={sendPost}>Post<FaTelegramPlane/></Button>
                                </div>
                                
                                <span id='line-1' className='mb-3'></span>
                                <div className="create-post">
                                    <h4><b>Add Image:</b></h4>
                                    <Button>Add Image<FaFileUpload/></Button>
                                </div>
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
        );
    
}
 
// export default HotelUser;