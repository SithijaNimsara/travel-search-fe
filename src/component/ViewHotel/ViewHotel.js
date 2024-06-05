import React, {  useEffect, useState, useCallback, useRef } from 'react';
import { FaUser, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaTimes, FaThumbsUp, FaComment, FaTelegramPlane } from 'react-icons/fa';
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
    const likeUrl = `${port}/add-like`;
    const [hotelInfo, setHotelInfo] = useState([]);
    const [blobUrl, setBlobUrl] = useState("");   
    const [blobGalleryUrl, setBlobGalleryUrl] = useState("");   
    const [postInfo, setPostInfo] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewImageOpen, setIsViewImageOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState('success');
    const [alertMsg, setAlertMsg] = useState('');
    const [open, setOpen] = useState(false);
    const [vertical] = useState('top');
    const [horizontal] = useState('right');
    const [totalItem, setTotalItem] = useState(0);
    const isFirstRender = useRef(false);
    const navigate = useNavigate();
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [selectComment, setSelectComment] = useState(-1);
    const [commentInfo, setCommentInfo] = useState([]);
    const [comment, setComment] = useState("");

    const convertImage = useCallback((image) => {
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
    }, []);

    const getHotelInfor  = useCallback(() => {
        axios.get(userInforUrl)
            .then(response => {
                setHotelInfo(response.data);    
                setBlobUrl(convertImage(response.data.image))
            })
            .catch((error) => {
                console.log(error);
            });
    }, [userInforUrl, setHotelInfo, setBlobUrl, convertImage]);

    const getAllPost = useCallback(() => {
        axios.get(allPostUrl).then(res => {
            return res.data
        })
        .then(data =>{
            setPostInfo(data)
        })
    }, [allPostUrl, setPostInfo]);

    useEffect(() => {
        const authToken = localStorage.getItem("token")
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

        getHotelInfor();
        getAllPost();

    }, [getHotelInfor, getAllPost, convertImage])

    const dateFormat =(data) => {
        return moment(data).format('YYYY-MM-DD HH:mm:ss')
    }

    const toggleModal= useCallback((pageNum, clickGallery = false) => {
        axios.get(galleryUrl, {
            params: { hotelId: id,
                      index: pageNum  
                    },
        }).then(res => {
            return res.data;
        })
        .then(data =>{
            setBlobGalleryUrl(convertImage(data['image']))
            setGallery(data)
            setTotalItem(data['totalItem'])
            if (clickGallery) {
                setIsViewImageOpen(!isViewImageOpen)
                // setCurrentImage(0)
            }
        }).catch(error => {
            if (error.response.status ===404) {
                setOpen(true);
                setAlertTitle('error')
                setAlertMsg('No Images Upoladed')    
                setIsViewImageOpen(isViewImageOpen)
            }else {
                setOpen(true);
                setAlertTitle('error')
                setAlertMsg('Something went wrong.')    
                setIsViewImageOpen(isViewImageOpen)
            }
        })
    }, []);

    const nextImage = () => {
        isFirstRender.current = true;
        setCurrentImage(currentImage => currentImage + 1); 
    };

    const prevImage = () => {
        isFirstRender.current = true;
        setCurrentImage(currentImage => currentImage - 1);    
    };

    const closeModal = () => {
        setIsViewImageOpen(false);
    };

    useEffect(() => {
        if (isFirstRender.current && currentImage >= 0) {
            toggleModal(currentImage);
        }
    }, [currentImage]);

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

    const addLike=(postId) => {
        const data ={
            userId: +localStorage.getItem("id"),
            postId: postId
        }
        axios.post(likeUrl, data).then(async response => {
            if(response.status === 201) {
                const response = await axios.get(allPostUrl);
                setPostInfo(response.data);
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
    };

    const commentModal=(postId) => {
        setIsCommentOpen(!isCommentOpen)
        setSelectComment(postId)
        if(!isCommentOpen) {
            axios.get(`${port}/get-comment/${postId}`)
                .then(res => {
                    return res.data
                })
                .then(data =>{
                    setCommentInfo(data)
                })
        }
    }

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "comment"){
            setComment(value);
        }
    }

    const sendComment=() => {
        const data ={
            userId:  localStorage.getItem("id"),
            postId: selectComment,
            comment: comment
        }
        if(comment !== '') {
            axios.post("/sent-comment", data)
                .then(res => {
                    if(res.status === 201) {
                        setOpen(true);
                        setAlertTitle('success')
                        setAlertMsg('Successfully send the comment')
                        setComment("");
                    }else {
                        setOpen(true);
                        setAlertTitle('error')
                        setAlertMsg('Something went wrong')
                    }
                })
                .then(() => {
                    axios.get(`${port}/get-comment/${selectComment}`)
                        .then(res => {
                            return res.data
                        })
                        .then(data =>{
                            setCommentInfo(data)
                        })
                })
                .catch(error => {
                    setOpen(true);
                    setAlertTitle('error')
                    setAlertMsg('Something went wrong')    
                })
        }else {
            setOpen(true);
            setAlertTitle('warning')
            setAlertMsg('Please enter the comment')
        }  
    }

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

                                <Button onClick={() => toggleModal(currentImage, true)}>
                                    View Images
                                </Button>

                                <Modal isOpen={isViewImageOpen} contentLabel="Comments" id="gallery-modal" className="comment-modal" overlayClassName="comment-overlay">
                                    <div className="gallery-header">
                                        <h2 className='mb-4 font-effect-shadow-multiple' id='username'>Gallery</h2>
                                        <button className="gallery-clsoe" onClick={closeModal}>
                                            <FaTimes />
                                        </button>
                                    </div>
                                    
                                    <div className="gallery-container">
                                        <img src={blobGalleryUrl} alt="hotel" className='gallery-image'/>
                                    </div>
                                    
                                    <div className="gallery-btn-container">
                                        { currentImage > 0 && (
                                            <button className='gallery-btn' onClick={prevImage} ><FaChevronLeft /></button>
                                        )}
                                        <p>{currentImage+1} / {totalItem}</p>
                                        { currentImage+1 < totalItem && (
                                            <button className='gallery-btn' onClick={nextImage} ><FaChevronRight /></button>
                                        )}
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
                                    <img src={convertImage(item.postDetailsDto.postImage)} alt="post" style={{width:"100%", height:"60%"}} />
                                    {item.likeDetailsDto['liked'] ? (
                                            <Button id="dislike-btn" disabled>
                                                <FaThumbsUp />
                                                <div id="like-count">
                                                    {item.likeDetailsDto.likeCount } like 
                                                </div>
                                            </Button>
                                        ) : (
                                            <Button id="like-btn" onClick={() => addLike(item.postDetailsDto.postId)}>
                                                <FaThumbsUp />
                                                <div id="like-count">
                                                    {item.likeDetailsDto.likeCount } like 
                                                </div>
                                            </Button>
                                        )
                                    }

                                    <Button id="comment-btn" onClick={() => commentModal(item.postDetailsDto.postId)}>
                                        <FaComment />
                                    </Button>

                                    <Modal isOpen={isCommentOpen} onRequestClose={commentModal} contentLabel="Comments" className="comment-modal" overlayClassName="comment-overlay">
                                        <h2 className='mb-4 font-effect-shadow-multiple' id='username'>
                                            Comments
                                        </h2>
                                        <div className='comment-list'>
                                            {commentInfo.map(element => (
                                                <div>
                                                    <hr></hr>
                                                    {/* <img src={require('../../asset/person.jpg')} alt="person" style={{width:"55px", height:"55px", borderRadius:"100%"}} /> */}
                                                    <img src={convertImage(element.userImage)} alt="person" style={{width:"55px", height:"55px", borderRadius:"100%"}} />
                                                    <h3 className='font-effect-shadow-multiple' id='comment-header'>
                                                        {element.userName}
                                                    </h3>
                                                    <h4 id='post-comment'>{element.comment}</h4>
                                                    <p id='comment-time'>{dateFormat(element.time)}</p>
                                                </div>
                                            ))}
                                            <hr></hr>
                                            <div hidden={commentInfo.length!==0}>
                                                <h5 id="no-content">No comment</h5>
                                                <hr></hr>
                                            </div>
                                        </div>
                                        
                                        <div className='comment-filed'>
                                            <input type="text" className='comment-input' placeholder="Enter your comment" id="comment" value={comment} onChange={(e) => handleInputChange(e)}/>
                                            <Button id='comment-send' onClick={sendComment}><FaTelegramPlane/></Button>
                                        </div>
                                    </Modal>
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