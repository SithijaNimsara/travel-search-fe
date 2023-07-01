import React, { Component, useEffect, useState } from 'react';
import { FaComment, FaThumbsUp, FaUser, FaSignOutAlt, FaTelegramPlane } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Footer from '../Footer/Footer';
import axios from 'axios';
import moment from 'moment';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Modal from "react-modal";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// import { useNavigate } from "react-router-dom"

Modal.setAppElement("#root");
export default function NormalUser() {

    const [userInfo, setUserInfo] = useState([]);
    const [blobUrl, setBlobUrl] = useState("");
    const location = useLocation();
    const [postInfo, setPostInfo] = useState([]);
    const [commentInfo, setCommentInfo] = useState([]);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [selectComment, setSelectComment] = useState(-1);
   
    const [alertTitle, setAlertTitle] = useState('success');
    const [alertMsg, setAlertMsg] = useState('');
    const [open, setOpen] = useState(false);
    const [vertical, setVertical] = useState('top');
    const [horizontal, setHorizontal] = useState('right');
    // const postInfo=[]
    const data = location.state?.data || '';
    const navigate = useNavigate();

    
    useEffect(() => {
        const authToken = localStorage.getItem("token")
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
        let userId = data['userId']
        getUserInfor(userId)
        getAllPost(userId)

    }, [])

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

    const getAllPost =(userId)  => {
        axios.get(`all-post/${userId}`).then(res => {
            return res.data
        })
        .then(data =>{
            setPostInfo(data)
        })
    }

    const getUserInfor =(userId) => {
        axios.get(`user-infor/${userId}`)
            .then(response => {
                setUserInfo(response.data);    
                setBlobUrl(convertImage(response.data.image))

            })
            .catch((error) => {
                console.log(error);
            });
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
                // .then(() => {
                //     commentInfo.map(item => {
                //         console.log(item.commentId);
                //         console.log(item.userName);
                //     })
                // })
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
            axios.post("/sent-comment", data).
                then(res => {
                    if(res.status === 201) {
                        setOpen(true);
                        setAlertTitle('success')
                        setAlertMsg('Successfully send the comment')
                    }else {
                        setOpen(true);
                        setAlertTitle('error')
                        setAlertMsg('Something went wrong')
                    }
                }).
                then(() => {
                    axios.get(`get-comment/${selectComment}`)
                        .then(res => {
                            return res.data
                        })
                        .then(data =>{
                            setCommentInfo(data)
                        })
                }).
                catch(error => {
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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    const addLike=(postId) => {
        
        const data ={
            userId:  +localStorage.getItem("id"),
            postId: postId
        }
        console.log("data", data);
        axios.post("add-like", data).then(async response => {
            if(response.status === 201) {

                const response = await axios.get(`all-post/${localStorage.getItem("id")}`);
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

    const logOut = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("id")
        navigate('/')
    };

    return(
            <div id="container-1">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sofia&effect=outline|emboss|fire"></link>
                <div id="container-2">
                    <div id="nav" style={{clear: 'both'}}>
                        <div id="nav-1">
                            <h1 className='font-effect-fire' id='header'><i>TravelWithUs</i></h1>
                        </div>
                            
                        <Form.Group>
                            <Form.Control type="text" id="search-field" placeholder="Search" />
                        </Form.Group>
                        
                        <div id="nav-2">
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
                                <h2 className='mb-4 font-effect-shadow-multiple' id='username'>{userInfo.name}</h2>
                                <div id='person-img' className='mb-4'>
                                    {/* <img src={require('../../asset/person.jpg')} alt="person" style={{width:"100px", height:"100px", borderRadius:"100%"}} /> */}
                                    <img src={blobUrl} alt="person" style={{width:"100px", height:"100px", borderRadius:"100%"}} />
                                </div>
                                <h4 className='mb-3'>{userInfo.address}</h4>
                                <h4 className='mb-3'>{userInfo.state}</h4>
                                <h4 className='mb-3'>{userInfo.country}</h4>
                                
                            </div>
                        </div>

                        
                        <div id="middle">
                            {postInfo.map(item => (
                                <div id="content-middle">
                
                                    <img src={convertImage(item.hotelDetailsDto['hotelImage'])} alt="hotel" style={{width:"55px", height:"55px", borderRadius:"100%"}} />
                                    <Link to={`/view-hotel/${item.hotelDetailsDto['hotelId']}`} style={{ textDecoration: 'none', color:"black" }}>
                                        <h2 className='font-effect-shadow-multiple' id='post-header'>
                                            {item.hotelDetailsDto['name']}
                                        </h2>
                                    </Link>
                                    <p id='post-time'>
                                        {dateFormat(item.postDetailsDto['time'])}
                                    </p>

                                   
                                    <h6>{item.postDetailsDto['caption']}</h6>
                                    <img src={convertImage(item.postDetailsDto['postImage'])} alt="post" style={{width:"100%", height:"60%"}} />
                                    
                                    
                                    {item.likeDetailsDto['liked'] ? (
                                            <Button id="dislike-btn" disabled>
                                                <FaThumbsUp />
                                                <div id="like-count">
                                                    {item.likeDetailsDto['likeCount'] } like 
                                                </div>
                                            </Button>
                                        ) : (
                                            <Button id="like-btn" onClick={() => addLike(item.postDetailsDto['postId'])}>
                                                <FaThumbsUp />
                                                <div id="like-count">
                                                    {item.likeDetailsDto['likeCount'] } like 
                                                </div>
                                            </Button>
                                        )
                                    }
                                    
                                    <Button id="comment-btn" onClick={() => toggleModal(item.postDetailsDto['postId'])}>
                                        <FaComment />
                                    </Button>

                                    <Modal isOpen={isCommentOpen} onRequestClose={toggleModal} contentLabel="Comments" className="comment-modal" overlayClassName="comment-overlay">
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
                                <h2 id='rate-header' className='font-effect-shadow-multiple'>Rated Hotels and Restaurants</h2>
                                <img src={require('../../asset/hotel.jpg')} className="mb-2" alt="hotel" style={{width:"45px", height:"45px", borderRadius:"100%"}} />
                                <h5 id='rate-hotel' >Abdfdfc Galadkkk dfgdgdf Hotel</h5>
                                <span id='line-1' className='mb-3'></span>
                                <img src={require('../../asset/hotel.jpg')} className="mb-2" alt="hotel" style={{width:"45px", height:"45px", borderRadius:"100%"}} />
                                <h5 id='rate-hotel'>Abdfdfc dfgdgdf Hotel</h5>
                                
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
 
// export default NormalUser;